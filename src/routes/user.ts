import { getCorsHeaders } from "../helpers/cors";
import { getDb } from "../helpers/db";

export const OPTIONS = async (request: Request): Promise<Response> => {
  const cors = getCorsHeaders(request);
  const reqHeaders = request.headers.get("Access-Control-Request-Headers") || "";
  return new Response(null, {
    status: 204,
    headers: {
      ...cors,
      "Access-Control-Allow-Headers": reqHeaders,
    },
  });
};

export const GET = async (request: Request, env: Env): Promise<Response> => {
  const cors = getCorsHeaders(request);
  const cookieHeader = request.headers.get("Cookie") || "";
  const match = cookieHeader.match(/token=([^;]+)/);
  if (!match) {
    return new Response(JSON.stringify({ error: "No token" }), {
      status: 401,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const token = match[1];
  const user = await getDb(env)
    .selectFrom("users")
    .select("email")
    .where("token", "=", token)
    .executeTakeFirst();

  if (!user) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true, user }), {
    status: 200,
    headers: { ...cors, "Content-Type": "application/json" },
  });
};
