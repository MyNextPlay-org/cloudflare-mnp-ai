import { requireAuth } from "../../helpers/auth";
import layout from "../../components/layout/layout";
import adminUsers from "../../components/admin-users/admin-users";
import { getClientEntry } from "@respond-run/manifest";

export const GET = async (request: Request, env: Env, _ctx: ExecutionContext) => {
  try {
    await requireAuth(request, env);
    const { scriptPath, stylePath } = await getClientEntry((path) =>
      env.ASSETS.fetch("https://worker" + path),
    );
    return new Response(
      await layout.render({
        body: await adminUsers.render(),
        title: "Admin – Users",
        scriptPath,
        stylePath,
      }),
      { headers: { "Content-Type": "text/html" } },
    );
  } catch (err) {
    console.error("[AdminUsers] Error:", err);
    return Response.redirect("/login", 302);
  }
};
