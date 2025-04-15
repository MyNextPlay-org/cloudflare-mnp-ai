import example from "../components/example";
import { getClientEntry } from "../lib/manifest";
import { defineRoute } from "../lib/routes";
import main from "../layouts/main";

export const GET = defineRoute(async (_, env) => {
  const { scriptPath, stylePath } = await getClientEntry(env);
  const body = example.render();

  return new Response(main.render(body, "Index", scriptPath, stylePath), {
    headers: {
      "Content-Type": "text/html",
    },
  });
});
