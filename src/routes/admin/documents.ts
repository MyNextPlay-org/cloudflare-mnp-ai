import { requireAuth } from "../../helpers/auth";
import { getClientEntry } from "@respond-run/manifest";
import layout from "../../components/layout/layout";
import adminDocuments from "../../components/admin-documents/admin-documents";

export const GET = async (request: Request, env: Env, _ctx: ExecutionContext) => {
  try {
    await requireAuth(request, env);
    const { scriptPath, stylePath } = await getClientEntry((path) =>
      env.ASSETS.fetch("https://worker" + path),
    );
    return new Response(
      await layout.render({
        body: await adminDocuments.render(),
        title: "Admin – Documents",
        scriptPath,
        stylePath,
      }),
      { headers: { "Content-Type": "text/html" } },
    );
  } catch {
    return Response.redirect("/login", 302);
  }
};
