import "./styles/tailwind.css";
import Alpine from "alpinejs";

const modules = import.meta.glob('./components/*.ts', { eager: true });

Object.entries(modules).forEach(([_, mod]) => {
  const component = (mod as { default: { name?: string } }).default;

  const name = component.name?.trim();
  if (!name) return; // skip if name is missing

  (window as any)[name] = () => ({ ...component });
});

Alpine.start();
