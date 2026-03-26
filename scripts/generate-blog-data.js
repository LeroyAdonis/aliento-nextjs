/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')
const TS_OUTPUT = path.join(process.cwd(), 'src', 'lib', 'blog-generated.ts')
const JSON_OUTPUT = path.join(process.cwd(), 'public', 'blog-data.json')

if (!fs.existsSync(BLOG_DIR)) {
  console.log('No blog content found at', BLOG_DIR)
  process.exit(0)
}

const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'))
const posts = files.map(filename => {
  const slug = filename.replace('.mdx', '')
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8')
  const { data, content } = matter(raw)
  return {
    slug,
    title: data.title || slug,
    date: data.date || new Date().toISOString().split('T')[0],
    excerpt: data.excerpt || '',
    content: content.trim(),
    category: data.category || 'General',
    tags: data.tags || [],
    author: data.author || 'Aliento Medical',
  }
}).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

// Generate TypeScript file
const tsOutput = `// AUTO-GENERATED - DO NOT EDIT
export interface BlogPost { slug: string; title: string; date: string; excerpt: string; content: string; category: string; tags: string[]; author?: string }
export const posts: BlogPost[] = ${JSON.stringify(posts)}
export function getAllPosts(): BlogPost[] { return posts }
export function getPostBySlug(slug: string): BlogPost | null { return posts.find(p => p.slug === slug) || null }
export function getAllCategories(): string[] { return [...new Set(posts.map(p => p.category))] }
`
fs.mkdirSync(path.dirname(TS_OUTPUT), { recursive: true })
fs.writeFileSync(TS_OUTPUT, tsOutput)

// Also generate JSON in public/ for runtime fetch
fs.mkdirSync(path.dirname(JSON_OUTPUT), { recursive: true })
fs.writeFileSync(JSON_OUTPUT, JSON.stringify(posts))

console.log(`Generated ${posts.length} posts (TS + JSON)`)
