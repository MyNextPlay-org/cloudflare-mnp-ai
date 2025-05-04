import { requireAuth } from "../../../../../helpers/auth";
import { getAuthUrl } from "../../../../../helpers/google-drive";

export const GET = async (request: Request, env: Env) => {
  try {
    await requireAuth(request, env);
    const url = new URL(request.url);
    const redirectUri = `${url.origin}/api/admin/documents/drive/callback`;
    const authUrl = getAuthUrl(redirectUri, env.GOOGLE_CLIENT_ID);
    return Response.redirect(authUrl, 302);
  } catch {
    return Response.redirect("/login", 302);
  }
};
