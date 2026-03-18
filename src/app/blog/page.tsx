import { BlogCard } from '@/components/blog/BlogCard'
import { getAllPosts, getAllCategories } from '@/lib/blog'
import { Search } from 'lucide-react'

export default function BlogPage() {
  const posts = getAllPosts()
  const categories = getAllCategories()

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-4">
            Health & Wellness Blog
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto mb-8">
            Expert insights, tips, and stories to help you on your health journey.
          </p>
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
            <input
              type="search"
              placeholder="Search articles..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button className="px-4 py-2 rounded-full bg-primary text-white text-sm font-medium">
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className="px-4 py-2 rounded-full border border-border text-muted hover:border-primary hover:text-primary text-sm font-medium transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogCard key={post.slug} {...post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted text-lg">No blog posts yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
