import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  site: process.env.SITE_URL || 'https://metro.coolhead.in',
  output: 'static',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss(), svgr()],
  },
});
