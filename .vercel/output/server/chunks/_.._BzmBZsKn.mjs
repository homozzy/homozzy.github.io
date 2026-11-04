import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { g as addAttribute, l as renderTemplate, r as renderComponent, u as maybeRenderHead, v as unescapeHTML } from "./server_D1UvjDKp.mjs";
import { t as createAstro } from "./compiler_DjWfn2QP.mjs";
import { n as createComponent, t as $$BaseLayout } from "./BaseLayout_bPxPzud_.mjs";
import { t as SITE } from "./consts_CA56RGZF.mjs";
import { n as getPostBySlug, t as getAllPosts } from "./sanity_BCx_MtNV.mjs";
import { marked } from "marked";
// src/pages/blog/[...id].astro
var ____id__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Component,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://homozzy.github.io");
var $$Component = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Component;
	const { id } = Astro.params;
	const post = await getPostBySlug(id);
	if (!post) return Astro.redirect("/404");
	const allPosts = await getAllPosts();
	const idx = allPosts.findIndex((p) => p.slug.current === post.slug.current);
	const prev = idx >= 0 ? allPosts[idx + 1] : void 0;
	const next = idx > 0 ? allPosts[idx - 1] : void 0;
	const readingMinutes = Math.max(1, Math.ceil((post.body?.length ?? 600) / 400));
	const html = marked.parse(post.body ?? "", {
		gfm: true,
		breaks: true
	});
	const fmt = new Date(post.pubDate).toLocaleDateString("zh-CN", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": `${post.title} · ${SITE.name}`,
		"description": post.description
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="container-narrow" style="padding-top: 3rem;"><a href="/blog" class="muted" style="font-family: ui-sans-serif, system-ui, sans-serif; font-size:0.8rem;">← 返回博客</a><h1 class="page-title" style="margin-top:0.8rem;">${post.title}</h1><div class="post-meta"><time${addAttribute(new Date(post.pubDate).toISOString(), "datetime")}>${fmt}</time><span class="muted">约 ${readingMinutes} 分钟读完</span>${(post.tags ?? []).map((t) => renderTemplate`<span class="tag">${t}</span>`)}</div><article class="prose">${unescapeHTML(html)}</article><hr class="rule"><p class="muted" style="font-size:0.85rem;">喜欢这篇？欢迎来信交流：<a class="accent"${addAttribute(`mailto:${SITE.email}`, "href")}>${SITE.email}</a></p><nav class="post-nav" aria-label="文章导航">${prev ? renderTemplate`<a class="post-nav-item"${addAttribute(`/blog/${prev.slug.current}/`, "href")}><span class="pn-label">← 上一篇</span><span class="pn-title">${prev.title}</span></a>` : renderTemplate`<span class="post-nav-item empty"><span class="pn-label">← 上一篇</span><span class="pn-title">—</span></span>`}${next ? renderTemplate`<a class="post-nav-item next"${addAttribute(`/blog/${next.slug.current}/`, "href")}><span class="pn-label">下一篇 →</span><span class="pn-title">${next.title}</span></a>` : renderTemplate`<span class="post-nav-item next empty"><span class="pn-label">下一篇 →</span><span class="pn-title">—</span></span>`}</nav></div>` })}`;
}, "D:/Documents/默认项目/homo-site/src/pages/blog/[...id].astro", void 0);
var $$file = "D:/Documents/默认项目/homo-site/src/pages/blog/[...id].astro";
var $$url = "/blog/[...id]";
// \0virtual:astro:page:src/pages/blog/[...id]@_@astro
var page = () => ____id__exports;
export { page };
