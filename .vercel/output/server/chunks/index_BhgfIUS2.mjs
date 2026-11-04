import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { g as addAttribute, l as renderTemplate, r as renderComponent, u as maybeRenderHead } from "./server_D1UvjDKp.mjs";
import "./compiler_DjWfn2QP.mjs";
import { n as createComponent, t as $$BaseLayout } from "./BaseLayout_bPxPzud_.mjs";
import { t as SITE } from "./consts_CA56RGZF.mjs";
import { t as getAllPosts } from "./sanity_BCx_MtNV.mjs";
// src/pages/blog/index.astro
var blog_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const posts = await getAllPosts();
	const fmt = (d) => new Date(d).toLocaleDateString("zh-CN", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": `博客 · ${SITE.title}`,
		"description": "文史、气象与技术的随想，读书研思。"
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="container-narrow" style="padding-top: 3rem;"><p class="eyebrow">Essays</p><h1 class="page-title">博客<span class="accent">.</span></h1><p class="muted">文史、气象与技术的随想。<a href="/rss.xml" class="accent" style="text-decoration:underline;text-underline-offset:3px;">RSS 订阅</a> · <a href="https://studio-homo-site.sanity.studio" target="_blank" rel="noopener noreferrer" class="btn btn-ghost" style="padding:0.3rem 0.8rem; font-size:0.78rem; vertical-align:middle;">＋ 写新博客</a></p>${posts.length === 0 && renderTemplate`<p class="muted" style="margin-top:1.5rem;">暂无文章，去 Studio 发布第一篇。</p>`}<ul class="post-list" style="margin-top: 1.5rem;">${posts.map((post) => renderTemplate`<li class="post-item"><a${addAttribute(`/blog/${post.slug.current}/`, "href")}><h3>${post.title}</h3><p>${post.description}</p></a><div class="meta"><time${addAttribute(new Date(post.pubDate).toISOString(), "datetime")}>${fmt(post.pubDate)}</time>${(post.tags ?? []).map((t) => renderTemplate`<span class="tag">${t}</span>`)}</div></li>`)}</ul></div>` })}`;
}, "D:/Documents/默认项目/homo-site/src/pages/blog/index.astro", void 0);
var $$file = "D:/Documents/默认项目/homo-site/src/pages/blog/index.astro";
var $$url = "/blog";
// \0virtual:astro:page:src/pages/blog/index@_@astro
var page = () => blog_exports;
export { page };
