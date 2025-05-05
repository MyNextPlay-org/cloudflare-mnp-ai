import { requireAuth } from "@/helpers/auth";
import { exchangeCode } from "@/helpers/google-drive";
import { markDriveConnected, setDriveTokens } from "@/models/user";

export const GET = async (request: Request, env: Env) => {
  try {
    const user = await requireAuth(request, env);
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    if (!code) return new Response("Missing code", { status: 400 });
    const redirectUri = `${url.origin}/api/admin/documents/drive/callback`;
    const { refresh_token } = await exchangeCode(code, redirectUri, env);
    await setDriveTokens(env, user.email, refresh_token);
    await markDriveConnected(env, user.email);
    return Response.redirect("/admin/documents", 302);
  } catch (err) {
    console.error(err);
    return new Response("OAuth error", { status: 400 });
  }
};
