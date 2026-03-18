import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlug, getAllPosts } from '@/lib/blog'
import { Calendar, ArrowLeft, Clock, User, Tag } from 'lucide-react'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug)
  
  if (!post) {
    notFound()
  }

  // MDX to HTML conversion with proper styling
  const contentHtml = post.content
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-display font-semibold mt-10 mb-4 text-warm-900">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl lg:text-3xl font-display font-bold mt-12 mb-5 text-warm-900">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-display font-bold mt-10 mb-4">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-warm-800">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p class="mb-5 leading-relaxed">')
    .replace(/\n/g, '<br />')

  return (
    <>
      {/* Header */}
      <section className="relative py-20 lg:py-24 overflow-hidden grain">
        <div className="absolute inset-0 bg-gradient-to-br from-warm-50 via-primary-50/20 to-warm-50" />
        <div className="absolute top-10 right-0 w-[300px] h-[300px] organic-blob bg-primary-100/30 animate-breathe-slow" />
        
        <div className="relative max-w-4xl mx-auto px-6 lg:px-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-warm-500 hover:text-warm-900 mb-8 transition-colors group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to Blog
          </Link>
          
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
              {post.category}
            </span>
          </div>
          
          <h1 className="text-3xl lg:text-5xl font-display font-bold text-warm-900 mb-6 leading-[1.15]">
            {post.title}
          </h1>
          
          <p className="text-xl text-warm-500 leading-relaxed mb-8">
            {post.excerpt}
          </p>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-warm-400 pb-8 border-b border-warm-200/60">
            <span className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-sage-400 flex items-center justify-center text-white font-medium">
                {(post.author || "A").charAt(0)}
              </div>
              <span className="text-warm-700 font-medium">{post.author || "Aliento Medical"}</span>
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={16} />
              {new Date(post.date).toLocaleDateString('en-ZA', { 
                day: 'numeric', month: 'long', year: 'numeric' 
              })}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={16} />
              5 min read
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <article className="prose prose-lg max-w-none">
            <div 
              className="text-warm-700 text-lg leading-relaxed [&>h2]:font-display [&>h3]:font-display"
              dangerouslySetInnerHTML={{ __html: `<p class="text-xl text-warm-600 mb-8 leading-relaxed">${post.excerpt}</p>${contentHtml}` }}
            />
          </article>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-16 pt-8 border-t border-warm-200/60">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-warm-500 text-sm font-medium flex items-center gap-2">
                  <Tag size={14} />
                  Tags:
                </span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full bg-warm-100 text-warm-600 text-sm hover:bg-warm-200 transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 p-8 lg:p-12 bg-gradient-to-br from-warm-900 to-primary-900 rounded-3xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[200px] h-[200px] organic-blob bg-primary-500/20 animate-breathe-slow" />
            <div className="relative">
              <h3 className="text-2xl lg:text-3xl font-display font-bold text-white mb-4">
                Ready to take the next step?
              </h3>
              <p className="text-warm-300 mb-8 max-w-lg mx-auto">
                Book a consultation with our team and discover how personalised 
                healthcare can transform your life.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-warm-900 px-8 py-4 rounded-full font-medium hover:bg-warm-100 transition-colors"
              >
                Book a Consultation
                <ArrowLeft size={18} className="rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
