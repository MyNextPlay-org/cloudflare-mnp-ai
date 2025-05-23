import { parseTokenCookie, setTokenCookie } from "@/helpers/cookies";
import { getCorsHeaders } from "@/helpers/cors";
import { getPasskeyApi } from "@/helpers/passkey-server";
import { findByEmail, setRegisteredByEmail } from "@/models/user";

interface RequestBody {
  email: string;
  credential: any;
}

export const POST = async (request: Request, env: Env): Promise<Response> => {
  const cors = getCorsHeaders(request);
  const body = (await request.json()) as RequestBody;
  const email = body.email.trim().toLowerCase();

  const passkey = getPasskeyApi(env);
  const user = await findByEmail(env, email);

  if (!user?.verified) {
    return new Response(JSON.stringify({ error: "User not verified" }), {
      status: 401,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  console.log("user", user);

  if (user?.registered) {
    const result = await passkey.login.finalize(body.credential);
    if (!result.token) {
      return new Response(JSON.stringify({ error: "Login failed" }), {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const cookie = setTokenCookie(request, user.token!);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...cors, "Content-Type": "application/json", "Set-Cookie": cookie },
    });
  }

  const token = parseTokenCookie(request);
  if (!token) {
    return new Response(JSON.stringify({ error: "No token" }), {
      status: 401,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  // registration flow
  const data = await passkey.registration.finalize(body.credential);
  if (!data.token) {
    return new Response(JSON.stringify({ error: "Registration failed" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  await setRegisteredByEmail(env, email);

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...cors, "Content-Type": "application/json" },
  });
};
