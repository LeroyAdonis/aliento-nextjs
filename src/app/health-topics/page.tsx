import { Metadata } from 'next'
import { getAllPosts, getAllCategories } from '@/lib/sanity'
import BlogClient from '@/app/blog/BlogClient'
import type { SanityPost } from '@/lib/sanity'
import { fallbackPosts, fallbackCategories } from '@/lib/health-topics-fallbacks'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aliento.africa'

export const metadata: Metadata = {
  title: 'Health Topics',
  description:
    'Browse expert-backed articles on nutrition, mental health, screening, medical conditions, research, and wellness.',
  alternates: { canonical: `${SITE_URL}/health-topics` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/health-topics`,
    title: 'Health Topics | Aliento Medical',
    description: 'Browse expert-backed articles on nutrition, mental health, screening, medical conditions, research, and wellness.',
    siteName: 'Aliento Medical',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Health Topics | Aliento Medical',
    description: 'Browse expert-backed articles on nutrition, mental health, screening, medical conditions, research, and wellness.',
  },
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
