import type { VectorizeVector } from "@cloudflare/workers-types";

export async function indexDocument(
  id: string,
  text: string,
  metadata: Record<string, any>,
  env: Env,
) {
  const resp = await env.AI.run("@cf/baai/bge-base-en-v1.5", { text: [text] });
  const values = resp.data[0];
  const vector: VectorizeVector = { id, values, metadata };
  await env.VECTORIZE.upsert([vector]);
}

export async function deleteDocumentVector(id: string, env: Env) {
  await env.VECTORIZE.deleteByIds([id]);
}
