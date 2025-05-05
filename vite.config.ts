import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    manifest: true,
    rollupOptions: {
      input: {
        client: "./src/client.ts",
      },
    },
  },
  plugins: [tailwindcss(), cloudflare()],
});
