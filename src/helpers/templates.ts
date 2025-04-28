import { html } from "@respond-run/html";

// Load all .html files recursively under ./templates/
const templates = import.meta.glob("../templates/**/*.html", {
  query: "raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// Clean paths to be relative to "templates/"
const entries = Object.entries(templates).map(([path, content]) => {
  const relativePath = path.replace(/^\.\.\/templates\//, "");
  return [relativePath, content] as const;
});

// Build a Map instead of a plain object
const templateMap = new Map(entries);

// Extract available template names as a union type
type TemplateName = (typeof entries)[number][0];

// Export a typed accessor
export function template(name: TemplateName, vars?: Record<string, any>): string {
  const template = templateMap.get(name.includes(".html") ? name : name + ".html");
  if (!template) {
    throw new Error(`Template not found: ${name}`);
  }
  return html(template, typeof vars === "object" && vars !== null ? vars : {});
}
