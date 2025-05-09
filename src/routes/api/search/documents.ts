import { findDocumentsByIds } from "@/models/document";

interface SearchRequest {
  query: string;
}

export const POST = async (req: Request, env: Env) => {
  const { query } = (await req.json()) as SearchRequest;

  // 1) embed the query text
  const emb = await env.AI.run("@cf/baai/bge-base-en-v1.5", { text: [query] });
  const vector = emb.data[0];

  // 2) search Vectorize
  const { matches } = await env.VECTORIZE.query(vector, {
    topK: 10,
    returnMetadata: "indexed",
  });

  // 3) fetch full docs by ID
  const docs = await findDocumentsByIds(
    env,
    matches.map((m) => m.id),
  );

  return new Response(JSON.stringify(docs), {
    headers: { "Content-Type": "application/json" },
  });
};
