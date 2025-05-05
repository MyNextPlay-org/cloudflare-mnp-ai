import { requireAuth } from "@/helpers/auth";
import layout from "@/components/layout/layout";
import adminDocuments from "@/components/admin-documents/admin-documents";
import manifest from "@/helpers/manifest";

export const GET = async (request: Request, env: Env, _ctx: ExecutionContext) => {
  try {
    await requireAuth(request, env);
    const { scriptPaths, stylePaths } = await manifest(env);
    return new Response(
      await layout.render({
        body: await adminDocuments.render(),
        title: "Admin – Documents",
        scriptPaths,
        stylePaths,
      }),
      { headers: { "Content-Type": "text/html" } },
    );
  } catch {
    const url = new URL(request.url);
    return Response.redirect(`${url.origin}/login`, 302);
  }
};
