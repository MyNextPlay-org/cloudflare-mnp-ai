import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import franken from 'franken-ui/plugin-vite'
import { cloudflare } from '@cloudflare/vite-plugin'

export default defineConfig({
  build: {
    manifest: true,
    rollupOptions: {
      input: './src/client.ts',
    },
  },
  plugins: [
    tailwindcss(),
    franken({ preflight: true }),
    cloudflare(),
  ],
})