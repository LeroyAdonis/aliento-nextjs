import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import type { SanityRelatedPost } from '@/sanity/types'

interface Props {
  posts: SanityRelatedPost[]
}

function getCategoryColor(category: string) {
  const map: Record<string, string> = {
    Wellness: 'bg-sage-100 text-sage-700',
    Nutrition: 'bg-coral-100 text-coral-700',
    'Mental Health': 'bg-primary-100 text-primary-700',
    Screening: 'bg-sand-100 text-sand-500',
    'Medical Conditions': 'bg-warm-100 text-warm-600',
    Research: 'bg-primary-100 text-primary-700',
    'Novel Techniques': 'bg-sage-100 text-sage-700',
  }
  return map[category] ?? 'bg-warm-100 text-warm-600'
}

export default function RelatedPosts({ posts }: Props) {
  if (!posts || posts.length === 0) return null

  return (
    <section className="max-w-2xl mx-auto mt-16 pt-12 border-t border-warm-200/60">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-6 h-[2px] bg-primary-400" />
        <h2 className="text-lg font-display font-semibold text-warm-900">Read more on this topic</h2>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <Link
            key={post._id}
            href={`/blog/${post.slug}`}
            className="group flex gap-5 p-5 rounded-2xl border border-warm-200/60 bg-warm-50/50 hover:border-primary-200 hover:bg-white hover:shadow-md transition-all duration-300"
          >
            {post.mainImage?.url && (
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={post.mainImage.url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
              <h3 className="font-display font-semibold text-warm-900 group-hover:text-primary-700 transition-colors line-clamp-2 mb-1">
                {post.title}
              </h3>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-warm-400">
                  <Calendar size={11} />
                  {new Date(post.publishedAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <ArrowRight size={14} className="text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

