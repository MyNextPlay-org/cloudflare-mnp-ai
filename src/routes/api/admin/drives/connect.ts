import { requireAuth } from "@/helpers/auth";
import { getAuthUrl, exchangeCode } from "@/helpers/google-drive";
import { setDriveTokens, markDriveConnected } from "@/models/user";

export const GET = async (request: Request, env: Env, _ctx: ExecutionContext) => {
  try {
    const user = await requireAuth(request, env);
    const url = new URL(request.url);

    // If we have a code, exchange it for tokens
    const code = url.searchParams.get("code");
    if (code) {
      const { refresh_token } = await exchangeCode(
        code,
        `${url.origin}/api/admin/drives/connect`,
        env,
      );
      await setDriveTokens(env, user.email, refresh_token);
      await markDriveConnected(env, user.email);
      return Response.redirect(`${url.origin}/admin/drives`, 302);
    }

    // Otherwise, redirect to Google OAuth
    const authUrl = getAuthUrl(`${url.origin}/api/admin/drives/connect`, env.GOOGLE_CLIENT_ID);
    return Response.redirect(authUrl, 302);
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
};
