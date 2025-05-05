import { requireAuth } from "@/helpers/auth";
import layout from "@/components/layout/layout";
import adminUsers from "@/components/admin-users/admin-users";
import manifest from "@/helpers/manifest";

export const GET = async (request: Request, env: Env, _ctx: ExecutionContext) => {
  try {
    await requireAuth(request, env);
    const { scriptPaths, stylePaths } = await manifest(env);
    return new Response(
      await layout.render({
        body: await adminUsers.render(),
        title: "Admin – Users",
        scriptPaths,
        stylePaths,
      }),
      { headers: { "Content-Type": "text/html" } },
    );
  } catch (err) {
    console.error("[AdminUsers] Error:", err);
    const url = new URL(request.url);
    return Response.redirect(`${url.origin}/login`, 302);
  }
};
