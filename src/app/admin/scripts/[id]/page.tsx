'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  User,
  Mail,
  IdCard,
  Phone,
  MapPin,
  Pill,
  Plus,
  Trash2,
  FileText,
  Send,
  Loader2,
  CheckCircle2,
  ExternalLink,
  FileDown,
} from 'lucide-react'
import { format } from 'date-fns'

type Medication = {
  name: string
  dosage: string
  quantity: string
  refills: string
}

type Script = {
  id: string
  patientName: string
  patientEmail: string | null
  patientIdNumber: string | null
  patientCell: string | null
  patientAddress: string | null
  type: 'paid' | 'free'
  status: 'pending' | 'completed'
  medications: Medication[]
  specialInstructions: string | null
  scriptPdfUrl: string | null
  createdAt: string
  completedAt: string | null
}

const EMPTY_MED: Medication = { name: '', dosage: '', quantity: '', refills: '' }

export default function ScriptDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [script, setScript] = useState<Script | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [medications, setMedications] = useState<Medication[]>([])
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState('')

  async function fetchScript() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/scripts/get?id=${id}`)
      if (!res.ok) {
        if (res.status === 404) throw new Error('Script not found')
        throw new Error('Failed to load script')
      }
      const data = await res.json()
      const s = data.script
      setScript(s)
      setMedications(
        Array.isArray(s.medications) && s.medications.length > 0
          ? s.medications
          : [{ ...EMPTY_MED }]
      )
      setSpecialInstructions(s.specialInstructions || '')
      setGeneratedUrl(s.scriptPdfUrl || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load script')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!id) return
    async function load() {
      fetchScript()
    }
    load()
  }, [id])

  const addRow = useCallback(() => {
    setMedications(prev => [...prev, { ...EMPTY_MED }])
  }, [])

  const removeRow = useCallback((index: number) => {
    setMedications(prev => {
      if (prev.length <= 1) return prev
      return prev.filter((_, i) => i !== index)
    })
  }, [])

  const updateMed = useCallback((index: number, field: keyof Medication, value: string) => {
    setMedications(prev =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    )
  }, [])

  const filledCount = medications.filter(m => m.name.trim() !== '').length

  async function handleGenerate() {
    setGenerating(true)
    setSuccessMessage('')
    setError('')
    try {
      const res = await fetch('/api/scripts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          medications,
          specialInstructions,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Generation failed' }))
        throw new Error(data.error || 'Failed to generate script')
      }
      const data = await res.json()
      setGeneratedUrl(data.previewUrl)
      setScript(prev => prev ? { ...prev, status: 'completed', scriptPdfUrl: data.previewUrl } : prev)
      setSuccessMessage('Script generated successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setGenerating(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-sage-300 border-t-sage-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-warm-400">Loading script...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !script) {
    return (
      <div className="min-h-screen bg-cream-100">
        <header className="bg-white border-b border-warm-200">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
            <button
              onClick={() => router.push('/admin/scripts')}
              className="w-9 h-9 rounded-xl bg-cream-50 border border-warm-200 flex items-center justify-center hover:bg-cream-100 transition-colors"
            >
              <ArrowLeft size={18} className="text-warm-500" />
            </button>
            <h1 className="font-display font-bold text-warm-900 text-xl">Script Not Found</h1>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-6 py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <FileText size={28} className="text-red-400" />
          </div>
          <p className="text-warm-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/admin/scripts')}
            className="inline-flex items-center gap-2 text-sm font-medium text-sage-600 hover:text-sage-700"
          >
            <ArrowLeft size={16} />
            Back to Scripts
          </button>
        </main>
      </div>
    )
  }

  if (!script) return null

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <header className="bg-white border-b border-warm-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/admin/scripts')}
              className="w-9 h-9 rounded-xl bg-cream-50 border border-warm-200 flex items-center justify-center hover:bg-cream-100 transition-colors"
            >
              <ArrowLeft size={18} className="text-warm-500" />
            </button>
            <div>
              <h1 className="font-display font-bold text-warm-900 text-xl">Script Details</h1>
              <p className="text-xs text-warm-400">
                Created {format(new Date(script.createdAt), 'dd MMM yyyy, HH:mm')}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
              script.status === 'completed'
                ? 'bg-sage-100 text-sage-700'
                : 'bg-warm-100 text-warm-600'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                script.status === 'completed' ? 'bg-sage-500' : 'bg-warm-400'
              }`}
            />
            {script.status === 'completed' ? 'Completed' : 'Pending'}
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Success message */}
        {successMessage && (
          <div className="flex items-center gap-3 bg-sage-50 border border-sage-200 rounded-2xl px-5 py-4 text-sm text-sage-800">
            <CheckCircle2 size={18} className="text-sage-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Patient Details Card */}
        <section className="bg-white rounded-2xl border border-warm-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <User size={18} className="text-sage-500" />
            <h2 className="font-display font-semibold text-warm-800 text-lg">Patient Details</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <DetailField
              icon={<User size={16} />}
              label="Full Name"
              value={script.patientName}
            />
            <DetailField
              icon={<Mail size={16} />}
              label="Email"
              value={script.patientEmail || '—'}
            />
            <DetailField
              icon={<IdCard size={16} />}
              label="ID Number"
              value={script.patientIdNumber || '—'}
            />
            <DetailField
              icon={<Phone size={16} />}
              label="Cell Phone"
              value={script.patientCell || '—'}
            />
            <div className="sm:col-span-2">
              <DetailField
                icon={<MapPin size={16} />}
                label="Address"
                value={script.patientAddress || '—'}
              />
            </div>
          </div>
        </section>

        {/* Medication Table */}
        <section className="bg-white rounded-2xl border border-warm-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Pill size={18} className="text-sage-500" />
              <h2 className="font-display font-semibold text-warm-800 text-lg">Medications</h2>
              <span className="text-sm text-warm-400 ml-1">
                — Total: <strong className="text-warm-700">{filledCount}</strong> item{filledCount !== 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={addRow}
              className="flex items-center gap-1.5 text-sm font-medium text-sage-600 hover:text-sage-700 transition-colors"
            >
              <Plus size={16} />
              Add Medication
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-warm-200">
                  <th className="text-left px-3 py-2.5 text-xs font-semibold text-warm-500 uppercase tracking-wider">
                    Medication Name
                  </th>
                  <th className="text-left px-3 py-2.5 text-xs font-semibold text-warm-500 uppercase tracking-wider">
                    Dosage
                  </th>
                  <th className="text-left px-3 py-2.5 text-xs font-semibold text-warm-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="text-left px-3 py-2.5 text-xs font-semibold text-warm-500 uppercase tracking-wider">
                    Refills
                  </th>
                  <th className="w-12 px-3 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {medications.map((med, index) => (
                  <tr key={index} className="border-b border-warm-100">
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={med.name}
                        onChange={e => updateMed(index, 'name', e.target.value)}
                        placeholder="e.g. Amoxicillin"
                        className="w-full bg-cream-50 border border-warm-200 rounded-lg px-3 py-2 text-sm text-warm-700 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-400 transition-all"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={e => updateMed(index, 'dosage', e.target.value)}
                        placeholder="e.g. 500mg"
                        className="w-full bg-cream-50 border border-warm-200 rounded-lg px-3 py-2 text-sm text-warm-700 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-400 transition-all"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={med.quantity}
                        onChange={e => updateMed(index, 'quantity', e.target.value)}
                        placeholder="e.g. 30"
                        className="w-full bg-cream-50 border border-warm-200 rounded-lg px-3 py-2 text-sm text-warm-700 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-400 transition-all"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={med.refills}
                        onChange={e => updateMed(index, 'refills', e.target.value)}
                        placeholder="e.g. 2"
                        className="w-full bg-cream-50 border border-warm-200 rounded-lg px-3 py-2 text-sm text-warm-700 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-400 transition-all"
                      />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => removeRow(index)}
                        disabled={medications.length <= 1}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-warm-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Remove medication"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-warm-400 mt-3">
            Only rows with a medication name entered will be included on the PDF.
          </p>
        </section>

        {/* Special Instructions */}
        <section className="bg-white rounded-2xl border border-warm-200 p-6">
          <h2 className="font-display font-semibold text-warm-800 text-lg mb-3">
            Special Instructions
          </h2>
          <textarea
            value={specialInstructions}
            onChange={e => setSpecialInstructions(e.target.value)}
            placeholder="Any special instructions for the patient (e.g., take with food, avoid alcohol)..."
            rows={4}
            className="w-full bg-cream-50 border border-warm-200 rounded-xl px-4 py-3 text-sm text-warm-700 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-400 transition-all resize-none"
          />
        </section>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            {generatedUrl && (
              <>
                <a
                  href={generatedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-sage-600 hover:text-sage-700 transition-colors"
                >
                  <FileDown size={16} />
                  Preview PDF
                  <ExternalLink size={14} />
                </a>
                <button
                  onClick={() => {
                    setSuccessMessage('Script link sent to patient! (Demo — send integration pending)')
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blush-500 hover:bg-blush-600 text-white rounded-xl font-medium text-sm transition-all"
                >
                  <Send size={16} />
                  Send to Patient
                </button>
              </>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating || filledCount === 0}
            className="flex items-center gap-2 px-6 py-2.5 bg-sage-600 hover:bg-sage-700 text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating...
              </>
            ) : script.status === 'completed' ? (
              <>
                <FileText size={16} />
                Regenerate Script PDF
              </>
            ) : (
              <>
                <FileText size={16} />
                Generate Script PDF
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  )
}

function DetailField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-cream-50 border border-warm-200 flex items-center justify-center shrink-0 text-warm-400">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-warm-400 font-medium">{label}</p>
        <p className="text-sm text-warm-800 font-medium truncate">{value}</p>
      </div>
    </div>
  )
}
