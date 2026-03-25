import { Metadata } from 'next'
import { getAllPosts, getAllCategories } from '@/lib/sanity'
import BlogClient from '@/app/blog/BlogClient'
import type { SanityPost } from '@/lib/sanity'
import { fallbackPosts, fallbackCategories } from '@/lib/health-topics-fallbacks'

export const metadata: Metadata = {
  title: 'Health Topics',
  description:
    'Browse expert-backed articles on nutrition, mental health, screening, medical conditions, research, and wellness.',
}

export default async function HealthTopicsPage() {
  let posts: SanityPost[]
  let categories: string[]

  try {
    const [sanityPosts, sanityCategories] = await Promise.all([
      getAllPosts(),
      getAllCategories(),
    ])
    posts = sanityPosts.length > 0 ? sanityPosts : fallbackPosts
    categories =
      sanityCategories.length > 0
        ? sanityCategories.map((c) => c.title)
        : fallbackCategories
  } catch {
    posts = fallbackPosts
    categories = fallbackCategories
  }

  return <BlogClient posts={posts} categories={categories} basePath="/health-topics" />
}
