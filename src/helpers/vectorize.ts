import type { VectorizeVector } from "@cloudflare/workers-types";

export async function indexDocument(
  id: string,
  text: string,
  metadata: Record<string, any>,
  env: Env,
) {
  console.log("Indexing document:", {
    id,
    textLength: text.length,
    metadata,
  });

  const resp = await env.AI.run("@cf/baai/bge-large-en-v1.5", { text: [text] });
  const values = resp.data[0];
  console.log("Generated embedding vector of length:", values.length);

  const vector: VectorizeVector = { id, values, metadata };
  const result = await env.VECTORIZE.upsert([vector]);
  console.log("Vectorize upsert result:", result);
}

export async function deleteDocumentVector(id: string, env: Env) {
  const result = await env.VECTORIZE.deleteByIds([id]);
  console.log("Vectorize delete result:", result);
}
