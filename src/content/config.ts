import { defineCollection, z } from "astro:content";

const postCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    coverImage: z.string(),
    author: z.string(), // 引用作者ID
    platform: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional().default(false),
    // 添加文件数组
    files: z.array(
      z.object({
        url: z.string(),
        name: z.string().optional(),
        thumbnail: z.string().optional(),
      })
    ).optional(),
    // 添加评论数组
    comments: z.array(
      z.object({
        id: z.number(),
        author: z.string(),
        content: z.string(),
        publishDate: z.string(),
      })
    ).optional(),
  }),
});

const authorsCollection = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    avatar: z.string(),
    banner: z.string(),
    platform: z.string(),
    profileUrl: z.string(),
    bio: z.string().optional(),
    social: z.record(z.string()).optional(),
  }),
});

export const collections = {
  post: postCollection,
  authors: authorsCollection,
};
