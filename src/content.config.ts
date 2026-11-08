import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 站内 /write 发布器会把 Markdown 提交到 src/content/blog/
// 这里把目录定义成集合，构建时与 Sanity 里的文章合并
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
