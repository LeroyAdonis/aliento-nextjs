import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface Post {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  category?: { title: string }
  publishedAt?: string
  author?: string
}

interface FeaturedArticleProps {
  post: Post
}

const categoryColors: Record<string, string> = {
  Nutrition:           'bg-sage-100  text-sage-700',
  'Mental Health':     'bg-blush-100 text-blush-700',
  Screening:           'bg-cream-300 text-warm-700',
  'Medical Conditions':'bg-warm-100  text-warm-700',
  Research:            'bg-sage-50   text-sage-600',
  Wellness:            'bg-blush-50  text-blush-600',
  default:             'bg-cream-200 text-warm-600',
}

export function FeaturedArticle({ post }: FeaturedArticleProps) {
  const category = post.category?.title ?? ''
  const badgeClass = categoryColors[category] ?? categoryColors.default

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-ZA', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : ''

  return (
    <section className="py-16 lg:py-20 bg-blush-50/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Section label */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-6 h-px bg-sage-400" />
          <span className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-sage-500">
            Featured Read
          </span>
        </div>

        <Link
          href={`/health-topics/${post.slug.current}`}
          className="group block rounded-2xl overflow-hidden bg-white border border-warm-200/60 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
        >
          <div className="grid md:grid-cols-5 min-h-[280px]">

            {/* Illustrated placeholder */}
            <div className="md:col-span-2 bg-gradient-to-br from-sage-100 to-sage-200 flex items-center justify-center min-h-[180px] md:min-h-0">
              <span className="text-7xl opacity-40 select-none">🌿</span>
            </div>

            {/* Content */}
            <div className="md:col-span-3 p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs font-body font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${badgeClass}`}>
                  {category || 'Health'}
                </span>
                {formattedDate && (
                  <span className="text-xs text-warm-400">{formattedDate}</span>
                )}
              </div>

              <h2 className="text-2xl lg:text-3xl font-display font-semibold text-warm-900 mb-4 leading-snug group-hover:text-sage-600 transition-colors">
                {post.title}
              </h2>

              {post.excerpt && (
                <p className="text-warm-500 leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
              )}

              <span className="inline-flex items-center gap-2 text-sm font-body font-medium text-sage-600 group-hover:gap-3 transition-all">
                Read article
                <ArrowRight size={15} />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}
