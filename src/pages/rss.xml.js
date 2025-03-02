import rss, { pagesGlobToRssItems } from '@astrojs/rss';
import { rssSchema } from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
const authors = await getCollection('authors');
const posts = await getCollection('post');
  return rss({
    site: context.site,
    title: 'Kemono',
    description: 'A Kemono website',
    items: posts.map((post) => ({
        title: post.data.title,
        pubDate: post.data.publishDate,
        description: post.data.description,
        link: `/post/${post.id.replace(/\.mdx$/, '')}`,
      })),
  });
}