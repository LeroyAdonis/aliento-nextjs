import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlug, getAllPosts } from '@/lib/blog'
import { Calendar, Tag, ArrowLeft, Clock } from 'lucide-react'

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

  // Simple MDX to HTML conversion (basic implementation)
  const contentHtml = post.content
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-heading font-semibold mt-8 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-heading font-semibold mt-10 mb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-heading font-bold mt-10 mb-4">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed">')
    .replace(/\n/g, '<br />')

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            {post.category}
          </span>
          <h1 className="text-3xl lg:text-4xl font-heading font-bold mt-4 mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-muted text-sm">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(post.date).toLocaleDateString('en-ZA', { 
                day: 'numeric', month: 'long', year: 'numeric' 
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              5 min read
            </span>
            <span>By {post.author}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <article className="prose prose-lg max-w-none">
            <p className="text-lg text-muted mb-6 leading-relaxed">{post.excerpt}</p>
            <div 
              className="prose-content leading-relaxed text-foreground/90"
              dangerouslySetInnerHTML={{ __html: `<p class="mb-4 leading-relaxed">${contentHtml}</p>` }}
            />
          </article>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">Tags:</span>
                {post.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 text-sm text-muted bg-surface-raised px-3 py-1 rounded-full">
                    <Tag size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Posts */}
          <div className="mt-16 pt-12 border-t border-border">
            <h3 className="text-2xl font-heading font-semibold mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getAllPosts()
                .filter((p) => p.slug !== post.slug && (p.category === post.category || p.tags.some((t) => post.tags.includes(t))))
                .slice(0, 2)
                .map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group p-6 bg-surface-raised rounded-xl hover:bg-white hover:shadow-md transition-all"
                  >
                    <span className="text-sm text-primary font-medium">{related.category}</span>
                    <h4 className="text-lg font-heading font-semibold mt-1 group-hover:text-primary transition-colors">
                      {related.title}
                    </h4>
                    <p className="text-muted text-sm mt-2">{related.excerpt.substring(0, 100)}...</p>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
