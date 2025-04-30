import { getCorsHeaders } from "../../helpers/cors";
import { getPasskeyApi } from "../../helpers/passkey-server";
import { findByEmail } from "../../models/user";

interface RequestBody {
  email: string;
}

export const POST = async (request: Request, env: Env): Promise<Response> => {
  const cors = getCorsHeaders(request);
  const { email } = (await request.json()) as RequestBody;
  const normalized = email.trim().toLowerCase();
  const user = await findByEmail(env, normalized);
  const passkey = getPasskeyApi(env);
  if (!user?.verified) {
    return new Response(JSON.stringify({ error: "User not verified" }), {
      status: 401,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
  if (user?.registered) {
    const options = await passkey.login.initialize();
    return new Response(JSON.stringify({ mode: "login", ...options }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } else {
    const options = await passkey.registration.initialize({
      userId: normalized,
      username: normalized,
    });
    return new Response(JSON.stringify({ mode: "registration", ...options }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
};
