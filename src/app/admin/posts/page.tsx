'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit3, Calendar, User, Search, FileText, Trash2, AlertTriangle, X } from 'lucide-react'

interface PostMeta {
  slug: string
  name: string
  title?: string
  date?: string
  category?: string
  author?: string
  excerpt?: string
}

export default function AdminPostsList() {
  const [posts, setPosts] = useState<PostMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<PostMeta | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts')
      const data = await res.json()
      
      if (res.ok && data.posts) {
        const postsWithMeta = await Promise.all(
          data.posts.map(async (p: { slug: string; name: string }) => {
            try {
              const metaRes = await fetch(`/api/posts/${p.slug}`)
              if (metaRes.ok) {
                const meta = await metaRes.json()
                return { ...p, ...meta }
              }
            } catch {}
            return { ...p, title: p.slug.replace(/-/g, ' ') }
          })
        )
        postsWithMeta.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
        setPosts(postsWithMeta)
      } else {
        setError(data.error || 'Failed to load posts')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)

    try {
      const res = await fetch(`/api/posts/${deleteTarget.slug}`, { method: 'DELETE' })
      const data = await res.json()

      if (res.ok) {
        setPosts(prev => prev.filter(p => p.slug !== deleteTarget.slug))
        setDeleteTarget(null)
      } else {
        setError(data.error || 'Failed to delete post')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  const filtered = posts.filter(p =>
    !search || 
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  )

  const categoryColor = (cat?: string) => {
    const colors: Record<string, string> = {
      'Wellness': 'bg-sage-100 text-sage-700',
      'Chronic Care': 'bg-amber-100 text-amber-700',
      'Mental Health': 'bg-purple-100 text-purple-700',
      'Nutrition': 'bg-green-100 text-green-700',
      'Medical Insights': 'bg-blue-100 text-blue-700',
      'Tips & Guides': 'bg-orange-100 text-orange-700',
    }
    return colors[cat || ''] || 'bg-warm-100 text-warm-700'
  }

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setDeleteTarget(null)}
              className="absolute top-4 right-4 text-warm-400 hover:text-warm-600 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <h3 className="font-display font-bold text-xl text-warm-900 mb-2">Delete Article?</h3>
            <p className="text-warm-600 mb-2">
              Are you sure you want to delete <strong>{deleteTarget.title || deleteTarget.slug}</strong>?
            </p>
            <p className="text-warm-400 text-sm mb-6">
              This will remove the file from GitHub. Vercel will rebuild automatically. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 bg-warm-100 hover:bg-warm-200 text-warm-700 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-warm-900 text-white py-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-warm-400 hover:text-white transition-colors">
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="font-display font-bold text-2xl">Articles</h1>
                <p className="text-warm-400 text-sm">{posts.length} posts total</p>
              </div>
            </div>
            <Link
              href="/admin/posts/new"
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={16} />
              New Post
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-warm-200 rounded-xl pl-11 pr-4 py-3 text-warm-700 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <FileText size={48} className="mx-auto text-warm-300 mb-4" />
            <h3 className="font-display font-semibold text-warm-900 text-xl mb-2">
              {search ? 'No articles found' : 'No articles yet'}
            </h3>
            <p className="text-warm-500 mb-6">
              {search ? 'Try a different search term' : 'Create your first blog post to get started'}
            </p>
            {!search && (
              <Link
                href="/admin/posts/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors"
              >
                <Plus size={18} />
                Create First Post
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((post) => (
              <div
                key={post.slug}
                className="bg-white rounded-xl border border-warm-200 p-5 hover:border-primary-200 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display font-semibold text-warm-900 text-lg truncate">
                        {post.title || post.slug}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${categoryColor(post.category)}`}>
                        {post.category || 'Uncategorized'}
                      </span>
                    </div>
                    
                    {post.excerpt && (
                      <p className="text-warm-500 text-sm line-clamp-1 mb-3">{post.excerpt}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-warm-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} />
                        {post.date ? new Date(post.date).toLocaleDateString('en-ZA', { 
                          day: 'numeric', month: 'short', year: 'numeric' 
                        }) : 'No date'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User size={13} />
                        {post.author || 'Aliento Medical'}
                      </span>
                      <span className="text-warm-300">/blog/{post.slug}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/posts/edit/${post.slug}`}
                      className="flex items-center gap-2 px-4 py-2 bg-warm-50 hover:bg-primary-50 text-warm-600 hover:text-primary-700 rounded-lg text-sm font-medium transition-colors border border-warm-200 hover:border-primary-200"
                    >
                      <Edit3 size={14} />
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(post)}
                      className="flex items-center gap-2 px-3 py-2 bg-warm-50 hover:bg-red-50 text-warm-400 hover:text-red-600 rounded-lg text-sm transition-colors border border-warm-200 hover:border-red-200"
                      title="Delete post"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
