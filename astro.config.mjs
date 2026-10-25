import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Soft Monument — mirabhakta.me
// Static output only: no server runtime, no paid services.
// The custom domain is served from the repository root, so no `base` is set.
export default defineConfig({
  site: 'https://mirabhakta.me',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'file',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
