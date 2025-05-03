import { html } from "@respond-run/html";

// Load all .html files recursively under ./components/*/
const templates = import.meta.glob("../components/*/*.html", {
  query: "raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// Clean paths to be relative to "components/COMPONENT/"
const entries = Object.entries(templates).map(([path, content]) => {
  // e.g. ../components/login/login.html => login/login.html
  const relativePath = path.replace(/^\.\.\/components\//, "");
  return [relativePath, content] as const;
});

// Build a Map instead of a plain object
const templateMap = new Map(entries);

// Extract available template names as a union type
type TemplateName = (typeof entries)[number][0];

// Export a typed accessor
export function template(name: TemplateName, vars?: Record<string, any>): string {
  // Accept either 'login/login.html' or just 'login' (default to login/login.html)
  let key = name;
  if (!key.endsWith(".html")) {
    key = key.includes("/") ? key + ".html" : key + "/" + key + ".html";
  }
  const template = templateMap.get(key);
  if (!template) {
    throw new Error(`Template not found: ${key}`);
  }
  return html(template, typeof vars === "object" && vars !== null ? vars : {});
}
