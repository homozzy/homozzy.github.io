import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const get = (name, fallback = undefined) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const src = get('src');
const branch = get('branch', 'gh-pages');
const message = get('message', `deploy: ${new Date().toISOString().slice(0, 10)}`);
if (!src) { console.error('--src required'); process.exit(2); }
if (!fs.existsSync(src)) { console.error('source not found', src); process.exit(2); }

const REPO = 'homozzy/homozzy.github.io';
const TOKEN = execSync('gh auth token', { encoding: 'utf8' }).trim();
const api = async (method, url, body) => {
  const res = await fetch(`https://api.github.com/repos/${REPO}${url}`, {
    method,
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json', ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${url} -> ${res.status} ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
};
const blobSha = (buf) => createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${buf.length}\0`), buf])).digest('hex');

const local = new Map();
const walk = (dir, rel = '') => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    const p = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) walk(full, p);
    else {
      const buf = fs.readFileSync(full);
      local.set(p.replace(/\\/g, '/'), { sha: blobSha(buf), content: buf.toString('utf8') });
    }
  }
};
walk(path.resolve(src));

const ref = await api('GET', `/git/refs/heads/${branch}`);
const commit = ref.object.sha;
const treeSha = (await api('GET', `/git/commits/${commit}`)).tree.sha;
const remoteTree = await api('GET', `/git/trees/${treeSha}?recursive=1`);
const remote = new Map(remoteTree.tree.filter(t => t.type === 'blob').map(t => [t.path, t.sha]));
console.log(`local files: ${local.size}, remote files: ${remote.size}, HEAD: ${commit.slice(0, 7)}`);

const entries = [];
for (const [p, { sha, content }] of local) {
  if (remote.get(p) !== sha) entries.push({ path: p, mode: '100644', type: 'blob', content });
}
for (const p of remote.keys()) {
  if (!local.has(p)) entries.push({ path: p, mode: '100644', type: 'blob', sha: null });
}
if (!entries.length) { console.log('无差异，跳过。'); process.exit(0); }
console.log(`changes: ${entries.length}`);

const newTree = (await api('POST', '/git/trees', { base_tree: treeSha, tree: entries })).sha;
const newCommit = (await api('POST', '/git/commits', { message, tree: newTree, parents: [commit] })).sha;
await api('PATCH', `/git/refs/heads/${branch}`, { sha: newCommit });
console.log(`✓ ${branch} 已更新到 ${newCommit.slice(0, 7)}`);
