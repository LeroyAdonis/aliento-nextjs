import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '@/lib/sanity'
import type { SanityPost } from '@/lib/sanity'
import BlogPostContent from '@/app/blog/[slug]/BlogPostContent'
import { fallbackPosts } from '@/lib/health-topics-fallbacks'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  // Always include fallback slugs so they are pre-rendered even when Sanity is empty.
  const fallbackParams = fallbackPosts.map((p) => ({ slug: p.slug.current }))
  try {
    const posts = await getAllPosts()
    const sanityParams = posts.map((p: SanityPost) => ({ slug: p.slug.current }))
    // Merge: Sanity slugs first, then any fallback slugs not already covered.
    const sanitySlugSet = new Set(sanityParams.map((p) => p.slug))
    const uniqueFallbacks = fallbackParams.filter((p) => !sanitySlugSet.has(p.slug))
    return [...sanityParams, ...uniqueFallbacks]
  } catch {
    return fallbackParams
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const post = await getPostBySlug(slug)
    if (post) return { title: post.title, description: post.excerpt ?? '' }
  } catch {
    // fall through to fallback lookup
  }
  const fallback = fallbackPosts.find((p) => p.slug.current === slug)
  if (fallback) return { title: fallback.title, description: fallback.excerpt ?? '' }
  return { title: 'Article Not Found' }
}

export default async function HealthTopicsPostPage({ params }: Props) {
  const { slug } = await params
  let post: SanityPost | null

  try {
    post = await getPostBySlug(slug)
  } catch {
    post = null
  }

  // Sanity returned a real post — render it.
  if (post) return <BlogPostContent post={post} />

  // No Sanity post yet — check fallbacks before giving up.
  const fallback = fallbackPosts.find((p) => p.slug.current === slug) ?? null
  if (!fallback) notFound()

  return <BlogPostContent post={fallback} />
}

