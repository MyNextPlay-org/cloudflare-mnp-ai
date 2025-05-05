// Utility to convert kebab-case to camelCase
function kebabToCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

const modules = import.meta.glob("@/components/*/*.ts", { eager: true });

Object.entries(modules).forEach(([filePath, mod]) => {
  // 1. make sure you actually have a default export
  const component = (mod as any).default;
  if (!component) return;

  // 2. split the path and grab the directory name (the basename)
  //    e.g. "@/components/layout/layout.ts" → ["..","components","layout","layout.ts"]
  const segments = filePath.split("/");
  const name = segments[segments.length - 1].split(".")[0];
  const camelName = kebabToCamelCase(name);

  // 3. register on window (or via Alpine.data)
  (window as any)[camelName] = () => ({ ...component });
});
