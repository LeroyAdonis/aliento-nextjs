import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '@/lib/sanity'
import type { SanityPost } from '@/lib/sanity'
import BlogPostContent from '@/app/blog/[slug]/BlogPostContent'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts()
    return posts.map((p: SanityPost) => ({ slug: p.slug.current }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const post = await getPostBySlug(slug)
    if (!post) return { title: 'Article Not Found' }
    return {
      title: post.title,
      description: post.excerpt ?? '',
    }
  } catch {
    return { title: 'Article' }
  }
}

export default async function HealthTopicsPostPage({ params }: Props) {
  const { slug } = await params
  let post: SanityPost | null

  try {
    post = await getPostBySlug(slug)
  } catch {
    post = null
  }

  if (!post) notFound()

  return <BlogPostContent post={post} />
}
