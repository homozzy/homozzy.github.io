import rss from '@astrojs/rss';
import { getAllPosts } from '../lib/sanity';
import { SITE } from '../consts';

export async function GET(context: { site?: URL }) {
  const posts = await getAllPosts();

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((p) => ({
      title: p.title,
      description: p.description,
      pubDate: new Date(p.pubDate),
      link: `/blog/${p.slug.current}/`,
      categories: p.tags ?? [],
    })),
  });
}

