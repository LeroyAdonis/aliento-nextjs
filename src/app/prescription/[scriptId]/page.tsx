'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Lock, Loader2, FileText } from 'lucide-react'

export default function PrescriptionPage() {
  const params = useParams()
  const scriptId = params.scriptId as string

  const [idNumber, setIdNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [prescriptionHtml, setPrescriptionHtml] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!idNumber.trim()) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/scripts/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scriptId, idNumber: idNumber.trim() }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Verification failed' }))
        throw new Error(data.error || 'Verification failed')
      }

      const data = await res.json()
      setPrescriptionHtml(data.html)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function handlePrint() {
    const w = window.open('', '_blank')
    if (w) {
      w.document.write(prescriptionHtml)
      w.document.close()
      w.focus()
      w.print()
    }
  }

  if (prescriptionHtml) {
    return (
      <>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-display font-bold text-warm-900 text-2xl">Your Prescription</h1>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-sage-600 hover:bg-sage-700 text-white rounded-xl font-medium text-sm transition-all"
            >
              <FileText size={16} />
              Print / Save PDF
            </button>
          </div>
          <div
            className="bg-white rounded-2xl border border-warm-200 shadow-sm overflow-hidden"
            dangerouslySetInnerHTML={{ __html: prescriptionHtml }}
          />
          <p className="text-center text-sm text-warm-400 mt-6">
            Present this prescription at your pharmacy. You may also print or save as PDF.
          </p>
        </div>
      </>
    )
  }

  // Lock screen
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-sm w-full">
        <div className="bg-white rounded-2xl border border-warm-200 p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-4">
              <Lock size={24} className="text-sage-600" />
            </div>
            <h1 className="font-display font-bold text-warm-900 text-xl">Your Prescription</h1>
            <p className="text-sm text-warm-500 mt-2">
              Enter your SA ID number to view your prescription.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-warm-600 mb-1.5">ID Number</label>
              <input
                type="text"
                value={idNumber}
                onChange={e => setIdNumber(e.target.value)}
                placeholder="e.g. 8001015009088"
                autoFocus
                className="w-full bg-cream-50 border border-warm-200 rounded-xl px-4 py-3 text-sm text-warm-700 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-400 transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !idNumber.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-sage-600 hover:bg-sage-700 text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Verifying...</>
              ) : (
                'View Prescription'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
