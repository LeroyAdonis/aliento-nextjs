'use client'

import { useState, useEffect } from 'react'
import { Save, ArrowLeft, Check, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

const categories = ['Chronic Care', 'Wellness', 'Nutrition', 'Mental Health', 'Tips & Guides', 'Medical Insights']

export default function EditPostPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [tags, setTags] = useState('')
  const [author, setAuthor] = useState('Aliento Medical')
  const [sha, setSha] = useState('')
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPost()
  }, [slug])

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/posts/${slug}`)
      const data = await res.json()
      
      if (res.ok) {
        setTitle(data.title || '')
        setExcerpt(data.excerpt || '')
        setContent(data.content || '')
        setCategory(data.category || categories[0])
        setTags((data.tags || []).join(', '))
        setAuthor(data.author || 'Aliento Medical')
        setSha(data.sha || '')
      } else {
        setError(data.error || 'Failed to load post')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSaved(false)

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          category,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          author,
          slug,
          sha // Include SHA for update (not create)
        })
      })

      const data = await res.json()

      if (res.ok) {
        setSaved(true)
        // Update SHA after successful save
        if (data.sha) setSha(data.sha)
        setTimeout(() => setSaved(false), 3000)
      } else {
        setError(data.error || 'Failed to save')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Header */}
      <div className="bg-warm-900 text-white py-4">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/posts" className="text-warm-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="font-display font-bold text-lg">Edit Post</h1>
              <p className="text-warm-400 text-sm">/{slug}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/blog/${slug}`}
              target="_blank"
              className="px-4 py-2 bg-warm-700 hover:bg-warm-600 rounded-lg text-sm font-medium transition-colors"
            >
              View Post
            </Link>
            <button
              onClick={handleSave}
              disabled={saving || !title || !content}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {saved ? <Check size={16} /> : <Save size={16} />}
              {saving ? 'Publishing...' : saved ? 'Published!' : 'Save & Re-publish'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-6xl mx-auto px-6 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        </div>
      )}

      {saved && (
        <div className="max-w-6xl mx-auto px-6 mt-4">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2">
            <Check size={18} />
            Published! Vercel will rebuild automatically.
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <input
                type="text"
                placeholder="Post title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-4xl font-display font-bold bg-transparent border-0 border-b-2 border-warm-200 focus:border-primary-500 focus:outline-none py-4 text-warm-900 placeholder:text-warm-300 transition-colors"
              />
            </div>

            <div>
              <textarea
                placeholder="Brief excerpt for preview and SEO..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                className="w-full bg-white rounded-xl border border-warm-200 p-4 text-lg text-warm-700 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 resize-none"
              />
            </div>

            <div>
              <textarea
                placeholder="Write your content here... (Markdown supported)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={24}
                className="w-full bg-white rounded-xl border border-warm-200 p-6 text-warm-700 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 resize-none font-mono text-sm leading-relaxed"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-warm-200 p-6">
              <h3 className="font-display font-semibold text-warm-900 mb-4">Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-warm-600 mb-1">Author</label>
                  <select
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-warm-50 border border-warm-200 rounded-lg p-2.5 text-warm-700 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  >
                    <option value="Aliento Medical">Aliento Medical</option>
                    <option value="Dr. Aliento Team">Dr. Aliento Team</option>
                    <option value="Prof. Leegail Adonis">Prof. Leegail Adonis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-warm-600 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-warm-50 border border-warm-200 rounded-lg p-2.5 text-warm-700 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-warm-600 mb-1">Tags</label>
                  <input
                    type="text"
                    placeholder="health, wellness, tips"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full bg-warm-50 border border-warm-200 rounded-lg p-2.5 text-warm-700 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                  <p className="text-xs text-warm-400 mt-1">Separate with commas</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-warm-600 mb-1">Slug</label>
                  <input
                    type="text"
                    value={slug}
                    disabled
                    className="w-full bg-warm-100 border border-warm-200 rounded-lg p-2.5 text-warm-500 text-sm cursor-not-allowed"
                  />
                  <p className="text-xs text-warm-400 mt-1">URL slug cannot be changed</p>
                </div>
              </div>
            </div>

            {/* SEO preview */}
            <div className="bg-white rounded-2xl border border-warm-200 p-6">
              <h3 className="font-display font-semibold text-warm-900 mb-4">SEO Preview</h3>
              <div className="space-y-2">
                <p className="text-primary-700 font-medium text-lg truncate">
                  {title || 'Post title'}
                </p>
                <p className="text-green-700 text-sm">
                  alientomd.com/blog/{slug}
                </p>
                <p className="text-warm-500 text-sm line-clamp-2">
                  {excerpt || 'Post excerpt will appear here...'}
                </p>
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-2xl border border-warm-200 p-6">
              <h3 className="font-display font-semibold text-warm-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  href={`/blog/${slug}`}
                  target="_blank"
                  className="block w-full text-center px-4 py-2.5 bg-warm-50 hover:bg-warm-100 text-warm-700 rounded-lg text-sm font-medium transition-colors border border-warm-200"
                >
                  Preview on Site
                </Link>
                <Link
                  href="/admin/posts"
                  className="block w-full text-center px-4 py-2.5 bg-warm-50 hover:bg-warm-100 text-warm-700 rounded-lg text-sm font-medium transition-colors border border-warm-200"
                >
                  Back to All Posts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
