import { html, raw } from "@dropsite/respond";
import example from "../components/example";
import { getClientEntry } from "../lib/manifest";
import { defineRoute } from "../lib/routes";

export const GET = defineRoute(async (_, env) => {
  const body = example.render();
  const { scriptPath, stylePath } = await getClientEntry(env);

  return new Response(html`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Example</title>
    ${stylePath ? raw(`<link rel="stylesheet" href="${stylePath}">`) : ''}
  </head>
  <body>
    ${raw(body)}
    <script type="module" src="${scriptPath}"></script>
  </body>
</html>`, {
    headers: {
      "Content-Type": "text/html",
    },
  });
});
