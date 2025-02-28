import rss, { pagesGlobToRssItems } from '@astrojs/rss';
import { rssSchema } from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
const authors = await getCollection('authors');
const posts = await getCollection('posts');
  return rss({
    site: context.site,
    items: posts.map((post) => ({
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.alt,
        link: `/posts/${post.id}/`,
        content: post.data.content,
        author: authors.find((author) => author.id === post.data.authorId).data.name,
      })),
  });
}