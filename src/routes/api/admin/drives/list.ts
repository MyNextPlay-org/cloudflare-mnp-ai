import { requireAuth } from "@/helpers/auth";
import { listDrives } from "@/helpers/google-drive";
import { getUser } from "@/models/user";

export const GET = async (request: Request, env: Env, _ctx: ExecutionContext) => {
  try {
    const user = await requireAuth(request, env);
    const userRecord = await getUser(env, user.email);

    if (!userRecord?.drive_refresh_token) {
      return new Response(JSON.stringify({ error: "Not connected to Google Drive" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // List available drives
    const drives = await listDrives(env, userRecord.drive_refresh_token);
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
