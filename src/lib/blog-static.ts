// This file is generated at build time to embed blog data
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author?: string
}

// Read all posts at build time and export them as static data
export function getStaticPosts(): BlogPost[] {
  // Try public dir first (Vercel), then local dir
  const dirs = [
    path.join(process.cwd(), 'public', 'content', 'blog'),
    path.join(process.cwd(), 'content', 'blog'),
  ]
  
  let blogDir = ''
  for (const dir of dirs) {
    if (fs.existsSync(dir)) { blogDir = dir; break }
  }
  if (!blogDir) return []
  
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx'))
  
  return files.map((filename) => {
    const slug = filename.replace('.mdx', '')
    const raw = fs.readFileSync(path.join(blogDir, filename), 'utf-8')
    const { data, content } = matter(raw)
    
    return {
      slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString(),
      excerpt: data.excerpt || '',
      content,
      category: data.category || 'General',
      tags: data.tags || [],
      author: data.author || 'Aliento Medical',
    }
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Build-time generation for static params
export function generateStaticParams() {
  const posts = getStaticPosts()
  return posts.map((post) => ({ slug: post.slug }))
}
