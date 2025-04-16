import example from "../components/example";
import { getClientEntry } from '@respond-run/manifest';
import { defineRoute } from '@respond-run/router';
import main from "../layouts/main";

export const GET = defineRoute<Env, ExecutionContext>(async (_, env) => {
  const { scriptPath, stylePath } = await getClientEntry(
    (path) => env.ASSETS.fetch('https://worker' + path)
  );
  const body = example.render();

  return new Response(main.render(body, "Index", scriptPath, stylePath), {
    headers: {
      "Content-Type": "text/html",
    },
  });
});
