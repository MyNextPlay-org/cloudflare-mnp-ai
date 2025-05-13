import { requireAuth } from "@/helpers/auth";
import { findDocumentsByIds } from "@/models/document";

interface SearchRequest {
  query: string;
}

export const POST = async (request: Request, env: Env) => {
  try {
    // 1) Enforce login
    await requireAuth(request, env);

    // 2) Parse query
    const { query } = (await request.json()) as SearchRequest;
    console.log("Searching for query:", query);

    // 3) Embed the query
    const emb = await env.AI.run("@cf/baai/bge-large-en-v1.5", { text: [query] });
    const vector = emb.data[0];
    console.log("Generated embedding vector of length:", vector.length);

    // 4) Query Vectorize and return all metadata & scores
    const { matches } = await env.VECTORIZE.query(vector, {
      topK: 10,
      returnValues: false,
      returnMetadata: "all",
    });
    console.log("Vectorize query returned matches:", matches.length);

    // 5) Fetch full document data
    const docs = await findDocumentsByIds(
      env,
      matches.map((m) => m.id),
    );
    console.log("Found documents in database:", docs.length);

    // 6) Combine document data with search scores
    const results = docs.map((doc) => {
      const match = matches.find((m) => m.id === doc.id);
      return {
        ...doc,
        score: match?.score,
        metadata: match?.metadata,
      };
    });

    // Log the final results
    console.log(
      "Final search results:",
      results.map((r) => ({
        id: r.id,
        title: r.title,
        score: r.score,
      })),
    );

    return new Response(JSON.stringify({ matches: results }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Search error:", err);
    return new Response(JSON.stringify({ error: "Unauthorized or bad request" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
};
