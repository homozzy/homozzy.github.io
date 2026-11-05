import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://homo-site-wine.vercel.app',
  output: 'static',
  adapter: vercel(),
  integrations: [sitemap()],
});
