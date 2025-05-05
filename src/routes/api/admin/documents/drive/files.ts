import { requireAuth } from "../../../../../helpers/auth";
import {
  listFiles,
  downloadAsMarkdown,
  getFileMetadata,
} from "../../../../../helpers/google-drive";
import { createDocument } from "../../../../../models/document";
import { nanoid } from "nanoid";

export const GET = async (request: Request, env: Env) => {
  try {
    const user = await requireAuth(request, env);
    if (!user.drive_refresh_token) return new Response("Not connected", { status: 400 });
    const files = await listFiles(env, user.drive_refresh_token);
    return new Response(JSON.stringify(files), { headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }
};

export const POST = async (request: Request, env: Env) => {
  try {
    const user = await requireAuth(request, env);
    if (!user.drive_refresh_token) return new Response("Not connected", { status: 400 });
    const { fileIds } = (await request.json()) as { fileIds: string[] };
    for (const fileId of fileIds) {
      const content = await downloadAsMarkdown(env, fileId, user.drive_refresh_token);
      const metadata = await getFileMetadata(env, fileId, user.drive_refresh_token);
      await createDocument(env, {
        id: nanoid(),
        title: metadata.name,
        content,
        drive_file_id: fileId,
        drive_connected: true,
      });
    }
    return new Response("{}", { headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }
};
