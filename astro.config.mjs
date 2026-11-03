import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://homozzy.github.io',
  integrations: [sitemap()],
});
