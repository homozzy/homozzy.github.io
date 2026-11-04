import { h as InvalidComponentArgs, q as AstroError } from "./errors-data_BNWc2OO7.mjs";
import { d as renderHead, g as addAttribute, l as renderTemplate, o as renderSlot, r as renderComponent, u as maybeRenderHead, v as unescapeHTML } from "./server_D1UvjDKp.mjs";
import { t as createAstro } from "./compiler_DjWfn2QP.mjs";
import { t as SITE } from "./consts_CA56RGZF.mjs";
// node_modules/astro/dist/runtime/server/astro-component.js
function validateArgs(args) {
	if (args.length !== 3) return false;
	if (!args[0] || typeof args[0] !== "object") return false;
	return true;
}
function baseCreateComponent(cb, moduleId, propagation) {
	const name = moduleId?.split("/").pop()?.replace(".astro", "") ?? "";
	const fn = (...args) => {
		if (!validateArgs(args)) throw new AstroError({
			...InvalidComponentArgs,
			message: InvalidComponentArgs.message(name)
		});
		return cb(...args);
	};
	Object.defineProperty(fn, "name", {
		value: name,
		writable: false
	});
	fn.isAstroComponentFactory = true;
	fn.moduleId = moduleId;
	fn.propagation = propagation;
	return fn;
}
function createComponentWithOptions(opts) {
	return baseCreateComponent(opts.factory, opts.moduleId, opts.propagation);
}
function createComponent(arg1, moduleId, propagation) {
	if (typeof arg1 === "function") return baseCreateComponent(arg1, moduleId, propagation);
	else return createComponentWithOptions(arg1);
}
// src/components/ThemeToggle.astro
var $$ThemeToggle = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<button id="theme-toggle" class="icon-btn" type="button" aria-label="切换亮 / 暗主题" title="切换亮 / 暗主题"><!-- 月亮：亮色模式下显示（点击切暗） --><svg id="icon-moon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"></path></svg><!-- 太阳：暗色模式下显示（点击切亮） --><svg id="icon-sun" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" style="display:none"><circle cx="12" cy="12" r="4.5"></circle><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M19.4 4.6l-1.8 1.8M6.4 17.6l-1.8 1.8"></path></svg></button><script>
  (() => {
    const btn = document.getElementById('theme-toggle');
    const moon = document.getElementById('icon-moon');
    const sun = document.getElementById('icon-sun');

    const sync = () => {
      const dark = document.documentElement.dataset.theme === 'dark';
      moon.style.display = dark ? 'none' : 'block';
      sun.style.display = dark ? 'block' : 'none';
    };
    sync();

    btn?.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      localStorage.setItem('theme', next);
      sync();
    });
  })();
