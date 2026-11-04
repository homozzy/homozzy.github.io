import { getCliClient } from 'sanity/cli'
import fs from 'node:fs'

const raw = fs.readFileSync('../src/content/blog/chongyang.md', 'utf8')
const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
if (!m) throw new Error('frontmatter not found')
const [, fm, body] = m

const pick = (key) => {
  const line = fm.split('\n').find(l => l.startsWith(key + ':'))
  if (!line) return ''
  return line.slice(key.length + 1).trim().replace(/^"|"$/g, '')
}
const pickArray = (key) => {
  const line = fm.split('\n').find(l => l.startsWith(key + ':'))
  if (!line) return []
  const rawArr = line.slice(key.length + 1).trim()
  const match = rawArr.match(/^\[(.*)\]$/)
  if (!match) return []
  return match[1].split(',').map(s => s.trim().replace(/^"|"$/g, '')).filter(Boolean)
}

const title = pick('title')
const description = pick('description')
const pubDate = pick('pubDate')
const tags = pickArray('tags')
console.log({ title, description, pubDate, tags })

const client = getCliClient({ apiVersion: '2024-01-01' })
const existing = await client.fetch('*[_type == "blogPost" && slug.current == "chongyang"][0]._id')
if (existing) {
  console.log('already exists', existing)
  process.exit(0)
}
const doc = await client.create({
  _type: 'blogPost',
  title,
  slug: { _type: 'slug', current: 'chongyang' },
  description,
  pubDate: new Date(pubDate).toISOString(),
  tags,
  body,
})
console.log('created', doc._id)
