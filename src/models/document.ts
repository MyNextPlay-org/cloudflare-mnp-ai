import { getDb } from "@/helpers/db";
import { indexDocument, deleteDocumentVector } from "@/helpers/vectorize";

export type Document = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  drive_file_id: string | null;
  drive_id: string | null;
  drive_file_modified_at: string | null;
};

export async function listDocuments(env: Env): Promise<Document[]> {
  return getDb(env).selectFrom("documents").selectAll().execute();
}

export async function getDocument(env: Env, id: string): Promise<Document | undefined> {
  return getDb(env).selectFrom("documents").selectAll().where("id", "=", id).executeTakeFirst();
}

export async function createDocument(env: Env, doc: Omit<Document, "created_at">): Promise<void> {
  const now = new Date().toISOString();
  await getDb(env)
    .insertInto("documents")
    .values({ ...doc, created_at: now })
    .execute();

  // index into Vectorize
  await indexDocument(doc.id, doc.content, { title: doc.title, driveId: doc.drive_id }, env);
}

export async function deleteDocument(env: Env, id: string): Promise<number> {
  const [result] = await getDb(env).deleteFrom("documents").where("id", "=", id).execute();

  if (result.numDeletedRows > 0) {
    await deleteDocumentVector(id, env);
  }

  return Number(result.numDeletedRows);
}

export async function updateDocumentByDriveFileId(
  env: Env,
  driveFileId: string,
  updates: {
    title: string;
    content: string;
    drive_file_modified_at: string;
  },
): Promise<void> {
  await getDb(env)
    .updateTable("documents")
    .set(updates)
    .where("drive_file_id", "=", driveFileId)
    .execute();

  // re-index updated content
  const doc = await getDb(env)
    .selectFrom("documents")
    .selectAll()
    .where("drive_file_id", "=", driveFileId)
    .executeTakeFirst();
  if (doc) {
    await indexDocument(doc.id, doc.content, { title: doc.title, driveId: doc.drive_id }, env);
  }
}

export async function findDocumentsByIds(env: Env, ids: string[]): Promise<Document[]> {
  return getDb(env).selectFrom("documents").selectAll().where("id", "in", ids).execute();
}
