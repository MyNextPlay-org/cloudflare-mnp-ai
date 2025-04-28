import login from "../components/login";
import { getClientEntry } from "@respond-run/manifest";
import main from "../components/layout";

export const GET = async (_request: Request, env: Env, _ctx: ExecutionContext) => {
  const { scriptPath, stylePath } = await getClientEntry((path) =>
    env.ASSETS.fetch("https://worker" + path),
  );

  return new Response(
    main.render({ body: login.render(), title: "Login", scriptPath, stylePath }),
    {
      headers: { "Content-Type": "text/html" },
    },
  );
};
