// 通过 GitHub Git 数据库 API 同步本地分支到远端（网络无法直连 github.com 时用）
// 用法: node scripts/api-sync-branches.mjs main   # 或 gh-pages
// 需要: gh CLI 已登录（token 由 gh auth token 读取，不落盘）
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const REPO = 'homozzy/homozzy.github.io';
const ROOT = path.resolve(import.meta.dirname, '..');
const branch = process.argv[2];
if (!['main', 'gh-pages'].includes(branch)) {
  console.error('usage: node scripts/api-sync-branches.mjs main|gh-pages');
  process.exit(2);
}
const TOKEN = execSync('gh auth token', { encoding: 'utf8' }).trim();
const api = async (method, url, body) => {
  const res = await fetch(`https://api.github.com/repos/${REPO}${url}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${url} -> ${res.status} ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
};

const gitBlobSha = (buf) =>
  createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${buf.length}\0`), buf])).digest('hex');

// ---- 收集本地文件清单（路径 -> sha）----
const local = new Map();
if (branch === 'main') {
  const out = execSync('git ls-tree -r main', { encoding: 'utf8', cwd: ROOT });
  for (const line of out.split('\n').filter(Boolean)) {
    const m = line.match(/^(\d+)\s+(\w+)\s+([0-9a-f]+)\t(.+)$/);
    if (!m) continue;
    const [, , type, sha, rel] = m;
    if (type !== 'blob') continue;
    const buf = fs.readFileSync(path.join(ROOT, rel));
    local.set(rel.replace(/\\/g, '/'), { sha, content: buf.toString('utf8') });
  }
} else {
  const base = path.join(ROOT, 'dist');
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else {
        const rel = path.relative(base, full).replace(/\\/g, '/');
        const buf = fs.readFileSync(full);
        local.set(rel, { sha: gitBlobSha(buf), content: buf.toString('utf8') });
      }
    }
  };
  walk(base);
}

// ---- 取远端树 ----
const ref = await api('GET', `/git/refs/heads/${branch}`);
const commit = ref.object.sha;
const treeSha = (await api('GET', `/git/commits/${commit}`)).tree.sha;
const remoteTree = await api('GET', `/git/trees/${treeSha}?recursive=1`);
const remote = new Map(remoteTree.tree.filter(t => t.type === 'blob').map(t => [t.path, t.sha]));
console.log(`local files: ${local.size}, remote files: ${remote.size}, HEAD: ${commit.slice(0, 7)}`);

// ---- 计算差异 ----
const entries = [];
for (const [p, { sha, content }] of local) {
  if (remote.get(p) !== sha) entries.push({ path: p, mode: '100644', type: 'blob', content });
}
for (const p of remote.keys()) {
  if (!local.has(p)) entries.push({ path: p, mode: '100644', type: 'blob', sha: null });
}
if (!entries.length) { console.log('无差异，跳过。'); process.exit(0); }
console.log(`变更: ${entries.map(e => e.sha === null ? `删 ${e.path}` : `写 ${e.path}`).join('\n')}`);

// ---- 创建树 -> 提交 -> 更新 ref ----
const newTree = (await api('POST', '/git/trees', { base_tree: treeSha, tree: entries })).sha;
const newCommit = (await api('POST', '/git/commits', {
  message: branch === 'main'
    ? 'feat(读书录): 导入微博读书笔记，复刻原收录 52 条（API 同步）'
    : 'deploy: 读书录上线（API 同步）',
  tree: newTree,
  parents: [commit],
})).sha;
await api('PATCH', `/git/refs/heads/${branch}`, { sha: newCommit, force: false });
console.log(`✓ ${branch} 已更新到 ${newCommit.slice(0, 7)}`);
