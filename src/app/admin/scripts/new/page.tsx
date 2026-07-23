'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, Mail, IdCard, MapPin, Phone, Loader2 } from 'lucide-react'

export default function NewScriptPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    patientName: '',
    patientEmail: '',
    patientIdNumber: '',
    patientCell: '',
    patientAddress: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  // SA ID number Luhn (mod-10) checksum validation
  function luhnCheck(id: string): boolean {
    let sum = 0
    let alternate = false
    for (let i = id.length - 1; i >= 0; i--) {
      let n = parseInt(id.charAt(i), 10)
      if (alternate) {
        n *= 2
        if (n > 9) n -= 9
      }
      sum += n
      alternate = !alternate
    }
    return sum % 10 === 0
  }

  function validate(): boolean {
    const errors: Record<string, string> = {}

    if (!form.patientName.trim()) {
      errors.patientName = 'Patient name is required'
    }
    if (form.patientEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.patientEmail)) {
      errors.patientEmail = 'Please enter a valid email address'
    }
    if (!form.patientIdNumber.trim()) {
      errors.patientIdNumber = 'ID number is required'
    } else {
      // SA ID: 13 digits — YYMMDD SSSS C A Z
      const id = form.patientIdNumber.replace(/\s/g, '')
      if (!/^\d{13}$/.test(id)) {
        errors.patientIdNumber = 'SA ID must be 13 digits (e.g. 800101 5009 088)'
      } else if (!luhnCheck(id)) {
        errors.patientIdNumber = 'ID number is invalid (failed checksum)'
      }
    }
    if (!form.patientCell.trim()) {
      errors.patientCell = 'Cell phone is required'
    } else {
      // SA mobile: 0[6-8]x xxx xxxx — 10 digits
      const cell = form.patientCell.replace(/[\s\-()]/g, '')
      if (!/^0[6-8]\d{8}$/.test(cell)) {
        errors.patientCell = 'Enter a valid SA mobile (e.g. 082 123 4567)'
      }
    }
    if (!form.patientAddress.trim()) {
      errors.patientAddress = 'Address is required'
    } else {
      const addr = form.patientAddress.trim()
      if (!/\d/.test(addr) || addr.length < 10) {
        errors.patientAddress = 'Please include street number and full address'
      }
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/scripts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Failed to create script' }))
        throw new Error(data.error || 'Failed to create script')
      }

      const data = await res.json()
      router.push(`/admin/scripts/${data.script.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <header className="bg-white border-b border-warm-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-3">
          <button
            onClick={() => router.push('/admin/scripts')}
            className="w-9 h-9 rounded-xl bg-cream-50 border border-warm-200 flex items-center justify-center hover:bg-cream-100 transition-colors"
          >
            <ArrowLeft size={18} className="text-warm-500" />
          </button>
          <div>
            <h1 className="font-display font-bold text-warm-900 text-xl">New Script</h1>
            <p className="text-xs text-warm-400">Create an ad-hoc prescription script</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Information */}
          <section className="bg-white rounded-2xl border border-warm-200 p-6 space-y-5">
            <h2 className="font-display font-semibold text-warm-800 text-lg">Patient Information</h2>

            {/* Patient Name */}
            <div>
              <label className="block text-sm font-medium text-warm-600 mb-1.5">
                Patient Name <span className="text-blush-500">*</span>
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
                <input
                  type="text"
                  name="patientName"
                  value={form.patientName}
                  onChange={handleChange}
                  placeholder="Full name"
                  required
                  className="w-full bg-cream-50 border border-warm-200 rounded-xl pl-10 pr-4 py-3 text-sm text-warm-700 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-400 transition-all"
                />
                {fieldErrors.patientName && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.patientName}</p>
                )}
              </div>
            </div>

            {/* Email & ID Number row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-warm-600 mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
                  <input
                    type="text"
                    name="patientEmail"
                    value={form.patientEmail}
                    onChange={handleChange}
                    placeholder="patient@email.com"
                    className="w-full bg-cream-50 border border-warm-200 rounded-xl pl-10 pr-4 py-3 text-sm text-warm-700 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-400 transition-all"
                  />
                  {fieldErrors.patientEmail && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.patientEmail}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-600 mb-1.5">ID Number <span className="text-blush-500">*</span></label>
                <div className="relative">
                  <IdCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
                  <input
                    type="text"
                    name="patientIdNumber"
                    value={form.patientIdNumber}
                    onChange={handleChange}
                    placeholder="ID / Passport number"
                    required
                    className="w-full bg-cream-50 border border-warm-200 rounded-xl pl-10 pr-4 py-3 text-sm text-warm-700 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-400 transition-all"
                  />
                  {fieldErrors.patientIdNumber && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.patientIdNumber}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Cell & Address row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-warm-600 mb-1.5">Cell Phone <span className="text-blush-500">*</span></label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
                  <input
                    type="tel"
                    name="patientCell"
                    value={form.patientCell}
                    onChange={handleChange}
                    placeholder="+27 XX XXX XXXX"
                    required
                    className="w-full bg-cream-50 border border-warm-200 rounded-xl pl-10 pr-4 py-3 text-sm text-warm-700 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-400 transition-all"
                  />
                  {fieldErrors.patientCell && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.patientCell}</p>
                  )}
                </div>
              </div>
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-warm-600 mb-1.5">Address <span className="text-blush-500">*</span></label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-3 text-warm-400" />
                  <textarea
                    name="patientAddress"
                    value={form.patientAddress}
                    onChange={handleChange}
                    placeholder="Street, City, Province"
                    rows={2}
                    required
                    className="w-full bg-cream-50 border border-warm-200 rounded-xl pl-10 pr-4 py-3 text-sm text-warm-700 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-400 transition-all resize-none"
                  />
                  {fieldErrors.patientAddress && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.patientAddress}</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/admin/scripts')}
              className="px-5 py-2.5 text-sm font-medium text-warm-600 bg-white border border-warm-200 rounded-xl hover:bg-cream-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !form.patientName.trim() || !form.patientIdNumber.trim() || !form.patientCell.trim() || !form.patientAddress.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-sage-600 hover:bg-sage-700 text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Script'
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
