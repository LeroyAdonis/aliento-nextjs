'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ArrowRight, Calendar, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SanityPost } from '@/lib/sanity'

interface BlogClientProps {
  posts: SanityPost[]
  categories: string[]
}

function getPostImage(post: SanityPost): string | null {
  if (post.coverImage) {
    // Dynamic import would be needed for urlFor, use category fallback for now
    return null
  }
  return null
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Nutrition': 'bg-sage-100 text-sage-700',
    'Mental Health': 'bg-violet-100 text-violet-700',
    'Screening': 'bg-primary-100 text-primary-700',
    'Medical Conditions': 'bg-coral-100 text-coral-700',
    'Research': 'bg-amber-100 text-amber-700',
    'Wellness': 'bg-sand-100 text-sand-500',
    'Novel Techniques': 'bg-rose-100 text-rose-700',
    'Chronic Care': 'bg-coral-100 text-coral-700',
    'Tips & Guides': 'bg-warm-200 text-warm-700',
    'Medical Insights': 'bg-primary-100 text-primary-700',
  }
  return colors[category] || 'bg-warm-100 text-warm-600'
}

function getCategoryGradient(category: string): string {
  const gradients: Record<string, string> = {
    'Nutrition': 'from-sage-50 to-sage-100',
    'Mental Health': 'from-violet-50 to-violet-100',
    'Screening': 'from-primary-50 to-primary-100',
    'Medical Conditions': 'from-coral-50 to-coral-100',
    'Research': 'from-amber-50 to-amber-100',
    'Wellness': 'from-sand-50 to-sand-100',
    'Novel Techniques': 'from-rose-50 to-rose-100',
  }
  return gradients[category] || 'from-warm-50 to-warm-100'
}

export default function BlogClient({ posts, categories }: BlogClientProps) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = posts.filter(post => {
    const catTitle = typeof post.category === 'string' ? post.category : post.category?.title || ''
    const matchesCategory = activeCategory === 'All' || catTitle === activeCategory
    const matchesSearch = searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const featuredPost = posts[0]
  const otherPosts = activeCategory === 'All' && searchQuery === '' ? filteredPosts.slice(1) : filteredPosts
  const featuredCatTitle = typeof featuredPost?.category === 'string' ? featuredPost.category : featuredPost?.category?.title || ''

  return (
    <>
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden grain">
        <div className="absolute inset-0 bg-gradient-to-br from-warm-50 via-primary-50/20 to-warm-50" />
        <div className="absolute top-20 right-0 w-[300px] h-[300px] organic-blob bg-sage-100/30 animate-breathe-slow" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[2px] bg-primary-500" />
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-warm-400">Health Blog</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-display font-bold text-warm-900 mb-6 leading-[1.1]">
              Breathe, Screen, <br /><span className="text-gradient-primary">Live.</span>
            </h1>
            <p className="text-xl text-warm-500 leading-relaxed mb-4">
              Expert insights, practical tips, and real stories to help you take control of your health journey.
            </p>
            <p className="text-sm text-warm-400 mb-10">
              7 categories · Nutrition · Mental Health · Screening · Medical Conditions · Research · Wellness · Novel Techniques
            </p>
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-400" size={20} />
              <input
                type="search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-warm-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all text-warm-700 placeholder:text-warm-400"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      {activeCategory === 'All' && searchQuery === '' && featuredPost && (
        <section className="py-12 lg:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <Link href={`/blog/${featuredPost.slug?.current || featuredPost.slug}`} className="group block">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div className={`aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br ${getCategoryGradient(featuredCatTitle)} flex items-center justify-center`}>
                    {featuredPost.coverImage ? (
                      <Image
                        src={`https://cdn.sanity.io/images/kygbgd7/production/${(featuredPost.coverImage as { asset?: { _ref?: string } })?.asset?._ref?.replace('image-', '').replace('-png', '.png').replace('-jpg', '.jpg').replace('-webp', '.webp')}`}
                        alt={featuredPost.title}
                        width={600}
                        height={450}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-12">
                        <span className="text-6xl mb-4 block">📝</span>
                        <span className="text-warm-400 text-sm font-medium">{featuredCatTitle}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(featuredCatTitle)}`}>
                        {featuredCatTitle}
                      </span>
                      <span className="text-warm-400 text-sm">Featured</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-display font-bold text-warm-900 mb-4 group-hover:text-primary-700 transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-warm-500 text-lg mb-6">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-6 text-sm text-warm-400">
                      <span className="flex items-center gap-2"><User size={14} />{featuredPost.author}</span>
                      <span className="flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(featuredPost.publishedAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-primary-600 font-medium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      Read article <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-12">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === 'All' ? 'bg-warm-900 text-white shadow-md' : 'bg-warm-100 text-warm-600 hover:bg-warm-200'
              }`}
            >
              All Posts
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat ? 'bg-warm-900 text-white shadow-md' : 'bg-warm-100 text-warm-600 hover:bg-warm-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + searchQuery}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {otherPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherPosts.map((post, index) => {
                    const catTitle = typeof post.category === 'string' ? post.category : post.category?.title || ''
                    const slug = typeof post.slug === 'string' ? post.slug : post.slug?.current || ''
                    return (
                      <motion.div
                        key={post._id || slug}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Link href={`/blog/${slug}`} className="group block h-full">
                          <article className="h-full flex flex-col bg-white rounded-3xl border border-warm-200/60 overflow-hidden hover:border-warm-300 hover:shadow-xl transition-all duration-500">
                            <div className={`aspect-[16/10] overflow-hidden relative bg-gradient-to-br ${getCategoryGradient(catTitle)}`}>
                              {post.coverImage ? (
                                <Image
                                  src={`https://cdn.sanity.io/images/kygbgd7/production/${(post.coverImage as { asset?: { _ref?: string } })?.asset?._ref?.replace('image-', '').replace('-png', '.png').replace('-jpg', '.jpg').replace('-webp', '.webp')}`}
                                  alt={post.title}
                                  width={400}
                                  height={250}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="text-4xl">📝</span>
                                </div>
                              )}
                              <div className="absolute top-4 left-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getCategoryColor(catTitle)}`}>
                                  {catTitle}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1 p-6 lg:p-8 flex flex-col">
                              <h3 className="text-xl font-display font-semibold text-warm-900 mb-3 group-hover:text-primary-700 transition-colors">
                                {post.title}
                              </h3>
                              <p className="text-warm-500 leading-relaxed mb-6 flex-1 line-clamp-3">
                                {post.excerpt}
                              </p>
                              <div className="flex items-center justify-between pt-4 border-t border-warm-100">
                                <div className="flex items-center gap-4 text-xs text-warm-400">
                                  <span className="flex items-center gap-1.5">
                                    <User size={12} />
                                    {(post.author || '').replace('Aliento ', '').replace('Dr. ', '')}
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <Calendar size={12} />
                                    {new Date(post.publishedAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </article>
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-warm-500 text-lg">No articles found.</p>
                  <button
                    onClick={() => { setActiveCategory('All'); setSearchQuery('') }}
                    className="mt-4 text-primary-600 font-medium hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  )
}
