import rss, { pagesGlobToRssItems } from '@astrojs/rss';
import { rssSchema } from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
const authors = await getCollection('authors');
const posts = await getCollection('posts');
  return rss({
    site: context.site,
    title: 'Kemono',
    description: 'A Kemono website',
    items: posts.map((post) => ({
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.alt,
        link: `/posts/${post.id.replace(/\.mdx$/, '')}`,
        content: post.data.content,
      })),
  });
}