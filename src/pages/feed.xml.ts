import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts, postPath } from '../lib/posts';
import { url } from '../lib/url';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  return rss({
    title: 'Philipp Kurrle',
    description: 'Personal Blog von Philipp Kurrle - Softwareentwickler aus Stuttgart',
    site: new URL(url('/'), context.site!).href,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description || undefined,
      link: url(postPath(post)),
      categories: post.data.tags,
    })),
    customData: '<language>de-de</language>',
  });
}
