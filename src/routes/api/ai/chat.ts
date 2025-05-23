import { requireAuth } from "@/helpers/auth";

export const POST = async (request: Request, env: Env) => {
  try {
    await requireAuth(request, env);

    const { messages } = (await request.json()) as any;

    const result = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
      messages,
      stream: true,
      max_tokens: 8192,
    });

    if (result instanceof ReadableStream) {
      return new Response(result, {
        headers: { "content-type": "text/event-stream" },
      });
    }

    return new Response("Invalid AI response", { status: 500 });
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }
};
