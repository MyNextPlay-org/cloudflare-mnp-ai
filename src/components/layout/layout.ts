import "./layout.css";
import { html, raw } from "@respond-run/html";

export default {
  render: async function (vars: {
    body: string;
    title: string;
    scriptPaths: string[];
    stylePaths?: string[];
  }) {
    const styleLinks = raw(
      vars.stylePaths?.map((style) => `<link rel="stylesheet" href="/${style}">`).join("\n"),
    );
    const scriptTags = raw(
      vars.scriptPaths
        .map((script) => `<script type="module" src="/${script}"></script>`)
        .join("\n"),
    );
    const { default: layoutTemplate } = await import("./layout.html?raw");
    return html(layoutTemplate, { ...vars, body: raw(vars.body), scriptTags, styleLinks });
  },
};
