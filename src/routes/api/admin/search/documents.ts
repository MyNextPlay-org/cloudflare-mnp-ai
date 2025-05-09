import { requireAuth } from "@/helpers/auth";

interface SearchRequest {
  query: string;
}

export const POST = async (request: Request, env: Env) => {
  try {
    // 1) Enforce login
    await requireAuth(request, env);

    // 2) Parse query
    const { query } = (await request.json()) as SearchRequest;

    // 3) Embed the query
    const emb = await env.AI.run("@cf/baai/bge-base-en-v1.5", { text: [query] });
    const vector = emb.data[0];

    // 4) Query Vectorize and return all metadata & scores
    const result = await env.VECTORIZE.query(vector, {
      topK: 10,
      returnValues: false, // omit the raw vector data unless you want it
      returnMetadata: "all", // include whatever metadata you indexed
    });

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Unauthorized or bad request" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
};
