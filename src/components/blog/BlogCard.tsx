import Link from 'next/link'
import { Calendar, Tag } from 'lucide-react'

interface BlogCardProps {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  tags: string[]
}

export function BlogCard({ slug, title, excerpt, date, category, tags }: BlogCardProps) {
  return (
    <article className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center gap-3 text-sm text-muted mb-3">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
            {category}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {new Date(date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
        <h3 className="text-xl font-heading font-semibold mb-2 group-hover:text-primary transition-colors">
          <Link href={`/blog/${slug}`}>{title}</Link>
        </h3>
        <p className="text-muted leading-relaxed mb-4">{excerpt}</p>
        <div className="flex items-center gap-2 flex-wrap">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="flex items-center gap-1 text-xs text-muted">
              <Tag size={12} />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}
