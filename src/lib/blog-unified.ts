/**
 * Unified blog data layer.
 * Tries Sanity first; falls back to static MDX data if no posts found.
 * This keeps the site working while Sanity content is being populated.
 */
import { client } from '@/sanity/client'
import { allPostsQuery, postBySlugQuery, allPostSlugsQuery } from '@/sanity/queries'
import type { SanityPost } from '@/sanity/types'

// Legacy type from MDX
interface LegacyPost {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author?: string
}

export type UnifiedPost = {
  slug: string
  title: string
  date: string
  excerpt: string
  category: string
  tags: string[]
  author: string
  mainImage?: string
  // Sanity-specific (undefined for MDX posts)
  body?: SanityPost['body']
  htmlBody?: string
  relatedPosts?: SanityPost['relatedPosts']
  // MDX-specific
  content?: string
  source: 'sanity' | 'mdx'
}

function sanityToUnified(p: SanityPost): UnifiedPost {
  return {
    slug: p.slug,
    title: p.title,
    date: p.publishedAt,
    excerpt: p.excerpt,
    category: p.category,
    tags: p.tags ?? [],
    author: p.author ?? 'Aliento Health',
    mainImage: p.mainImage?.url,
    body: p.body,
    htmlBody: p.htmlBody,
    relatedPosts: p.relatedPosts,
    source: 'sanity',
  }
}

function legacyToUnified(p: LegacyPost): UnifiedPost {
  return {
    slug: p.slug,
    title: p.title,
    date: p.date,
    excerpt: p.excerpt,
    category: p.category,
    tags: p.tags ?? [],
    author: p.author ?? 'Aliento Health',
    content: p.content,
    source: 'mdx',
  }
}

async function getSanityPosts(): Promise<UnifiedPost[]> {
  try {
    const posts = await client.fetch<SanityPost[]>(allPostsQuery, {}, { next: { revalidate: 60 } })
    return (posts ?? []).map(sanityToUnified)
  } catch {
    return []
  }
}

function getLegacyPosts(): UnifiedPost[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { posts } = require('./blog-generated') as { posts: LegacyPost[] }
    return posts.map(legacyToUnified)
  } catch {
    return []
  }
}

// ──────────────────────────────────────────
// Public API
// ──────────────────────────────────────────

export async function getAllPostsUnified(): Promise<UnifiedPost[]> {
  const sanity = await getSanityPosts()
  if (sanity.length > 0) return sanity
  // fallback
  return getLegacyPosts()
}

export async function getPostBySlugUnified(slug: string): Promise<UnifiedPost | null> {
  // Try Sanity first
  try {
    const post = await client.fetch<SanityPost | null>(
      postBySlugQuery,
      { slug },
      { next: { revalidate: 60 } }
    )
    if (post) return sanityToUnified(post)
  } catch { /* fall through */ }

  // Fallback to legacy
  const legacy = getLegacyPosts().find((p) => p.slug === slug)
  return legacy ?? null
}

export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const slugs = await client.fetch<{ slug: string }[]>(allPostSlugsQuery, {}, { cache: 'no-store' })
    if (slugs && slugs.length > 0) return slugs.map((s) => s.slug)
  } catch { /* fall through */ }
  return getLegacyPosts().map((p) => p.slug)
}

export type { SanityPost }

