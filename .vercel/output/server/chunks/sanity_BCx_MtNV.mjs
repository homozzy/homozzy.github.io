import { createClient } from "@sanity/client";
// src/lib/sanity.ts
var sanity = createClient({
	projectId: "voq06lrd",
	dataset: "production",
	apiVersion: "2024-01-01",
	useCdn: false
});
var POST_FIELDS = `_id, title, slug, description, pubDate, tags, body`;
async function getAllPosts() {
	return sanity.fetch(`*[_type == "blogPost"] | order(pubDate desc) { ${POST_FIELDS} }`);
}
async function getPostBySlug(slug) {
	return sanity.fetch(`*[_type == "blogPost" && slug.current == $slug][0] { ${POST_FIELDS} }`, { slug });
}
export { getPostBySlug as n, getAllPosts as t };
