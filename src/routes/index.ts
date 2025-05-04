import { getClientEntry } from "@respond-run/manifest";
import example from "../components/example/example";
import layout from "../components/layout/layout";

export const GET = async (_request: Request, env: Env, _ctx: ExecutionContext) => {
  const { scriptPath, stylePath } = await getClientEntry((path) =>
    env.ASSETS.fetch("https://worker" + path),
  );

  return new Response(
    await layout.render({ body: await example.render(), title: "Index", scriptPath, stylePath }),
    {
      headers: {
        "Content-Type": "text/html",
      },
    },
  );
};
