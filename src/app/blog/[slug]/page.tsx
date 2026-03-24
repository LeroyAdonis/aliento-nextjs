import { getPostBySlug, getAllPosts } from '@/lib/sanity'
import { notFound } from 'next/navigation'
import BlogPostContent from './BlogPostContent'

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts()
    return posts.map((post) => ({ slug: post.slug.current }))
  } catch {
    return []
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let post
  try {
    post = await getPostBySlug(slug)
  } catch {
    post = null
  }

  // If no Sanity content, show fallback message
  if (!post) {
    return <BlogPostFallback slug={slug} />
  }

  return <BlogPostContent post={post} />
}

function BlogPostFallback({ slug }: { slug: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <span className="text-6xl mb-6 block">📝</span>
        <h1 className="text-3xl font-display font-bold text-warm-900 mb-4">Post Coming Soon</h1>
        <p className="text-warm-500 mb-2">
          This article (<code className="text-sm bg-warm-100 px-2 py-0.5 rounded">{slug}</code>) will be published through our CMS soon.
        </p>
        <p className="text-warm-400 text-sm mb-8">
          Content is managed via Sanity CMS. Visit /admin to create and publish posts.
        </p>
        <a href="/blog" className="text-primary-600 font-medium hover:underline">
          ← Back to Blog
        </a>
      </div>
    </div>
  )
}