<\/script>`;
}, "D:/Documents/默认项目/homo-site/src/components/ThemeToggle.astro", void 0);
// src/components/Nav.astro
createAstro("https://homozzy.github.io");
var $$Nav = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Nav;
	const path = Astro.url.pathname;
	const is = (p) => p === "/" ? path === "/" : path.startsWith(p);
	return renderTemplate`${maybeRenderHead($$result)}<header class="site-header"><div class="container"><a class="brand" href="/">homo<span class="accent">.</span><small>读书研思</small></a><nav class="nav-links" aria-label="主导航"><a href="/"${addAttribute(is("/") ? "active" : "", "class")}>首页</a><a href="/features"${addAttribute(is("/features") || is("/docs") || is("/diary") || is("/surfing") || is("/sites") || is("/word") || is("/books") || is("/milestones") || is("/ledger") || is("/sync") || is("/search") ? "active" : "", "class")}>功能</a><a href="/blog"${addAttribute(is("/blog") ? "active" : "", "class")}>博客</a><a href="/reading"${addAttribute(is("/reading") ? "active" : "", "class")}>读书录</a><a href="/weibo"${addAttribute(is("/weibo") ? "active" : "", "class")}>微博</a><a href="/about"${addAttribute(is("/about") ? "active" : "", "class")}>关于</a>${renderComponent($$result, "ThemeToggle", $$ThemeToggle, {})}</nav></div></header>`;
}, "D:/Documents/默认项目/homo-site/src/components/Nav.astro", void 0);
// src/components/Footer.astro
var $$Footer = createComponent(($$result, $$props, $$slots) => {
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	return renderTemplate`${maybeRenderHead($$result)}<footer class="site-footer"><div class="container"><div class="foot-grid"><div><div class="foot-brand">homo<span class="accent"> · </span>读书研思</div><p class="foot-note">以文字记录，以行走丈量。</p></div><nav class="foot-links" aria-label="页脚导航"><a href="/about">关于</a><a href="/blog">博客</a><a href="/reading">读书录</a><a href="/features">功能</a><a${addAttribute(`mailto:${SITE.email}`, "href")}>邮箱</a><a href="/rss.xml">RSS</a><a href="https://github.com/homozzy" target="_blank" rel="noopener noreferrer">GitHub ↗</a></nav></div><div class="foot-meta"><span>© ${year} homo · 保留所有文章权利（除注明转载/摘录）</span><span>Astro 7 · GitHub Pages · 不追踪访客</span></div></div></footer>`;
}, "D:/Documents/默认项目/homo-site/src/components/Footer.astro", void 0);
// src/layouts/BaseLayout.astro
createAstro("https://homozzy.github.io");
var $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BaseLayout;
	const { title = SITE.title, description = SITE.description } = Astro.props;
	const canonical = new URL(Astro.url.pathname, Astro.site);
	return renderTemplate`<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@500;700&display=swap" rel="stylesheet"><title>${title}</title><meta name="description"${addAttribute(description, "content")}><link rel="canonical"${addAttribute(canonical, "href")}><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="alternate" type="application/rss+xml"${addAttribute(SITE.title, "title")} href="/rss.xml"><meta name="theme-color" content="#faf8f5" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#171512" media="(prefers-color-scheme: dark)"><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:type" content="website"><meta property="og:url"${addAttribute(canonical, "content")}><meta property="og:locale" content="zh_CN"><meta property="og:image"${addAttribute(new URL("/og-cover.svg", Astro.site), "content")}><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:site_name"${addAttribute(SITE.title, "content")}><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${addAttribute(title, "content")}><meta name="twitter:description"${addAttribute(description, "content")}><meta name="twitter:image"${addAttribute(new URL("/og-cover.svg", Astro.site), "content")}><meta name="generator"${addAttribute(Astro.generator, "content")}><script type="application/ld+json">${unescapeHTML(JSON.stringify({
		"@context": "https://schema.org",
		"@type": "Person",
		name: "homo",
		url: Astro.site,
		email: SITE.email,
		jobTitle: "高中地理教师",
		description: SITE.description,
		sameAs: ["https://github.com/homozzy"]
	}))}<\/script><script>
      // 防止主题闪烁：尽早应用保存的主题，否则跟随系统
      (() => {
        const saved = localStorage.getItem('theme');
        const dark = saved
          ? saved === 'dark'
          : window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.dataset.theme = dark ? 'dark' : 'light';
      })();
    <\/script>${renderHead($$result)}</head><body><a class="skip-link" href="#main-content">跳到正文</a><div class="progress" id="scroll-progress" aria-hidden="true"></div><button class="back-top" id="back-top" type="button" aria-label="回到顶部" title="回到顶部">↑</button>${renderComponent($$result, "Nav", $$Nav, {})}<main id="main-content">${renderSlot($$result, $$slots["default"])}</main>${renderComponent($$result, "Footer", $$Footer, {})}<script>
      (() => {
        const progress = document.getElementById('scroll-progress');
        const btn = document.getElementById('back-top');
        const onScroll = () => {
          const h = document.documentElement;
          const max = h.scrollHeight - h.clientHeight;
          const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
          if (progress) progress.style.width = pct + '%';
          if (btn) btn.classList.toggle('show', h.scrollTop > 200);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        btn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
      })();
    <\/script></body></html>`;
}, "D:/Documents/默认项目/homo-site/src/layouts/BaseLayout.astro", void 0);
export { createComponent as n, $$BaseLayout as t };
