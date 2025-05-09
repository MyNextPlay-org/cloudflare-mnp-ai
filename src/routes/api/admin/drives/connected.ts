import { requireAuth } from "@/helpers/auth";
import { getUser } from "@/models/user";

export const GET = async (request: Request, env: Env, _ctx: ExecutionContext) => {
  try {
    const user = await requireAuth(request, env);
    const userRecord = await getUser(env, user.email);

    return new Response(JSON.stringify({ connected: Boolean(userRecord?.drive_refresh_token) }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
};
