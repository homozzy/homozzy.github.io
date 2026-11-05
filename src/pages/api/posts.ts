import type { APIRoute } from 'astro';
import { createClient } from '@sanity/client';

export const prerender = false;

const token = import.meta.env.SANITY_TOKEN;
const writeKey = import.meta.env.WRITE_KEY;

const client = createClient({
  projectId: 'voq06lrd',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
});

const unauthorized = () =>
  new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
const badRequest = (msg: string) =>
  new Response(JSON.stringify({ error: msg }), { status: 400, headers: { 'Content-Type': 'application/json' } });

const slugify = (s: string) =>
  s.toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || `post-${Date.now()}`;

export const GET: APIRoute = async ({ request }) => {
  const key = request.headers.get('x-write-key');
  if (!token || !writeKey || key !== writeKey) return unauthorized();
  const posts = await client.fetch(`*[_type == "blogPost"] | order(pubDate desc) { _id, title, slug, pubDate }`);
  return new Response(JSON.stringify(posts), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};

export const POST: APIRoute = async ({ request }) => {
  const key = request.headers.get('x-write-key');
  if (!token || !writeKey || key !== writeKey) return unauthorized();
  let body: {
    _id?: string;
    title: string;
    slug?: string;
    description: string;
    pubDate: string;
    tags?: string[];
    body: string;
  };
  try {
    body = await request.json();
  } catch {
    return badRequest('invalid json');
  }
  if (!body.title?.trim()) return badRequest('title required');
  const slug = (body.slug?.trim() || slugify(body.title));
  const doc = {
    _type: 'blogPost',
    title: body.title.trim(),
    slug: { _type: 'slug', current: slug },
    description: body.description?.trim() ?? '',
    pubDate: new Date(body.pubDate).toISOString(),
    tags: Array.isArray(body.tags) ? body.tags : [],
    body: body.body ?? '',
  };
  try {
    const saved = body._id
      ? await client.patch(body._id).set(doc).commit()
      : await client.create(doc);
    return new Response(JSON.stringify(saved), { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } });
  } catch (err) {
    return badRequest(err instanceof Error ? err.message : String(err));
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  const key = request.headers.get('x-write-key');
  if (!token || !writeKey || key !== writeKey) return unauthorized();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return badRequest('id required');
  try {
    await client.delete(id);
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } });
  } catch (err) {
    return badRequest(err instanceof Error ? err.message : String(err));
  }
};
