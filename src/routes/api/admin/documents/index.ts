import { requireAuth } from "@/helpers/auth";
import { listDocuments, createDocument, deleteDocument } from "@/models/document";
import { nanoid } from "nanoid";

export const GET = async (request: Request, env: Env) => {
  try {
    await requireAuth(request, env);
    const docs = await listDocuments(env);
    console.log(
      "Found documents in database:",
      docs.map((d) => ({
        id: d.id,
        title: d.title,
        contentLength: d.content.length,
        drive_file_id: d.drive_file_id,
      })),
    );
    return new Response(JSON.stringify(docs), { headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }
};

export const POST = async (request: Request, env: Env) => {
  try {
    await requireAuth(request, env);
    const { title, content } = (await request.json()) as { title: string; content: string };
    await createDocument(env, {
      id: nanoid(),
      title,
      content,
      drive_file_id: null,
      drive_id: null,
      drive_file_modified_at: null,
    });
    return new Response("{}", { headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }
};

export const DELETE = async (request: Request, env: Env) => {
  try {
    await requireAuth(request, env);
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    await deleteDocument(env, id!);
    return new Response("{}", { headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }
};
