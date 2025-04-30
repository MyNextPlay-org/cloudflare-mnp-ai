import { parseTokenCookie } from "../helpers/cookies";
import { getCorsHeaders } from "../helpers/cors";
import { findByToken } from "../models/user";

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
  const token = parseTokenCookie(request);
  if (!token) {
    return new Response(JSON.stringify({ error: "No token" }), {
      status: 401,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const user = await findByToken(env, token);

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
