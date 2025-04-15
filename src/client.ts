import "./styles/tailwind.css"
import Alpine from "alpinejs"

// Register components to window
const modules = import.meta.glob('./components/*.ts', { eager: true });

Object.entries(modules).forEach(([path, mod]) => {
  const name = path
    .replace('./components/', '')
    .replace('.ts', '')
    .replace(/[^a-zA-Z0-9_$]/g, '');

  const component = (mod as { default: object }).default;

  (window as any)[name] = () => ({ ...component });
});

// Start Alpine.js
Alpine.start()