'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Calendar, ArrowLeft, Clock, Tag } from 'lucide-react'

interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author: string
}

export default function BlogPostPage() {
  const params = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/blog-data.json')
      .then(r => r.json())
      .then((posts: BlogPost[]) => {
        const found = posts.find(p => p.slug === params.slug)
        setPost(found || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold text-warm-900 mb-4">Post not found</h1>
          <Link href="/blog" className="text-primary-600 hover:underline">Back to Blog</Link>
        </div>
      </div>
    )
  }

  const contentHtml = post.content
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-display font-semibold mt-10 mb-4 text-warm-900">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl lg:text-3xl font-display font-bold mt-12 mb-5 text-warm-900">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-warm-800">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p class="mb-5 leading-relaxed">')
    .replace(/\n/g, '<br />')

  return (
    <>
      <section className="relative py-20 lg:py-24 overflow-hidden grain">
        <div className="absolute inset-0 bg-gradient-to-br from-warm-50 via-primary-50/20 to-warm-50" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-12">
          <Link href="/blog" className="inline-flex items-center gap-2 text-warm-500 hover:text-warm-900 mb-8 transition-colors group">
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to Blog
          </Link>
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mt-4 ml-2">{post.category}</span>
          <h1 className="text-3xl lg:text-5xl font-display font-bold text-warm-900 mt-4 mb-6">{post.title}</h1>
          <p className="text-xl text-warm-500 mb-8">{post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-6 text-sm text-warm-400 pb-8 border-b border-warm-200/60">
            <span className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-sage-400 flex items-center justify-center text-white font-medium">{post.author.charAt(0)}</div>
              <span className="text-warm-700 font-medium">{post.author}</span>
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={16} />
              {new Date(post.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-2"><Clock size={16} />5 min read</span>
          </div>
        </div>
      </section>
      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="text-warm-700 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: contentHtml }} />
          {post.tags.length > 0 && (
            <div className="mt-16 pt-8 border-t border-warm-200/60 flex items-center gap-3 flex-wrap">
              <span className="text-warm-500 text-sm font-medium flex items-center gap-2"><Tag size={14} />Tags:</span>
              {post.tags.map((t) => (
                <span key={t} className="px-3 py-1.5 rounded-full bg-warm-100 text-warm-600 text-sm">{t}</span>
              ))}
            </div>
          )}
          <div className="mt-16 p-8 lg:p-12 bg-gradient-to-br from-warm-900 to-primary-900 rounded-3xl text-center relative overflow-hidden">
            <h3 className="text-2xl lg:text-3xl font-display font-bold text-white mb-4">Ready to take the next step?</h3>
            <p className="text-warm-300 mb-8 max-w-lg mx-auto">Book a consultation and discover how personalised healthcare can transform your life.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-warm-900 px-8 py-4 rounded-full font-medium hover:bg-warm-100 transition-colors">
              Book a Consultation <ArrowLeft size={18} className="rotate-180" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
