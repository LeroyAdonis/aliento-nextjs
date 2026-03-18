import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  coverImage?: string
  author?: string
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'))
  
  const posts = files.map((filename) => {
    const slug = filename.replace('.mdx', '')
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8')
    const { data, content } = matter(raw)
    
    return {
      slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString(),
      excerpt: data.excerpt || content.substring(0, 160) + '...',
      content,
      category: data.category || 'General',
      tags: data.tags || [],
      coverImage: data.coverImage,
      author: data.author || 'Aliento Medical',
    } as BlogPost
  })
  
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getAllPosts()
  return posts.find((p) => p.slug === slug) || null
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter((p) => p.category.toLowerCase() === category.toLowerCase())
}

export function searchPosts(query: string): BlogPost[] {
  const q = query.toLowerCase()
  return getAllPosts().filter((p) =>
    p.title.toLowerCase().includes(q) ||
    p.content.toLowerCase().includes(q) ||
    p.tags.some((t) => t.toLowerCase().includes(q))
  )
}

export function getAllCategories(): string[] {
  const posts = getAllPosts()
  return [...new Set(posts.map((p) => p.category))]
}

export function getAllTags(): string[] {
  const posts = getAllPosts()
  return [...new Set(posts.flatMap((p) => p.tags))]
}
