import { Metadata } from 'next'
import Script from 'next/script'
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aliento.africa'
  const postUrl = `${siteUrl}/health-topics/${slug}`

  try {
    const post = await getPostBySlug(slug)
    if (post) {
      const coverImageUrl = post.coverImage
        ? `https://cdn.sanity.io/images/kygybgb7/production/${post.coverImage.asset._ref
            .replace('image-', '')
            .replace(/-png$/, '.png')
            .replace(/-jpg$/, '.jpg')
            .replace(/-webp$/, '.webp')}`
        : `${siteUrl}/images/og-default.png`

      return {
        title: post.title,
        description: post.excerpt || 'Read more on Aliento Medical',
        alternates: { canonical: postUrl },
        openGraph: {
          type: 'article',
          url: postUrl,
          title: post.title,
          description: post.excerpt || 'Read more on Aliento Medical',
          publishedTime: new Date(post.publishedAt).toISOString(),
          images: [{ url: coverImageUrl, width: 1200, height: 630, alt: post.title }],
        },
        twitter: {
          card: 'summary_large_image',
          title: post.title,
          description: post.excerpt || 'Read more on Aliento Medical',
          images: [coverImageUrl],
        },
      }
    }
  } catch {
    // fall through to fallback lookup
  }

  const fallback = fallbackPosts.find((p) => p.slug.current === slug)
  if (fallback) {
    return {
      title: fallback.title,
      description: fallback.excerpt ?? '',
      alternates: { canonical: postUrl },
      openGraph: {
        type: 'article',
        url: postUrl,
        title: fallback.title,
        description: fallback.excerpt ?? '',
      },
      twitter: {
        card: 'summary_large_image',
        title: fallback.title,
        description: fallback.excerpt ?? '',
      },
    }
  }
  return { title: 'Article Not Found' }
}

export default async function HealthTopicsPostPage({ params }: Props) {
  const { slug } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aliento.africa'
  let post: SanityPost | null

  try {
    post = await getPostBySlug(slug)
  } catch {
    post = null
  }

  // Sanity returned a real post — render it with JSON-LD Article schema.
  if (post) {
    const coverImageUrl = post.coverImage
      ? `https://cdn.sanity.io/images/kygybgb7/production/${post.coverImage.asset._ref
          .replace('image-', '')
          .replace(/-png$/, '.png')
          .replace(/-jpg$/, '.jpg')
          .replace(/-webp$/, '.webp')}`
      : `${siteUrl}/images/og-default.png`

    return (
      <>
        <Script id="schema-org-article" type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt || 'Read more on Aliento Medical',
            image: coverImageUrl,
            datePublished: new Date(post.publishedAt).toISOString(),
            author: { '@type': 'Person', name: post.author || 'Aliento Medical' },
            publisher: { '@type': 'Organization', name: 'Aliento Medical', logo: { '@type': 'ImageObject', url: `${siteUrl}/logo-icon.svg` } },
          })}
        </Script>
        <BlogPostContent post={post} />
      </>
    )
  }

  // No Sanity post yet — check fallbacks before giving up.
  const fallback = fallbackPosts.find((p) => p.slug.current === slug) ?? null
  if (!fallback) notFound()

  return (
    <>
      <Script id="schema-org-article-fallback" type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: fallback.title,
          description: fallback.excerpt || '',
          datePublished: new Date(fallback.publishedAt).toISOString(),
          author: { '@type': 'Person', name: fallback.author || 'Aliento Medical' },
          publisher: { '@type': 'Organization', name: 'Aliento Medical', logo: { '@type': 'ImageObject', url: `${siteUrl}/logo-icon.svg` } },
        })}
      </Script>
      <BlogPostContent post={fallback} />
    </>
  )
}

