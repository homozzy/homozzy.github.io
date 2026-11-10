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
  // 两个来源：仓库 src/content/blog/*.md + Sanity CMS
  // 2026-11-09 起：Sanity 的 3 篇历史文章已完整导出为本地 md（导出脚本核对过逐篇字节数），
  // 所以**本地优先**——同一 slug 本地存在就不再打 Sanity，改稿只改仓库文件即可；
  // Sanity 仅兜底「本地还没有的文章」（比如导出之后又有人在 CMS 里写的新文）。
  const [sanityPosts, mdEntries] = await Promise.all([
    sanity.fetch<SanityPost[]>(`*[_type == "blogPost"] | order(pubDate desc) { ${POST_FIELDS} }`).catch(() => [] as SanityPost[]),
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

  // slug 撞名时以本地 md 为准（2026-11-09 前是以 Sanity 为准，与本条逻辑配套）
  const mdSlugs = new Set(mdPosts.map((p) => p.slug.current));
  const merged = [...mdPosts, ...sanityPosts.filter((p) => !mdSlugs.has(p.slug.current))];

  return merged.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );
}

export async function getPostBySlug(slug: string): Promise<SanityPost | null> {
  return sanity.fetch(`*[_type == "blogPost" && slug.current == $slug][0] { ${POST_FIELDS} }`, { slug });
}
