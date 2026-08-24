import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '@/lib/sanity'
import type { SanityPost } from '@/lib/sanity'
import BlogPostContent from '@/app/blog/[slug]/BlogPostContent'
import { fallbackPosts } from '@/lib/health-topics-fallbacks'

interface Props {
  params: Promise<{ slug: string }>
}

function getCoverImageUrl(
  post: { coverImage?: { asset?: { url?: string } } },
  siteUrl: string,
): string {
  try {
    if (post.coverImage?.asset?.url) {
      return post.coverImage.asset.url
    }
  } catch {
    // fall through to default
  }
  return `${siteUrl}/images/og-default.png`
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alientomd.com'
  const base: Metadata = {
    alternates: { canonical: `${siteUrl}/health-topics/${slug}` },
  }
  try {
    const post = await getPostBySlug(slug)
    if (post) {
      return {
        ...base,
        title: post.title,
        description: post.excerpt ?? '',
        openGraph: {
          type: 'article',
          url: `${siteUrl}/health-topics/${slug}`,
          title: post.title,
          description: post.excerpt ?? '',
          publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
        },
      }
    }
  } catch {
    // fall through to fallback lookup
  }
  const fallback = fallbackPosts.find((p) => p.slug.current === slug)
  if (fallback) {
    return {
      ...base,
      title: fallback.title,
      description: fallback.excerpt ?? '',
      openGraph: {
        type: 'article',
        url: `${siteUrl}/health-topics/${slug}`,
        title: fallback.title,
        description: fallback.excerpt ?? '',
        publishedTime: fallback.publishedAt ? new Date(fallback.publishedAt).toISOString() : undefined,
      },
    }
  }
  return { ...base, title: 'Article Not Found' }
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alientomd.com'
  const coverImageUrl = getCoverImageUrl(post ?? fallback, siteUrl)
  const article = post ?? fallback
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || undefined,
    image: coverImageUrl || undefined,
    datePublished: article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined,
    dateModified: article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined,
    mainEntityOfPage: `${siteUrl}/health-topics/${slug}`,
    author: {
      '@type': 'Person',
      name: article.author || 'Dr Leegale Adonis',
      url: 'https://alientomd.com/about',
    },
    publisher: {
      '@type': 'MedicalOrganization',
      name: 'Aliento Health',
      url: 'https://alientomd.com',
      logo: { '@type': 'ImageObject', url: 'https://alientomd.com/logo-icon.svg' },
    },
    inLanguage: 'en-ZA',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BlogPostContent post={article} />
    </>
  )
}

