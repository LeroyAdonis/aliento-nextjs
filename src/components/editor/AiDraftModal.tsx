/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Eye, X, Save, Loader2, RefreshCw, Sparkles } from 'lucide-react'
import DOMPurify from 'dompurify'

export interface AiDraft {
  title: string
  excerpt: string
  contentHtml: string
}

interface AiDraftModalProps {
  draft: AiDraft | null
  open: boolean
  category?: string
  onSave: () => void
  onClose: () => void
  onRegenerate?: () => void
  regenerating?: boolean
}

function sanitizeDraft(html: string): string {
  if (typeof window === 'undefined') return ''
  return DOMPurify.sanitize(html)
}

/**
 * Preview modal shown AFTER the AI finishes drafting a blog post.
 * The draft is NOT pushed into the editor until the user clicks
 * "Save to Editor" — that keeps the WYSIWYG clean until they're
 * happy with the generated content, and lets them add images after.
 */
export default function AiDraftModal({
  draft,
  open,
  category,
  onSave,
  onClose,
  onRegenerate,
  regenerating = false,
}: AiDraftModalProps) {
  if (!open || !draft) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full mb-8">
        {/* Modal header */}
        <div className="sticky top-0 bg-white border-b border-warm-200 px-6 py-4 rounded-t-2xl flex items-center justify-between gap-3 z-10">
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-sage-500" />
            <span className="font-display font-semibold text-warm-900">AI Draft Preview</span>
            <span className="text-xs text-warm-400 bg-warm-100 px-2 py-0.5 rounded-full">Review before editing</span>
          </div>
          <div className="flex items-center gap-2">
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                disabled={regenerating}
                className="flex items-center gap-2 px-4 py-2 bg-warm-100 hover:bg-warm-200 text-warm-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {regenerating ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                Regenerate
              </button>
            )}
            <button
              onClick={onSave}
              className="flex items-center gap-2 px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Save size={14} />
              Save to Editor
            </button>
            <button
              onClick={onClose}
              className="text-warm-400 hover:text-warm-600 transition-colors p-1"
              aria-label="Close AI draft preview"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Draft content */}
        <div className="p-8">
          <div className="mb-8">
            {category && (
              <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
                {category}
              </span>
            )}
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-warm-900 mb-4">
              {draft.title || 'Untitled Post'}
            </h1>
            {draft.excerpt && (
              <p className="text-xl text-warm-500 mb-6">{draft.excerpt}</p>
            )}
          </div>

          <div
            className="prose prose-warm max-w-none text-warm-700 text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: sanitizeDraft(draft.contentHtml) }}
          />
        </div>

        {/* Footer note */}
        <div className="sticky bottom-0 bg-white border-t border-warm-200 px-6 py-4 rounded-b-2xl flex items-center justify-between gap-3">
          <p className="text-sm text-warm-500 flex items-center gap-2">
            <Eye size={16} className="text-warm-400" />
            Nothing is saved yet — this draft only moves to the editor when you save it.
          </p>
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-sage-600 hover:bg-sage-700 text-white rounded-xl text-sm font-medium transition-colors shrink-0"
          >
            <Save size={16} />
            Save to Editor
          </button>
        </div>
      </div>
    </div>
  )
}
