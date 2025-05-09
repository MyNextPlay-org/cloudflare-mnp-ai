import { requireAuth } from "@/helpers/auth";
import { listFilesInDrive, downloadAsMarkdown } from "@/helpers/google-drive";
import { getUserDrive, updateUserDrive } from "@/models/user-drive";
import { createDocument } from "@/models/document";
import { getUser } from "@/models/user";

export const POST = async (
  request: Request,
  env: Env,
  _ctx: ExecutionContext,
  params: { driveId: string },
) => {
  try {
    const user = await requireAuth(request, env);
    const { driveId } = params;

    // Get user drive
    const userDrive = await getUserDrive(env, driveId);
    if (!userDrive || userDrive.user_email !== user.email) {
      return new Response(JSON.stringify({ error: "Drive not found" }), {
        status: 404,
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

    try {
      // List files in drive
      const driveFiles = await listFilesInDrive(
        env,
        userRecord.drive_refresh_token,
        userDrive.drive_id,
      );

      // Download and create documents
      for (const file of driveFiles) {
        const content = await downloadAsMarkdown(env, file.id, userRecord.drive_refresh_token);
        await createDocument(env, {
          id: crypto.randomUUID(),
          title: file.name,
          content,
          drive_file_id: file.id,
          drive_id: userDrive.drive_id,
        });
      }

      // Update drive metadata
      await updateUserDrive(env, userDrive.id, {
        file_count: driveFiles.length,
        last_synced_at: new Date().toISOString(),
      });

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error syncing drive:", error);
      return new Response(
        JSON.stringify({
          error: "Failed to sync drive",
          details: error instanceof Error ? error.message : String(error),
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  } catch (error) {
    console.error("Auth error:", error);
    return new Response(
      JSON.stringify({
        error: "Authentication failed",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
