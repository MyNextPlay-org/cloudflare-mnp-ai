import example from "../components/example/example";
import layout from "../components/layout/layout";
import manifest from "../helpers/manifest";

export const GET = async (_request: Request, env: Env, _ctx: ExecutionContext) => {
  const { scriptPaths, stylePaths } = await manifest(env);

  return new Response(
    await layout.render({ body: await example.render(), title: "Index", scriptPaths, stylePaths }),
    {
      headers: {
        "Content-Type": "text/html",
      },
    },
  );
};
