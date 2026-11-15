import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** Published posts only (drafts are excluded everywhere), newest first. */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function postPath(post: Post): string {
  return `/blog/${post.id}/`;
}

const TZ = 'UTC';

/** "11. Januar 2025" */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ })
    .format(date)
    .replace(/^(\d+)\s/, '$1. ');
}

/** "Januar 2025" */
export function formatMonth(date: Date): string {
  return new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric', timeZone: TZ }).format(date);
}

/** "11." */
export function formatDay(date: Date): string {
  return `${new Intl.DateTimeFormat('de-DE', { day: '2-digit', timeZone: TZ }).format(date)}.`;
}
