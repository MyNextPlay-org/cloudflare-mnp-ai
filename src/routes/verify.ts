import { setTokenCookie } from "../helpers/cookies";
import { findByMagicToken, verifyByMagicToken } from "../models/user";

export const GET = async (request: Request, env: Env) => {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return new Response(JSON.stringify({ error: "Missing token" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const user = await findByMagicToken(env, token);

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const now = new Date().toISOString();
  const numUpdatedRows = await verifyByMagicToken(env, token, now);

  if (numUpdatedRows === 0) {
    return new Response(JSON.stringify({ error: "Invalid or expired link" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const cookie = setTokenCookie(request, user.token!);

  return new Response(null, {
    status: 302,
    headers: {
      Location: `${url.origin}/login?email=${encodeURIComponent(user.email)}`,
      "Set-Cookie": cookie,
    },
  });
};
