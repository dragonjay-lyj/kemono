// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import mdx from '@astrojs/mdx';

import vercel from '@astrojs/vercel';

import tailwind from '@astrojs/tailwind';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), mdx(), tailwind(), sitemap()],
  site: 'https://kemono.dragonjay.top',
  output: 'server',
  adapter: vercel()
});