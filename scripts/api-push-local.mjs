// 不依赖 git 二进制：直接把工作目录同步到远端分支（支持二进制文件）
// 用法: node scripts/api-push-local.mjs [main|gh-pages] ["commit message"]
// 需要: gh CLI 已登录
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const REPO = 'homozzy/homozzy.github.io';
const ROOT = path.resolve(import.meta.dirname, '..');
const branch = process.argv[2] || 'main';
const message = process.argv[3] || `sync: ${new Date().toISOString().slice(0, 16)}（api-push-local）`;
const TOKEN = execSync('gh auth token', { encoding: 'utf8' }).trim();
const api = async (method, url, body, json = true) => {
  const res = await fetch(`https://api.github.com/repos/${REPO}${url}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(json ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? (json ? JSON.stringify(body) : body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${url} -> ${res.status} ${text.slice(0, 200)}`);
  return json ? (text ? JSON.parse(text) : null) : text;
};

const gitBlobSha = (buf) =>
  createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${buf.length}\0`), buf])).digest('hex');

// ---- 简易 .gitignore 解析（够用即可）----
const ignoreRaw = fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8')
  .split(/\r?\n/).map(s => s.trim()).filter(s => s && !s.startsWith('#'));
const ALWAYS_IGNORE = ['.git', '.DS_Store', 'Thumbs.db', 'node_modules'];
const rule = (pat) => {
  const clean = pat.replace(/\/$/, '');
  return new RegExp('(^|/)' + clean.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '(/|$)');
};
const rootIgnores = [...ignoreRaw, ...ALWAYS_IGNORE].map(rule);
const isIgnored = (rel) => ignores.some(({ rx }) => rx.test(rel));

// ---- 收集本地文件（支持嵌套 .gitignore，如 studio/.gitignore）----
const local = new Map();
const walk = (dir, dirPrefix, inherited) => {
  const rules = [...inherited];
  const gi = path.join(dir, '.gitignore');
  if (dirPrefix && fs.existsSync(gi)) {
    for (const raw of fs.readFileSync(gi, 'utf8').split(/\r?\n/)) {
      const s = raw.trim();
      if (!s || s.startsWith('#')) continue;
      const anchored = s.startsWith('/');
      const pat = s.replace(/^\//, '').replace(/\/$/, '');
      rules.push(new RegExp('(^|/)' +
        dirPrefix.replace(/[.+^${}()|[\]\\]/g, '\\$&') + '/' +
        pat.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '(/|$)'));
    }
  }
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = dirPrefix ? `${dirPrefix}/${e.name}` : e.name;
    if (rootIgnores.some(r => r.test(rel)) || rules.some(r => r.test(rel))) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, rel, rules);
    else local.set(rel, fs.readFileSync(full));
  }
};
walk(ROOT, '', []);
console.log(`local files: ${local.size}`);

// ---- 远端树 ----
const ref = await api('GET', `/git/refs/heads/${branch}`);
const commitSha = ref.object.sha;
const treeSha = (await api('GET', `/git/commits/${commitSha}`)).tree.sha;
const remoteTree = await api('GET', `/git/trees/${treeSha}?recursive=1`);
const remote = new Map(remoteTree.tree.filter(t => t.type === 'blob').map(t => [t.path, t.sha]));
console.log(`remote files: ${remote.size}, HEAD: ${commitSha.slice(0, 7)}`);

// ---- 差异 ----
const write = [], del = [];
for (const [rel, buf] of local) {
  const sha = gitBlobSha(buf);
  if (remote.get(rel) !== sha) write.push({ path: rel, sha, buf });
}
// 保护：/write 在网站上发布的内容远程有、本地没有时，绝不顺带删除（本地仓库总是落后远程）
const PROTECT_DELETE = /^src\/content\/blog\//;
const forceDel = process.argv.includes('--force-del');
for (const p of remote.keys()) if (!local.has(p)) {
  if (!forceDel && PROTECT_DELETE.test(p)) {
    console.log(`⚠ 保留远程仅 /write 发布的文件（不随推同步删除）: ${p}`);
    continue;
  }
  del.push(p);
}
if (!write.length && !del.length) { console.log('无差异，跳过。'); process.exit(0); }
for (const w of write) console.log(`写 ${w.path}`);
for (const d of del) console.log(`删 ${d}`);

// ---- 上传 blob（base64，支持二进制）----
for (const w of write) {
  const blob = await api('POST', '/git/blobs', { content: w.buf.toString('base64'), encoding: 'base64' });
  w.blobSha = blob.sha;
}
const tree = [
  ...write.map(w => ({ path: w.path, mode: '100644', type: 'blob', sha: w.blobSha })),
  ...del.map(p => ({ path: p, mode: '100644', type: 'blob', sha: null })),
];
const newTree = (await api('POST', '/git/trees', { base_tree: treeSha, tree })).sha;
const newCommit = (await api('POST', '/git/commits', { message, tree: newTree, parents: [commitSha] })).sha;
await api('PATCH', `/git/refs/heads/${branch}`, { sha: newCommit, force: false });
console.log(`✓ ${branch} 已更新到 ${newCommit.slice(0, 7)}`);
