import { requireAuth } from "@/helpers/auth";
import { listDrives, getDriveFileCount } from "@/helpers/google-drive";
import { createUserDrive, listUserDrives } from "@/models/user-drive";
import { getUser } from "@/models/user";

export const GET = async (request: Request, env: Env, _ctx: ExecutionContext) => {
  try {
    const user = await requireAuth(request, env);
    const drives = await listUserDrives(env, user.email);
    return new Response(JSON.stringify(drives), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const POST = async (request: Request, env: Env, _ctx: ExecutionContext) => {
  try {
    const user = await requireAuth(request, env);
    const { driveIds } = (await request.json()) as any;

    if (!Array.isArray(driveIds)) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userRecord = await getUser(env, user.email);
    if (!userRecord?.drive_refresh_token) {
      return new Response(JSON.stringify({ error: "Not connected to Google Drive" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get available drives
    const availableDrives = await listDrives(env, userRecord.drive_refresh_token);
    const drivesToAdd = availableDrives.filter((drive) => driveIds.includes(drive.id));

    // Create user drives
    for (const drive of drivesToAdd) {
      const fileCount = await getDriveFileCount(env, drive.id, userRecord.drive_refresh_token);
      await createUserDrive(env, {
        id: crypto.randomUUID(),
        user_email: user.email,
        drive_id: drive.id,
        name: drive.name,
        file_count: fileCount,
      });
    }

    // Return updated list
    const drives = await listUserDrives(env, user.email);
    return new Response(JSON.stringify(drives), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
};
