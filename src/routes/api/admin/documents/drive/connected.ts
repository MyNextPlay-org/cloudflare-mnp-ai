import { requireAuth } from "@/helpers/auth";

export const GET = async (request: Request, env: Env) => {
  try {
    const user = await requireAuth(request, env);
    return new Response(JSON.stringify({ connected: !!user.drive_refresh_token }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ connected: false }), {
      headers: { "Content-Type": "application/json" },
    });
  }
};
