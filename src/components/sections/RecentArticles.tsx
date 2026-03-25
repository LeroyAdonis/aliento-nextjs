import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { BlogCard } from '@/components/blog/BlogCard'

interface Post {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  category?: { title: string }
  publishedAt?: string
  author?: string
}

interface RecentArticlesProps {
  posts: Post[]
}

export function RecentArticles({ posts }: RecentArticlesProps) {
  const recent = posts.slice(0, 3)

  return (
    <section className="py-20 lg:py-28 bg-cream-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header row */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-px bg-sage-400" />
              <span className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-sage-500">
                Latest articles
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-display font-semibold text-warm-900">
              From the blog
            </h2>
          </div>
          <Link
            href="/health-topics"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-body font-medium text-sage-600 hover:text-sage-700 transition-colors group"
          >
            View all articles
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recent.map((post) => (
            <BlogCard key={post._id} post={post} basePath="/health-topics" />
          ))}
        </div>

        {/* Mobile "view all" */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/health-topics"
            className="inline-flex items-center gap-2 text-sage-600 font-body font-medium text-sm"
          >
            View all articles <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </section>
  )
}
