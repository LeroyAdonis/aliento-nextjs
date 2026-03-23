import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import { Calendar, ArrowLeft, Tag, Clock } from 'lucide-react'
import { getPostBySlugUnified, getAllPostSlugs } from '@/lib/blog-unified'
import type { UnifiedPost } from '@/lib/blog-unified'
import RelatedPosts from '@/components/blog/RelatedPosts'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlugUnified(slug)
  if (!post) return { title: 'Post not found' }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      ...(post.mainImage && { images: [{ url: post.mainImage }] }),
    },
  }
}

const ptComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => <p className="mb-5 leading-relaxed text-warm-700">{children}</p>,
    h2: ({ children }: { children?: React.ReactNode }) => <h2 className="text-2xl lg:text-3xl font-display font-bold mt-12 mb-5 text-warm-900">{children}</h2>,
    h3: ({ children }: { children?: React.ReactNode }) => <h3 className="text-xl font-display font-semibold mt-10 mb-4 text-warm-900">{children}</h3>,
    blockquote: ({ children }: { children?: React.ReactNode }) => <blockquote className="border-l-4 border-primary-300 pl-5 italic my-8 text-warm-600">{children}</blockquote>,
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-semibold text-warm-800">{children}</strong>,
    em: ({ children }: { children?: React.ReactNode }) => <em className="italic">{children}</em>,
    link: ({ value, children }: { value?: { href: string; blank?: boolean }; children?: React.ReactNode }) => (
      <a href={value?.href} target={value?.blank ? '_blank' : undefined} rel={value?.blank ? 'noopener noreferrer' : undefined} className="text-primary-600 hover:text-primary-800 underline underline-offset-2">{children}</a>
    ),
    internalLink: ({ value, children }: { value?: { reference?: { slug?: string } }; children?: React.ReactNode }) => {
      const slug = value?.reference?.slug
      if (!slug) return <>{children}</>
      return <Link href={`/blog/${slug}`} className="text-primary-600 hover:text-primary-800 underline underline-offset-2">{children}</Link>
    },
  },
  types: {
    image: ({ value }: { value?: { url?: string; alt?: string } }) =>
      value?.url ? (
        <figure className="my-10">
          <img src={value.url} alt={value.alt ?? ''} className="w-full rounded-2xl object-cover" />
          {value.alt && <figcaption className="text-center text-sm text-warm-400 mt-3">{value.alt}</figcaption>}
        </figure>
      ) : null,
  },
}

function LegacyContent({ content }: { content: string }) {
  const html = content
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-display font-semibold mt-10 mb-4 text-warm-900">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl lg:text-3xl font-display font-bold mt-12 mb-5 text-warm-900">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-warm-800">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">$1</a>')
    .replace(/\n\n/g, '</p><p class="mb-5 leading-relaxed text-warm-700">')
    .replace(/\n/g, '<br />')
  return <div dangerouslySetInnerHTML={{ __html: `<p class="mb-5 leading-relaxed text-warm-700">${html}</p>` }} />
}

function estimateReadTime(post: UnifiedPost): number {
  const wpm = 200
  if (post.body) {
    const text = post.body.map((b: PortableTextBlock) => (b.children as Array<{text?:string}>)?.map((c) => c.text ?? '').join(' ') ?? '').join(' ')
    return Math.max(1, Math.ceil(text.split(/\s+/).length / wpm))
  }
  if (post.content) return Math.max(1, Math.ceil(post.content.split(/\s+/).length / wpm))
  return 1
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlugUnified(slug)
  if (!post) notFound()

  const readTime = estimateReadTime(post)

  return (
    <>
      <section className="relative py-20 lg:py-28 overflow-hidden grain">
        <div className="absolute inset-0 bg-gradient-to-br from-warm-50 via-primary-50/20 to-warm-50" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-12">
          <Link href="/blog" className="inline-flex items-center gap-2 text-warm-500 hover:text-warm-900 mb-8 transition-colors group">
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to Blog
          </Link>
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">{post.category}</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-display font-bold text-warm-900 mb-6 leading-tight">{post.title}</h1>
          <p className="text-xl text-warm-500 mb-8 leading-relaxed">{post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-6 text-sm text-warm-400 pb-8 border-b border-warm-200/60">
            <span className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-sage-400 flex items-center justify-center text-white font-medium text-sm">{post.author.charAt(0)}</div>
              <span className="text-warm-700 font-medium">{post.author}</span>
            </span>
            <span className="flex items-center gap-2"><Calendar size={15} />{new Date(post.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="flex items-center gap-2"><Clock size={15} />{readTime} min read</span>
          </div>
        </div>
      </section>

      {post.mainImage && (
        <div className="max-w-4xl mx-auto px-6 lg:px-12 -mt-4 mb-12">
          <div className="aspect-[16/7] rounded-3xl overflow-hidden">
            <img src={post.mainImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      <article className="max-w-4xl mx-auto px-6 lg:px-12 pb-24">
        <div className="max-w-2xl mx-auto">
          {post.source === 'sanity' && post.body
            ? <PortableText value={post.body} components={ptComponents as Parameters<typeof PortableText>[0]['components']} />
            : post.content ? <LegacyContent content={post.content} /> : null}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="max-w-2xl mx-auto mt-12 pt-8 border-t border-warm-200/60">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag size={14} className="text-warm-400" />
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-warm-100 text-warm-600 rounded-full text-xs font-medium">{tag}</span>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto mt-12">
          <div className="bg-gradient-to-br from-primary-50 to-sage-50 border border-primary-100 rounded-3xl p-8 text-center">
            <h3 className="text-xl font-display font-bold text-warm-900 mb-3">Have questions about your health?</h3>
            <p className="text-warm-500 mb-6">Book a virtual consultation — available via Zoom or Microsoft Teams.</p>
            <Link href="/consult" className="inline-flex items-center gap-2 bg-warm-900 text-white px-6 py-3 rounded-full font-medium hover:bg-warm-800 transition-all">
              Book a Consultation
            </Link>
          </div>
        </div>

        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <RelatedPosts posts={post.relatedPosts} />
        )}
      </article>
    </>
  )
}
