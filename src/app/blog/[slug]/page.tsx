import { getPostBySlug, getAllPosts } from '@/lib/sanity'
import Link from 'next/link'
import BlogPostContent from './BlogPostContent'
import { Metadata } from 'next'
import Script from 'next/script'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: "Post Not Found | Aliento Africa",
      description: "This post could not be found."
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aliento.africa"
  const postUrl = `${siteUrl}/blog/${slug}`
  const coverImageUrl = post.coverImage
    ? `https://cdn.sanity.io/images/kygybgb7/production/${post.coverImage.asset._ref
        .replace("image-", "")
        .replace(/-png$/, ".png")
        .replace(/-jpg$/, ".jpg")
        .replace(/-webp$/, ".webp")}`
    : `${siteUrl}/images/og-default.png`

  return {
    title: post.title,
    description: post.excerpt || "Read more on Aliento Africa",
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      type: "article",
      url: postUrl,
      title: post.title,
      description: post.excerpt || "Read more on Aliento Africa",
      images: [
        {
          url: coverImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
    },
  }
}

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

  return (
    <>
      <Script id="schema-org-article" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": post.title,
          "description": post.excerpt || "Read more on Aliento Africa",
          "image": post.coverImage
            ? `https://cdn.sanity.io/images/kygybgb7/production/${post.coverImage.asset._ref
                .replace("image-", "")
                .replace(/-png$/, ".png")
                .replace(/-jpg$/, ".jpg")
                .replace(/-webp$/, ".webp")}`
            : `${process.env.NEXT_PUBLIC_SITE_URL || "https://aliento.africa"}/images/og-default.png`,
          "datePublished": new Date(post.publishedAt).toISOString(),
          "author": {
            "@type": "Person",
            "name": post.author
          }
        })}
      </Script>
      <BlogPostContent post={post} />
    </>
  )
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
        <Link href="/blog" className="text-primary-600 font-medium hover:underline">
          ← Back to Blog
        </Link>
      </div>
    </div>
  )
}
