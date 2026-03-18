'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, ArrowRight, Calendar, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  category: string
  tags: string[]
  author: string
}

function getCategoryImage(category: string): string {
  const map: Record<string, string> = {
    'Wellness': '/images/blog/wellness.png',
    'Chronic Care': '/images/blog/chronic-care.png',
    'Mental Health': '/images/blog/mental-health.png',
    'Nutrition': '/images/blog/nutrition.png',
    'Tips & Guides': '/images/blog/tips-guides.png',
    'Medical Insights': '/images/blog/medical-insights.png',
  }
  return map[category] || '/images/blog/default.png'
}

export default function BlogClient({ posts: initialPosts, categories: initialCategories }: { posts: Post[]; categories: string[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [categories, setCategories] = useState<string[]>(initialCategories)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Re-fetch from public JSON to ensure fresh data
    fetch('/blog-data.json')
      .then(r => r.json())
      .then((data: Post[]) => {
        if (data.length > 0) {
          setPosts(data)
          setCategories([...new Set(data.map(p => p.category))])
        }
      })
      .catch(() => {})
  }, [])

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredPost = posts[0]
  const otherPosts = activeCategory === 'All' && searchQuery === '' ? filteredPosts.slice(1) : filteredPosts

  return (
    <>
      <section className="relative py-24 lg:py-32 overflow-hidden grain">
        <div className="absolute inset-0 bg-gradient-to-br from-warm-50 via-primary-50/20 to-warm-50" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[2px] bg-primary-500" />
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-warm-400">Health Blog</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-display font-bold text-warm-900 mb-6 leading-[1.1]">
              Insights for your<br /><span className="text-gradient-primary">healthiest</span> life.
            </h1>
            <p className="text-xl text-warm-500 leading-relaxed mb-10">Expert insights, practical tips, and real stories to help you take control of your health journey.</p>
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-400" size={20} />
              <input type="search" placeholder="Search articles..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-warm-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all text-warm-700 placeholder:text-warm-400" />
            </div>
          </motion.div>
        </div>
      </section>

      {activeCategory === 'All' && searchQuery === '' && featuredPost && (
        <section className="py-12 lg:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <Link href={`/blog/${featuredPost.slug}`} className="group block">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden">
                  <img src={getCategoryImage(featuredPost.category)} alt={featuredPost.title} className="w-full h-full object-cover" />
                </div>
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-medium">{featuredPost.category}</span>
                      <span className="text-warm-400 text-sm">Featured</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-display font-bold text-warm-900 mb-4 group-hover:text-primary-700 transition-colors">{featuredPost.title}</h2>
                    <p className="text-warm-500 text-lg mb-6">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-6 text-sm text-warm-400">
                      <span className="flex items-center gap-2"><User size={14} />{featuredPost.author}</span>
                      <span className="flex items-center gap-2"><Calendar size={14} />{new Date(featuredPost.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
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

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap gap-3 mb-12">
            <button onClick={() => setActiveCategory('All')} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === 'All' ? 'bg-warm-900 text-white shadow-md' : 'bg-warm-100 text-warm-600 hover:bg-warm-200'}`}>All Posts</button>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat ? 'bg-warm-900 text-white shadow-md' : 'bg-warm-100 text-warm-600 hover:bg-warm-200'}`}>{cat}</button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={activeCategory + searchQuery} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              {otherPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherPosts.map((post, index) => (
                    <motion.div key={post.slug} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                      <Link href={`/blog/${post.slug}`} className="group block h-full">
                        <article className="h-full flex flex-col bg-white rounded-3xl border border-warm-200/60 overflow-hidden hover:border-warm-300 hover:shadow-xl transition-all duration-500">
                          <div className="aspect-[16/10] overflow-hidden relative">
                            <img src={getCategoryImage(post.category)} alt={post.title} className="w-full h-full object-cover" />
                            <div className="absolute top-4 left-4">
                              <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-warm-700 text-xs font-medium shadow-sm">{post.category}</span>
                            </div>
                          </div>
                          <div className="flex-1 p-6 lg:p-8 flex flex-col">
                            <h3 className="text-xl font-display font-semibold text-warm-900 mb-3 group-hover:text-primary-700 transition-colors">{post.title}</h3>
                            <p className="text-warm-500 leading-relaxed mb-6 flex-1 line-clamp-3">{post.excerpt}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-warm-100">
                              <div className="flex items-center gap-4 text-xs text-warm-400">
                                <span className="flex items-center gap-1.5"><User size={12} />{post.author.replace('Aliento ', '').replace('Dr. ', '')}</span>
                                <span className="flex items-center gap-1.5"><Calendar size={12} />{new Date(post.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</span>
                              </div>
                            </div>
                          </div>
                        </article>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-warm-500 text-lg">No articles found.</p>
                  <button onClick={() => { setActiveCategory('All'); setSearchQuery(''); }} className="mt-4 text-primary-600 font-medium hover:underline">Clear filters</button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  )
}
