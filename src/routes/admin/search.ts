import { requireAuth } from "@/helpers/auth";
import layout from "@/components/layout/layout";
import adminSearch from "@/components/admin-search/admin-search";
import manifest from "@/helpers/manifest";

export const GET = async (request: Request, env: Env) => {
  try {
    await requireAuth(request, env);
    const { scriptPaths, stylePaths } = await manifest(env);
    const body = await adminSearch.render();
    return new Response(
      await layout.render({
        body,
        title: "Admin – Search",
        scriptPaths,
        stylePaths,
      }),
      { headers: { "Content-Type": "text/html" } },
    );
  } catch {
    return Response.redirect(new URL(request.url).origin + "/login", 302);
  }
};
