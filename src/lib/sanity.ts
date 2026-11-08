import { createClient } from '@sanity/client';
import { getCollection } from 'astro:content';

export const sanity = createClient({
  projectId: 'voq06lrd',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

export type SanityPost = {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  pubDate: string;
  tags: string[] | null;
  body: string | null;
};

export const POST_FIELDS = `_id, title, slug, description, pubDate, tags, body`;

export async function getAllPosts(): Promise<SanityPost[]> {
  // 两个来源：Sanity CMS（历史文章）+ 仓库 src/content/blog/*.md（站内 /write 发布）
  const [sanityPosts, mdEntries] = await Promise.all([
    sanity.fetch<SanityPost[]>(`*[_type == "blogPost"] | order(pubDate desc) { ${POST_FIELDS} }`),
    getCollection('blog').catch(() => []),
  ]);

  const mdPosts: SanityPost[] = mdEntries.map((e) => ({
    _id: `md-${e.id}`,
    title: e.data.title,
    slug: { current: e.id },
    description: e.data.description ?? '',
    pubDate: e.data.pubDate instanceof Date ? e.data.pubDate.toISOString() : String(e.data.pubDate),
    tags: e.data.tags ?? [],
    body: e.body ?? '',
  }));

  // slug 撞名时以 Sanity 为准
  const sanitySlugs = new Set(sanityPosts.map((p) => p.slug.current));
  const merged = [...sanityPosts, ...mdPosts.filter((p) => !sanitySlugs.has(p.slug.current))];

  return merged.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );
}

export async function getPostBySlug(slug: string): Promise<SanityPost | null> {
  return sanity.fetch(`*[_type == "blogPost" && slug.current == $slug][0] { ${POST_FIELDS} }`, { slug });
}
