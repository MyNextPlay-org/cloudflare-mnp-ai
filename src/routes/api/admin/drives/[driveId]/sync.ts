import { requireAuth } from "@/helpers/auth";
import { listFilesInDrive, downloadAsMarkdown } from "@/helpers/google-drive";
import { getUserDrive, updateUserDrive } from "@/models/user-drive";
import { createDocument, updateDocumentByDriveFileId } from "@/models/document";
import { getUser } from "@/models/user";
import { getDb } from "@/helpers/db";

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

      console.log("Found files in drive:", driveFiles.length);

      // Download and create/update documents
      for (const file of driveFiles) {
        const existing = await getDb(env)
          .selectFrom("documents")
          .selectAll()
          .where("drive_file_id", "=", file.id)
          .executeTakeFirst();

        if (existing) {
          // Skip if nothing has changed since last import
          if (existing.drive_file_modified_at === file.modifiedTime) {
            console.log("Skipping unchanged file:", file.name);
            continue;
          }

          // Download and update if modified
          const content = await downloadAsMarkdown(env, file.id, userRecord.drive_refresh_token);
          console.log("Updating file:", file.name, "Content length:", content.length);
          await updateDocumentByDriveFileId(env, file.id, {
            title: file.name,
            content,
            drive_file_modified_at: file.modifiedTime,
          });
        } else {
          // Create new document
          const content = await downloadAsMarkdown(env, file.id, userRecord.drive_refresh_token);
          console.log("Creating new file:", file.name, "Content length:", content.length);
          await createDocument(env, {
            id: crypto.randomUUID(),
            title: file.name,
            content,
            drive_file_id: file.id,
            drive_id: userDrive.drive_id,
            drive_file_modified_at: file.modifiedTime,
          });
        }
      }

      // Update drive metadata
      await updateUserDrive(env, userDrive.id, {
        file_count: driveFiles.length,
        last_synced_at: new Date().toISOString(),
      });

      // Get Vectorize index status
      try {
        const indexInfo = await env.VECTORIZE.describe();
        console.log("Raw Vectorize index info:", indexInfo);

        // Check if we have any vectors in the index
        const testQuery = await env.VECTORIZE.query(new Array(1024).fill(0), {
          topK: 1,
          returnValues: false,
          returnMetadata: "none",
        });
        console.log("Test query results:", testQuery);

        return new Response(
          JSON.stringify({
            success: true,
            vectorizeStatus: {
              vectorsCount: indexInfo.vectorsCount,
              lastProcessedAt: new Date().toISOString(),
              config: indexInfo.config,
              testQueryCount: testQuery.count,
            },
          }),
          {
            headers: { "Content-Type": "application/json" },
          },
        );
      } catch (vectorizeErr) {
        console.error("Vectorize status check failed:", vectorizeErr);
        return new Response(
          JSON.stringify({
            success: true,
            vectorizeError:
              vectorizeErr instanceof Error ? vectorizeErr.message : String(vectorizeErr),
          }),
          {
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    } catch (err) {
      console.error("Drive sync error:", err);
      return new Response(JSON.stringify({ error: "Failed to sync drive" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Unauthorized or bad request" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
};
