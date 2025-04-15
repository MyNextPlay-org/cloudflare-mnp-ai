import { html, raw } from "@dropsite/respond";
import example from "../components/example";

export const GET = defineRoute(async (_, env) => {
  const body = example.render("example()");

  const res = await env.ASSETS.fetch('https://worker/.vite/manifest.json');
  const manifest = await res.json();
  console.log(manifest)

  return new Response(html`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Example</title>
  </head>
  <body>
    ${raw(body)}
    <script type="module" src="/src/client.ts"></script>
  </body>
</html>`, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
});

export function defineRoute(
  fn: (request: Request & { params: Record<string, string> }, env: Env, ctx: ExecutionContext) => Promise<Response>
) {
  return fn;
}