import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/sanity'
import { fallbackPosts } from '@/lib/health-topics-fallbacks'
import type { SanityPost } from '@/lib/sanity'

const BASE = 'https://alientomd.com'

export const revalidate = 3600 // cache sitemap 1h — Sanity blips can't break GSC fetches

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    '',
    '/consult',
    '/prescription',
    '/sick-note',
    '/second-opinion',
    '/about',
    '/contact',
    '/how-we-use-ai',
    '/health-topics',
  ].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date(),
    changeFrequency: (p === '' ? 'weekly' : 'monthly') as
      | 'weekly'
      | 'monthly',
    priority:
      p === ''
        ? 1
        : ['/prescription', '/sick-note', '/second-opinion'].includes(p)
          ? 0.9
          : 0.6,
  }))

  let posts: SanityPost[] = []
  try {
    posts = await getAllPosts()
  } catch {
    posts = fallbackPosts
  }

  return [
    ...staticRoutes,
    ...posts.map((p) => ({
      url: `${BASE}/health-topics/${encodeURIComponent(p.slug.current)}`,
      lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
