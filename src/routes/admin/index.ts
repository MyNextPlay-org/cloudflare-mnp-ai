import { requireAuth } from "@/helpers/auth";

export const GET = async (request: Request, env: Env, _ctx: ExecutionContext) => {
  const url = new URL(request.url);
  try {
    await requireAuth(request, env);
    return Response.redirect(`${url.origin}/admin/users`, 302);
  } catch (err) {
    console.error("[AdminIndex] Error:", err);
    return Response.redirect(`${url.origin}/login`, 302);
  }
};
