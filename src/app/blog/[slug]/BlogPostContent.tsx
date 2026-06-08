'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ArrowLeft, Clock, Tag, ArrowRight, FileDown, Loader2, CheckCircle } from 'lucide-react'
import { PortableText } from '@portabletext/react'
import type { SanityPost } from '@/lib/sanity'
import { urlFor } from '@/lib/sanity'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

/** Strip timestamp/uuid hashes from auto-generated alt text (migrated content) */
function cleanAltText(alt: string): string {
  if (!alt) return ''
  // Remove trailing timestamp-uuid patterns like "-1712232415633-095dc9e03c5d" or ".avif.jpg.png"
  return alt
    .replace(/[-_][\d]{10,}[-_][a-z0-9-]+\.\w+$/i, '') // timestamp-uuid.extension
    .replace(/[-_][\d]{10,}[-_][a-z0-9-]+$/i, '')        // without extension
    .replace(/\.\w{3,4}$/i, '')                           // file extension
    .replace(/[-_]+/g, ' ')                                // dashes/underscores → spaces
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase())               // Title Case
    || 'Article illustration'
}

function isRawHtmlBody(body: unknown[]): boolean {
  const first = body[0] as { _type?: string; children?: Array<{ _type?: string; text?: string }> }
  if (first?._type !== 'block') return false
  const firstChild = first.children?.[0]
  if (firstChild?._type !== 'span') return false
  return typeof firstChild.text === 'string' && firstChild.text.trimStart().startsWith('<')
}

function extractRawHtml(body: unknown[]): string {
  return body
    .filter((b) => (b as { _type?: string })._type === 'block')
    .map((b) => {
      const block = b as { children?: Array<{ _type?: string; text?: string }> }
      return (block.children ?? [])
        .filter((c) => c._type === 'span')
        .map((c) => c.text ?? '')
        .join('')
    })
    .join('\n')
}

const portableTextComponents = {
  types: {
    image: ({ value }: { value: { asset?: { _ref?: string }; url?: string; caption?: string; alt?: string } }) => {
      // Case 1: Sanity-native image with asset reference
      if (value?.asset?._ref) {
        const imageUrl = urlFor(value).width(800).url()
        return (
          <figure className="my-10">
            <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl shadow-lg shadow-warm-900/5">
              <Image
                src={imageUrl}
                alt={cleanAltText(value.alt || '')}
                fill
                className="object-cover hover:scale-[1.02] transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
            {value.caption && <figcaption className="text-warm-400 text-sm mt-3 text-center italic">{value.caption}</figcaption>}
          </figure>
        )
      }

      // Case 2: Migrated article image with direct URL (from MDX migration)
      if (value?.url) {
        return (
          <figure className="my-10">
            <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl bg-warm-50 shadow-lg shadow-warm-900/5">
              <Image
                src={value.url}
                alt={cleanAltText(value.alt || '')}
                fill
                className="object-cover hover:scale-[1.02] transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
            {value.caption && <figcaption className="text-warm-400 text-sm mt-3 text-center italic">{value.caption}</figcaption>}
          </figure>
        )
      }

      // Case 3: No usable image source — render placeholder
      return (
        <figure className="my-10 p-12 rounded-2xl bg-warm-50 border border-dashed border-warm-200 text-center">
          <span className="text-4xl mb-3 block">🖼️</span>
          <p className="text-warm-400 text-sm">{value.alt || 'Image'} <br /><span className="text-xs text-warm-300">(coming soon)</span></p>
        </figure>
      )
    },
  },
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value?: { href?: string } }) => (
      <a href={value?.href} className="text-primary-600 underline hover:text-primary-700 transition-colors" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
    internalLink: ({ children, value }: { children: React.ReactNode; value?: { reference?: { slug?: { current?: string } } } }) => (
      <Link href={`/blog/${value?.reference?.slug?.current || ''}`} className="text-primary-600 underline hover:text-primary-700 transition-colors font-medium">
        {children}
      </Link>
    ),
  },
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-2xl lg:text-3xl font-display font-bold mt-12 mb-5 text-warm-900">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-xl font-display font-semibold mt-10 mb-4 text-warm-900">{children}</h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="text-lg font-display font-semibold mt-8 mb-3 text-warm-900">{children}</h4>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="editorial-quote my-8 text-warm-700 italic text-lg">{children}</blockquote>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-5 leading-relaxed">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc list-outside pl-6 space-y-2 mb-6 text-warm-700">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal list-outside pl-6 space-y-2 mb-6 text-warm-700">{children}</ol>
    ),
  },
}

