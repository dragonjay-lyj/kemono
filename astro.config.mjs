// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import mdx from '@astrojs/mdx';

import vercel from '@astrojs/vercel';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), mdx(),tailwind()],
  output: 'server',
  adapter: vercel()
});