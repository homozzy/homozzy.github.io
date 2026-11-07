// 自托管 Noto Serif SC：抓取 Google Fonts woff2 分片并本地化 CSS
// 用法：node scripts/selfhost-fonts.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(root, 'public', 'fonts');
fs.mkdirSync(outDir, { recursive: true });

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const CSS_URL = 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;700&display=swap';

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.text();
}

async function fetchBin(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

console.log('fetching CSS…');
const css = await fetchText(CSS_URL);

// 提取所有 woff2 URL，映射成本地文件名
const urls = [...new Set(css.match(/https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2/g) || [])];
console.log(`CSS 共 ${css.length} 字节，woff2 分片 ${urls.length} 个`);

const map = new Map();
for (const u of urls) {
  map.set(u, 'noto-serif-sc-' + u.match(/[0-9a-f]{14,}(?=\.woff2$)/)?.[0]?.slice(-10) + '-' + (map.size) + '.woff2');
}

// 并发下载（限流 16）
let done = 0, failed = 0;
const queue = [...map.entries()];
async function worker() {
  while (queue.length) {
    const [url, name] = queue.shift();
    try {
      const buf = await fetchBin(url);
      fs.writeFileSync(path.join(outDir, name), buf);
      done++;
      if (done % 20 === 0) console.log(`  progress ${done}/${urls.length}`);
    } catch (e) {
      failed++;
      console.error('  FAIL', url, e.message);
    }
  }
}
await Promise.all(Array.from({ length: 16 }, worker));
console.log(`downloaded ${done}, failed ${failed}`);

// 改写 CSS 为本地路径
let localCss = css.replace(/https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2/g, (u) => `./${map.get(u)}`);
// 去掉对 googlehelp css2 的 license 注释链接无所谓；保存
fs.writeFileSync(path.join(outDir, 'noto-serif-sc.css'), localCss, 'utf8');
console.log('saved noto-serif-sc.css,', localCss.length, 'bytes');
if (failed > 0) process.exit(1);
