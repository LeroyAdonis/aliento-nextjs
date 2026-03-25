import Link from 'next/link'
import { Calendar, Tag } from 'lucide-react'

interface BlogCardPost {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  category?: { title: string }
  publishedAt?: string
  author?: string
}

interface BlogCardProps {
  post: BlogCardPost
  basePath?: string
}

export function BlogCard({ post, basePath = '/health-topics' }: BlogCardProps) {
  return (
    <article className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center gap-3 text-sm text-muted mb-3">
          {post.category?.title && (
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
              {post.category.title}
            </span>
          )}
          {post.publishedAt && (
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(post.publishedAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          )}
        </div>
        <h3 className="text-xl font-heading font-semibold mb-2 group-hover:text-primary transition-colors">
          <Link href={`${basePath}/${post.slug.current}`}>{post.title}</Link>
        </h3>
        {post.excerpt && <p className="text-muted leading-relaxed mb-4">{post.excerpt}</p>}
        {post.author && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-muted">
              <Tag size={12} />
              {post.author}
            </span>
          </div>
        )}
      </div>
    </article>
  )
}
