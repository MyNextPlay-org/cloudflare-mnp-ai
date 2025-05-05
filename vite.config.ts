import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
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
