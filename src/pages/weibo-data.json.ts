import type { APIRoute } from 'astro';
import posts from '../data/weibo-posts.json';

// 微博归档数据接口：页面骨架只内嵌最近一年，其余年份由此 JSON 懒加载
export const GET: APIRoute = async () =>
  new Response(JSON.stringify(posts), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
