import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { t as getAllPosts } from "./sanity_BCx_MtNV.mjs";
import { t as SITE } from "./consts_CA56RGZF.mjs";
import rss from "@astrojs/rss";
// src/pages/rss.xml.ts
var rss_xml_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
async function GET(context) {
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
			categories: p.tags ?? []
		}))
	});
}
// \0virtual:astro:page:src/pages/rss.xml@_@ts
var page = () => rss_xml_exports;
export { page };
