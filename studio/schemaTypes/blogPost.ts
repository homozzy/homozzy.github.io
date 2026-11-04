import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: '标题', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug（URL）', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: Rule => Rule.required() }),
    defineField({ name: 'description', title: '摘要', type: 'text', rows: 2, validation: Rule => Rule.required() }),
    defineField({ name: 'pubDate', title: '发布日期', type: 'datetime', validation: Rule => Rule.required() }),
    defineField({ name: 'tags', title: '标签', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'body', title: '正文（Markdown）', type: 'text', rows: 24 }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'pubDate' },
  },
})
