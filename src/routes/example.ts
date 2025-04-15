import { html } from "@dropsite/respond";
import example from "../components/example";

export const GET = async () => {
  const body = example.render();

  return new Response(html`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Example</title>
  </head>
  <body>
    ${body}
    <script type="module" src="/src/client.ts"></script>
  </body>
</html>`, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
};
