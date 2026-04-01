'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ArrowLeft, Clock, Tag, ArrowRight } from 'lucide-react'
import { PortableText } from '@portabletext/react'
import type { SanityPost } from '@/lib/sanity'

const portableTextComponents = {
  types: {
    image: ({ value }: { value: { asset?: { _ref?: string }; caption?: string; alt?: string } }) => {
      const ref = value?.asset?._ref
      if (!ref) return null
      const src = `https://cdn.sanity.io/images/kygybgb7/production/${ref.replace('image-', '').replace('-png', '.png').replace('-jpg', '.jpg').replace('-webp', '.webp')}`
      return (
        <figure className="my-10">
          <Image src={src} alt={value.alt || ''} width={800} height={500} className="rounded-2xl w-full" />
          {value.caption && <figcaption className="text-warm-400 text-sm mt-3 text-center italic">{value.caption}</figcaption>}
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
            <div className="text-warm-700 text-lg leading-relaxed">
              {/* @ts-expect-error - PortableText components typing */}
              <PortableText value={post.body} components={portableTextComponents} />
            </div>
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
