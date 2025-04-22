import example from "../components/example";
import { getClientEntry } from '@respond-run/manifest';
import main from "../layouts/main";

export const GET = async (_: Request, env: Env, __: ExecutionContext) => {
  const { scriptPath, stylePath } = await getClientEntry(
    (path) => env.ASSETS.fetch('https://worker' + path)
  );
  const body = example.render();

  return new Response(main.render(body, "Index", scriptPath, stylePath), {
    headers: {
      "Content-Type": "text/html",
    },
  });
};
