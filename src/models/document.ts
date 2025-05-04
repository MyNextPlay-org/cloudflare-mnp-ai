import { getDb } from "../helpers/db";

export type Document = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  drive_file_id: string | null;
  drive_connected: boolean;
};

export async function listDocuments(env: Env): Promise<Document[]> {
  return getDb(env).selectFrom("documents").selectAll().execute();
}

export async function getDocument(env: Env, id: string): Promise<Document | undefined> {
  return getDb(env).selectFrom("documents").selectAll().where("id", "=", id).executeTakeFirst();
}

export async function createDocument(env: Env, doc: Omit<Document, "created_at">): Promise<void> {
  await getDb(env)
    .insertInto("documents")
    .values({
      ...doc,
      created_at: new Date().toISOString(),
    })
    .execute();
}

export async function deleteDocument(env: Env, id: string): Promise<number> {
  const [result] = await getDb(env).deleteFrom("documents").where("id", "=", id).execute();
  return Number(result.numDeletedRows);
}
