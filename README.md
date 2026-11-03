# homo · 读书研思（个人网站）

历史地理爱好者 homo 的个人站：首页名片 + 关于/经历 + Markdown 博客 + RSS + 作品页，亮/暗双模。

## 技术栈

- [Astro 7](https://astro.build)（静态站点，零 JS 发货，内容用 Markdown）
- 内容集合：`src/content/blog/*.md`（frontmatter: title / description / pubDate / tags）
- 部署目标：任意静态托管（GitHub Pages / Vercel / Cloudflare Pages 免费都行）

## 本地运行

> 需要 Node ≥ 22.23.4（你机器上的系统 Node 为 22.23.2，太旧）。
> 已备好便携版：`D:\Temp\opencode\node-v22.23.4`，或升级系统 Node 后直接用 npm。

```powershell
# 系统 Node 升级后，或使用便携版：
$env:PATH = "D:\Temp\opencode\node-v22.23.4;$env:PATH"

npm install      # 依赖已装好，可跳过
npm run dev      # 开发预览 http://localhost:4321
npm run build    # 产出静态站点到 dist/
npm run preview  # 本地预览构建产物
```

## 写新博客

在 `src/content/blog/` 新建 `.md` 即可，例如：

```markdown
---
title: "标题"
description: "一句话摘要"
pubDate: 2026-11-03
tags: ["文史"]
---
正文……
```

## 发布前 TODO

- [ ] `astro.config.mjs` 的 `site:` 换成正式域名（RSS / sitemap / 分享卡片依赖它）
- [ ] `public/robots.txt` 同步更新 Sitemap 地址
- [ ] 关于页补充院校名（src/pages/about.astro）
- [ ] 作品页补充：个人工作台的技术栈 / 链接 / 截图（src/pages/works.astro）
- [ ] 首篇文章发布前过一遍（src/content/blog/chongyang.md）

## 目录结构

```
src/
  components/   Nav / Footer / ThemeToggle
  layouts/      BaseLayout（主题 + SEO/RSS 元信息）
  pages/        index / about / works / blog/[...id] / rss.xml.ts / 404
  content/      Markdown 文章
  consts.ts     全站文案（邮箱、一句话介绍等，改这里）
```
