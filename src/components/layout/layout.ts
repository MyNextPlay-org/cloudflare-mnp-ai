import "./layout.css";
import { html, raw } from "@respond-run/html";

export default {
  render: async function (vars: {
    body: string;
    title: string;
    scriptPath: string;
    stylePath?: string;
  }) {
    const styleLink = vars.stylePath ? raw(`<link rel="stylesheet" href="${vars.stylePath}">`) : "";
    const { default: layoutTemplate } = await import("./layout.html?raw");
    return html(layoutTemplate, { ...vars, body: raw(vars.body), styleLink });
  },
};
