import { MetadataRoute } from 'next'
import { getAllPosts, getAllCategories } from '@/lib/sanity'
import type { SanityPost } from '@/lib/sanity'
import { fallbackPosts, fallbackCategories } from '@/lib/health-topics-fallbacks'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aliento.africa'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const routes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/health-topics`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/consult`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  // Dynamic health-topic posts
  try {
    const posts = await getAllPosts()
    for (const post of posts) {
      routes.push({
        url: `${SITE_URL}/health-topics/${post.slug.current}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: 'weekly',
        priority: 0.7,
      } as MetadataRoute.Sitemap[number])
    }
  } catch {
    // If Sanity is not available, use fallbacks
    for (const post of fallbackPosts) {
      routes.push({
        url: `${SITE_URL}/health-topics/${post.slug.current}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: 'weekly',
        priority: 0.7,
      } as MetadataRoute.Sitemap[number])
    }
  }

  // Health topic category pages (if they exist in the future)
  try {
    const categories = await getAllCategories()
    for (const cat of categories) {
      routes.push({
        url: `${SITE_URL}/health-topics/category/${cat.slug?.current ?? cat.title}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      } as MetadataRoute.Sitemap[number])
    }
  } catch {
    // No categories — skip
  }

  return routes
}
