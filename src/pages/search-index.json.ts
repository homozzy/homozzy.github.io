import type { APIRoute } from 'astro';
import { getAllPosts } from '../lib/sanity';
import readingNotes from '../data/reading-notes.json';
import weiboPosts from '../data/weibo-posts.json';

const stripTo = (s: string, n: number) => {
  const t = s.replace(/\s+/g, ' ').trim();
  return t.length > n ? t.slice(0, n) + '…' : t;
};

export const GET: APIRoute = async () => {
  const entries: Array<{ title: string; url: string; excerpt: string; tag: string }> = [];

  const pages: Array<[string, string, string]> = [
    ['首页 · homo', '/', '高中地理教师 × 历史地理爱好者，读书研思，记录文史、气象与技术的随想。'],
    ['此刻 · 我在忙什么', '/now', '教学、阅读与写作的当前进度，像给一年没见的朋友报平安。'],
    ['写一篇 · 一句话发布', '/write', '第一行是标题、其余是正文，点发布自动上线。'],
    ['讲台 · 固定栏目', '/podium', '每月一篇课堂实录或教学反思。'],
    ['教具 · 季风换季演示', '/tools/monsoon', '拖动月份滑块，看东亚季风如何反转方向。'],
    ['关于我', '/about', '本科学历，现任高中地理教师；历史地理爱好者，读书、写字。'],
    ['博客', '/blog', '文史、气象与技术的随想。'],
    ['读书录', '/reading', '2015 至今的微博读书笔记，52 条原文全文收录。'],
    ['微博归档', '/weibo', '2015–2026 原创微博全文，按年份归档，可搜索。'],
    ['作品', '/works', '个人工作台等个人项目。'],
    ['功能总览', '/features', '本站全部功能板块一览。'],
    ['更新日志', '/changelog', 'homo 个人网站的迭代记录。'],
    ['藏书阁', '/books', '55 本（部）书，9 个分类，链接到读书笔记。'],
    ['大事记', '/milestones', '2015 至今的时间线。'],
    ['日进一词', '/word', '每天一枚成语，附释义与出处。'],
    ['账本', '/ledger', '本地收支小账本，数据只存本机。'],
    ['数据同步', '/sync', '本地备份与恢复说明。'],
    ['我的网站', '/sites', '本站与入口汇总。'],
  ];
  for (const [title, url, excerpt] of pages) entries.push({ title, url, excerpt, tag: '页面' });

  const posts = await getAllPosts();
  for (const p of posts) {
    entries.push({
      title: p.title,
      url: `/blog/${p.slug.current}/`,
      excerpt: p.description,
      tag: '博客',
      y: new Date(p.pubDate).getFullYear(),
    });
  }

  for (const n of readingNotes as Array<{ id: string; date: string; book: string; author: string; kind: string; text: string }>) {
    entries.push({
      title: `《${n.book}》${n.kind === 'wrote' ? '（创作）' : ''}`,
      url: `/reading/#note-${n.id}`,
      excerpt: stripTo(n.text, 160),
      tag: '读书笔记',
      y: new Date(n.date).getFullYear(),
    });
  }

  for (const p of weiboPosts as Array<{ id: string; created: string; text: string }>) {
    entries.push({
      title: stripTo(p.text, 40) || '微博原帖',
      url: `/weibo/#post-${p.id}`,
      excerpt: stripTo(p.text, 160),
      tag: '微博',
      y: new Date(p.created).getFullYear(),
    });
  }

  return new Response(JSON.stringify(entries), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
