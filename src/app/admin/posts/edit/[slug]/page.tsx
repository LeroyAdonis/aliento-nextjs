'use client'

import { useState, useEffect } from 'react'
import { Save, ArrowLeft, Check, AlertCircle, Eye, X } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import TiptapEditor from '@/components/editor/TiptapEditor'

const categories = ['Chronic Care', 'Wellness', 'Nutrition', 'Mental Health', 'Tips & Guides', 'Medical Insights']

function renderPreview(title: string, content: string) {
  return content
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-8 mb-3 text-warm-900">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-10 mb-4 text-warm-900">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-10 mb-4 text-warm-900">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-warm-800">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>')
    .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed">')
    .replace(/\n/g, '<br />')
}

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
  const [showPreview, setShowPreview] = useState(false)

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
          sha
        })
      })

      const data = await res.json()

      if (res.ok) {
        setSaved(true)
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
      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPreview(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full mb-8">
            {/* Preview Header */}
            <div className="sticky top-0 bg-white border-b border-warm-200 px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <Eye size={18} className="text-primary-500" />
                <span className="font-display font-semibold text-warm-900">Preview</span>
                <span className="text-xs text-warm-400 bg-warm-100 px-2 py-0.5 rounded-full">Before publishing</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setShowPreview(false); handleSave(); }}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Save size={14} />
                  Publish Now
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-warm-400 hover:text-warm-600 transition-colors p-1"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="p-8">
              {/* Hero section */}
              <div className="mb-8">
                <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
                  {category}
                </span>
                <h1 className="text-3xl lg:text-4xl font-display font-bold text-warm-900 mb-4">
                  {title || 'Untitled Post'}
                </h1>
                {excerpt && (
                  <p className="text-xl text-warm-500 mb-6">{excerpt}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-warm-400 pb-6 border-b border-warm-200/60">
                  <span className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-sage-400 flex items-center justify-center text-white text-sm font-medium">
                      {(author || 'A').charAt(0)}
                    </div>
                    <span className="text-warm-700 font-medium">{author || 'Aliento Medical'}</span>
                  </span>
                  <span>{new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span>5 min read</span>
                </div>
              </div>

              {/* Article body */}
              <div 
                className="text-warm-700 text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderPreview(title, content) }}
              />

              {/* Tags */}
              {tags && (
                <div className="mt-8 pt-6 border-t border-warm-200/60 flex items-center gap-2 flex-wrap">
                  <span className="text-warm-500 text-sm font-medium">Tags:</span>
                  {tags.split(',').map(t => t.trim()).filter(Boolean).map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-warm-100 text-warm-600 text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 px-4 py-2 bg-warm-700 hover:bg-warm-600 rounded-lg text-sm font-medium transition-colors"
            >
              <Eye size={16} />
              Preview
            </button>
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
              <TiptapEditor
                content={content}
                onChange={setContent}
                placeholder="Write your article here..."
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
                <button
                  onClick={() => setShowPreview(true)}
                  className="block w-full text-center px-4 py-2.5 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg text-sm font-medium transition-colors border border-primary-200"
                >
                  Preview Before Publishing
                </button>
                <Link
                  href={`/blog/${slug}`}
                  target="_blank"
                  className="block w-full text-center px-4 py-2.5 bg-warm-50 hover:bg-warm-100 text-warm-700 rounded-lg text-sm font-medium transition-colors border border-warm-200"
                >
                  View Live Post
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
