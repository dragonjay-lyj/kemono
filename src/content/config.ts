// src/content/config.ts
import { defineCollection, z } from 'astro:content';

export const collections = {
  authors: defineCollection({
    type: 'content',
    schema: z.object({
      name: z.string(),
      platform: z.enum(['Patreon', 'Fanbox', 'Gumroad']),
      platformUrl: z.string().url(),
      avatar: z.string(),
      banner: z.string(),
      platformIcon: z.string(),
    }),
  }),
  posts: defineCollection({
    schema: z.object({
      title: z.string(),
      date: z.coerce.date(),
      image: z.string(),
      alt: z.string(),
      authorId: z.string(),
      tags: z.array(z.string()).default([]),
      content: z.string(),
    }),
  }),
};
