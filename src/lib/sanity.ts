import { createClient } from '@sanity/client';

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
  return sanity.fetch(`*[_type == "blogPost"] | order(pubDate desc) { ${POST_FIELDS} }`);
}

export async function getPostBySlug(slug: string): Promise<SanityPost | null> {
  return sanity.fetch(`*[_type == "blogPost" && slug.current == $slug][0] { ${POST_FIELDS} }`, { slug });
}
