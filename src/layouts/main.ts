import { html, raw } from "@dropsite/respond"

export default {
  render(body: string, title: string, scriptPath: string, stylePath?: string) {
    return html`<!doctype html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${title}</title>
        <link rel="icon" href="/assets/favicon.ico" type="image/x-icon" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        ${stylePath ? raw(`<link rel="stylesheet" href="${stylePath}">`) : ''}
      </head>
      <body>
        ${raw(body)}
        <script type="module" src="${scriptPath}"></script>
      </body>
      </html>`
  }
}