function PdfDownloadSection({
  articleTitle,
  articleSlug,
  pdfUrl,
}: {
  articleTitle: string
  articleSlug: string
  pdfUrl: string
}) {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [paid, setPaid] = useState(false)
  const [error, setError] = useState('')

  // Check if user just returned from successful payment
  useEffect(() => {
    if (searchParams.get('pdf') === 'success' && searchParams.get('paymentId')) {
      setPaid(true)
    }
  }, [searchParams])

  const handlePurchase = async () => {
    setLoading(true)
    setError('')

    try {
      // For now, prompt for name/email via a simple prompt
      const email = prompt('Enter your email address for the receipt:')
      if (!email) { setLoading(false); return }
      const name = prompt('Enter your full name:')
      if (!name) { setLoading(false); return }

      const res = await fetch('/api/payment/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleTitle,
          articleSlug,
          buyerEmail: email,
          buyerName: name,
        }),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Payment initiation failed')

      // Submit hidden form to PayFast
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = result.url
      Object.entries(result.data).forEach(([key, value]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = value as string
        form.appendChild(input)
      })
      document.body.appendChild(form)
      form.submit()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  if (paid) {
    return (
      <div className="mt-12 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 lg:p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle size={22} className="text-emerald-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-semibold text-warm-900 text-lg mb-1">
              Payment successful! 🎉
            </h3>
            <p className="text-warm-500 text-sm leading-relaxed mb-4">
              Thank you for your purchase. Your download should start automatically.
              If it doesn&apos;t, click the button below.
            </p>
            <a
              href={pdfUrl}
              download
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-emerald-700 transition-all hover:-translate-y-0.5 shadow-sm"
            >
              Download PDF
              <FileDown size={16} />
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-12 rounded-2xl border border-sage-200 bg-sage-50 p-6 lg:p-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center flex-shrink-0">
          <FileDown size={22} className="text-sage-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-display font-semibold text-warm-900 text-lg mb-1">
            Download this article as PDF
          </h3>
          <p className="text-warm-500 text-sm leading-relaxed mb-4">
            Get a beautifully formatted PDF version of this article to save, print,
            or share with family. Just R50 once-off.
          </p>

          {error && (
            <p className="text-red-600 text-sm mb-3">{error}</p>
          )}

          <button
            onClick={handlePurchase}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-sage-500 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-sage-600 transition-all hover:-translate-y-0.5 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Purchase PDF — R50
                <FileDown size={16} />
              </>
            )}
          </button>

          <p className="text-xs text-warm-400 mt-3">
            Secure payment via PayFast. The article remains free to read online.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function BlogPostContent({ post }: { post: SanityPost }) {
  const catTitle = typeof post.category === 'string' ? post.category : post.category?.title || ''




  return (
    <>
      {/* Header */}
      <section className="relative py-20 lg:py-24 overflow-hidden grain">
        <div className="absolute inset-0 bg-gradient-to-br from-warm-50 via-primary-50/20 to-warm-50" />
        <div className="relative max-w-3xl mx-auto px-6 lg:px-12">
          <Link href="/blog" className="inline-flex items-center gap-2 text-warm-500 hover:text-warm-900 mb-8 transition-colors group">
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to Blog
          </Link>
          <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium mt-4 ml-2 bg-primary-100 text-primary-700`}>
            {catTitle}
          </span>
          <h1 className="text-3xl lg:text-5xl font-display font-bold text-warm-900 mt-4 mb-6">{post.title}</h1>
          {post.excerpt && (
            <p className="text-xl text-warm-500 italic mb-8">{post.excerpt}</p>
          )}
          <div className="flex flex-wrap items-center gap-6 text-sm text-warm-400 pb-8 border-b border-warm-200/60">
            <span className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-sage-400 flex items-center justify-center text-white font-medium">
                {(post.author || 'A').charAt(0)}
              </div>
              <span className="text-warm-700 font-medium">{post.author}</span>
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={16} />
              {new Date(post.publishedAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-2"><Clock size={16} />5 min read</span>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          {post.body ? (
            isRawHtmlBody(post.body) ? (
              <div
                className="text-warm-700 text-lg leading-relaxed [&_p]:mb-5 [&_p]:leading-relaxed [&_h2]:text-2xl [&_h2]:lg:text-3xl [&_h2]:font-bold [&_h2]:mt-12 [&_h2]:mb-5 [&_h2]:text-warm-900 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:text-warm-900 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:mt-8 [&_h4]:mb-3 [&_h4]:text-warm-900 [&_ul]:list-disc [&_ul]:list-outside [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:list-outside [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:mb-6 [&_img]:rounded-xl [&_img]:max-w-full [&_img]:h-auto [&_img]:my-6 [&_strong]:font-bold [&_strong]:text-warm-900 [&_a]:text-primary-600 [&_a]:underline [&_a]:hover:text-primary-700 [&_blockquote]:italic [&_blockquote]:text-warm-600 [&_blockquote]:pl-4 [&_blockquote]:border-l-4 [&_blockquote]:border-primary-300"
                dangerouslySetInnerHTML={{ __html: extractRawHtml(post.body) }}
              />
            ) : (
              <div className="text-warm-700 text-lg leading-relaxed">
                {/* @ts-expect-error - PortableText components typing */}
                <PortableText value={post.body} components={portableTextComponents} />
              </div>
            )
          ) : (
            <p className="text-warm-500 text-lg italic">This post&apos;s content will be available once published in Sanity CMS.</p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-16 pt-8 border-t border-warm-200/60 flex items-center gap-3 flex-wrap">
              <span className="text-warm-500 text-sm font-medium flex items-center gap-2"><Tag size={14} />Tags:</span>
              {post.tags.map((t) => (
                <span key={t} className="px-3 py-1.5 rounded-full bg-warm-100 text-warm-600 text-sm">{t}</span>
              ))}
            </div>
          )}

          {/* Download PDF — R50 */}
          {post.pdfFile && post.pdfFile.asset?.url && (
            <PdfDownloadSection
              articleTitle={post.title}
              articleSlug={typeof post.slug === 'string' ? post.slug : post.slug?.current || ''}
              pdfUrl={post.pdfFile.asset.url}
            />
          )}

          {/* Related Posts */}
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <div className="mt-16">
              <h3 className="text-xl font-display font-semibold text-warm-900 mb-6">Read more about this topic</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {post.relatedPosts.map((related) => {
                  const relSlug = typeof related.slug === 'string' ? related.slug : related.slug?.current || ''
                  return (
                    <Link
                      key={related._id}
                      href={`/blog/${relSlug}`}
                      className="group p-6 rounded-2xl border border-warm-200/60 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
                    >
                      <h4 className="font-display font-semibold text-warm-900 mb-2 group-hover:text-primary-700 transition-colors">
                        {related.title}
                      </h4>
                      <p className="text-warm-500 text-sm line-clamp-2">{related.excerpt}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-primary-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Read more <ArrowRight size={14} />
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 p-8 lg:p-12 bg-gradient-to-br from-warm-900 to-primary-900 rounded-3xl text-center relative overflow-hidden">
            <h3 className="text-2xl lg:text-3xl font-display font-bold text-white mb-4">Need guidance on this topic?</h3>
            <p className="text-warm-300 mb-8 max-w-lg mx-auto">Book a virtual consultation and get personalised advice from a medical professional.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-warm-900 px-8 py-4 rounded-full font-medium hover:bg-warm-100 transition-colors">
              Book a Consultation <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
