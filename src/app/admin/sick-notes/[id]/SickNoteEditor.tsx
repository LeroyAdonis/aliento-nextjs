'use client'

import { useState } from 'react'
import {
  CheckCircle2,
  Info,
  Loader2,
  Mail,
  Printer,
  Send,
  Sparkles,
} from 'lucide-react'

type EmailInput = {
  patientEmail: string
  patientName: string
  symptoms: string
  reason: string
}

type EmailResult = { success: boolean; error?: string }

type DraftResponse = {
  ok?: boolean
  draft?: {
    symptoms?: unknown
    reason?: unknown
  }
}

const UNAVAILABLE_NOTICE = 'AI is unavailable right now — no problem, you can type as usual.'
const OPTED_OUT_NOTICE =
  'This patient opted out of AI assistance — no problem, you can type as usual.'

export default function SickNoteEditor({
  questionnaireId,
  patientName,
  patientEmail,
  initialSymptoms,
  initialReason,
  emailAction,
}: {
  questionnaireId: string
  patientName: string
  patientEmail: string
  initialSymptoms: string
  initialReason: string
  emailAction: (input: EmailInput) => Promise<EmailResult>
}) {
  const [symptoms, setSymptoms] = useState(initialSymptoms)
  const [reason, setReason] = useState(initialReason)
  const [drafting, setDrafting] = useState(false)
  const [aiBanner, setAiBanner] = useState('')
  const [aiNotice, setAiNotice] = useState('')
  const [showAiChips, setShowAiChips] = useState(false)
  const [sending, setSending] = useState(false)
  const [emailSuccess, setEmailSuccess] = useState('')
  const [emailError, setEmailError] = useState('')

  function clearAiHighlights() {
    setAiBanner('')
    setShowAiChips(false)
  }

  async function handleDraft() {
    setDrafting(true)
    setAiBanner('')
    setAiNotice('')
    try {
      const res = await fetch('/api/ai/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'sick-note', questionnaireId }),
      })
      if (!res.ok) {
        setAiNotice(res.status === 403 ? OPTED_OUT_NOTICE : UNAVAILABLE_NOTICE)
        return
      }
      const data = (await res.json()) as DraftResponse
      if (data.ok && data.draft) {
        const draftSymptoms = typeof data.draft.symptoms === 'string' ? data.draft.symptoms : ''
        const draftReason = typeof data.draft.reason === 'string' ? data.draft.reason : ''
        if (!draftSymptoms && !draftReason) {
          setAiNotice(UNAVAILABLE_NOTICE)
          return
        }
        if (draftSymptoms) setSymptoms(draftSymptoms)
        if (draftReason) setReason(draftReason)
        setAiBanner('AI draft ready — please review and edit before sending.')
        setShowAiChips(true)
      } else {
        setAiNotice(UNAVAILABLE_NOTICE)
      }
    } catch {
      setAiNotice(UNAVAILABLE_NOTICE)
    } finally {
      setDrafting(false)
    }
  }

  async function handleEmail() {
    setSending(true)
    setEmailSuccess('')
    setEmailError('')
    try {
      const result = await emailAction({
        patientName,
        patientEmail,
        symptoms,
        reason,
      })
      if (result.success) {
        setEmailSuccess('Sick note emailed to the patient successfully!')
      } else {
        setEmailError(result.error || 'Failed to send the email. Please try again.')
      }
    } catch {
      setEmailError('Failed to send the email. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="bg-white rounded-2xl border border-warm-200 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-sage-500" />
          <h2 className="font-display font-semibold text-warm-800 text-lg">The Note</h2>
        </div>
        <button
          onClick={handleDraft}
          disabled={drafting}
          className="flex items-center gap-2 px-6 py-3 bg-sage-600 hover:bg-sage-700 text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {drafting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Drafting…
            </>
          ) : (
            <>✨ Write draft for me</>
          )}
        </button>
      </div>

      {aiBanner && (
        <div className="flex items-center gap-3 bg-sage-50 border border-sage-200 rounded-2xl px-5 py-4 mb-4 text-sm text-sage-800">
          <Sparkles size={18} className="text-sage-600 shrink-0" />
          <span>{aiBanner}</span>
        </div>
      )}

      {aiNotice && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-4 text-sm text-amber-800">
          <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <span>{aiNotice}</span>
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-warm-800 mb-1.5">Symptoms</label>
          <div className="relative">
            <textarea
              value={symptoms}
              onChange={e => {
                setSymptoms(e.target.value)
                clearAiHighlights()
              }}
              rows={4}
              placeholder="Describe the patient's symptoms..."
              className={`w-full bg-cream-50 border border-warm-200 rounded-xl px-4 py-3 text-sm text-warm-700 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-400 transition-all resize-none ${showAiChips ? 'pr-12' : ''}`}
            />
            {showAiChips && (
              <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-sage-100 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-sage-700">
                AI
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-800 mb-1.5">Reason</label>
          <div className="relative">
            <textarea
              value={reason}
              onChange={e => {
                setReason(e.target.value)
                clearAiHighlights()
              }}
              rows={3}
              placeholder="State the reason for sick leave..."
              className={`w-full bg-cream-50 border border-warm-200 rounded-xl px-4 py-3 text-sm text-warm-700 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-400 transition-all resize-none ${showAiChips ? 'pr-12' : ''}`}
            />
            {showAiChips && (
              <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-sage-100 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-sage-700">
                AI
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Email result messages */}
      {emailSuccess && (
        <div className="flex items-center gap-3 bg-sage-50 border border-sage-200 rounded-2xl px-5 py-4 mt-5 text-sm text-sage-800">
          <CheckCircle2 size={18} className="text-sage-600 shrink-0" />
          <span>{emailSuccess}</span>
        </div>
      )}
      {emailError && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4 mt-5 text-sm text-red-700">
          <Info size={18} className="text-red-500 shrink-0 mt-0.5" />
          <span>{emailError}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-6">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-cream-50 hover:bg-cream-100 border border-warm-200 text-warm-700 rounded-xl font-medium text-sm transition-all"
        >
          <Printer size={16} />
          Print
        </button>
        <button
          onClick={handleEmail}
          disabled={sending || !symptoms.trim() || !reason.trim()}
          title={
            !symptoms.trim() || !reason.trim()
              ? 'Fill in both symptoms and reason before emailing'
              : undefined
          }
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blush-500 hover:bg-blush-600 disabled:bg-blush-300 text-white rounded-xl font-medium text-sm transition-all disabled:cursor-not-allowed"
        >
          {sending ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Sending...
            </>
          ) : (
            <>
              <Mail size={16} /> Email Patient
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-warm-400 mt-3">
        Nothing is sent or signed automatically — you stay in control of every word.
      </p>
    </section>
  )
}
