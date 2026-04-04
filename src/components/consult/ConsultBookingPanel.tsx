'use client'

import { useState } from 'react'
import { ArrowRight, Loader2, CreditCard } from 'lucide-react'

const options = [
  { id: 'consult-30', label: '30 minutes', price: 'R250' },
  { id: 'consult-60', label: '1 hour', price: 'R500' },
] as const

export function ConsultBookingPanel() {
  const [selectedPackage, setSelectedPackage] = useState<(typeof options)[number]['id']>('consult-30')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCheckout = async () => {
    if (!name || !email) {
      setError('Please add your full name and email before continuing.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPackage,
          buyerName: name,
          buyerEmail: email,
          successPath: '/consult/book',
          cancelPath: '/consult?payment=cancelled',
        }),
      })

      const result = await res.json()
      if (!res.ok) {
        throw new Error(result.error || 'Could not initiate payment')
      }

      const form = document.createElement('form')
      form.method = 'POST'
      form.action = result.url

      Object.entries(result.data).forEach(([key, value]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = value as string
        form.appendChild(input)
      })

      document.body.appendChild(form)
      form.submit()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to start checkout')
      setLoading(false)
    }
  }

  return (
    <div className="rounded-3xl border border-warm-200 bg-white p-6 lg:p-8 shadow-sm">
      <h3 className="text-2xl font-display font-semibold text-warm-900 mb-3">Choose consultation duration</h3>
      <p className="text-sm text-warm-500 mb-6">Pay securely with PayFast first. Booking unlocks instantly after successful payment confirmation.</p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setSelectedPackage(option.id)}
            className={`rounded-2xl border px-4 py-4 text-left transition ${
              selectedPackage === option.id
                ? 'border-sage-400 bg-sage-50'
                : 'border-warm-200 hover:border-warm-300'
            }`}
          >
            <div className="text-sm text-warm-500">{option.label}</div>
            <div className="text-lg font-display font-semibold text-warm-900">{option.price}</div>
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 mb-4">
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-warm-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sage-200"
        />
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-warm-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sage-200"
        />
      </div>

      {error ? <p className="text-sm text-red-600 mb-3">{error}</p> : null}

      <button
        type="button"
        disabled={loading}
        onClick={handleCheckout}
        className="w-full bg-warm-900 text-white rounded-full px-6 py-3.5 text-sm font-medium hover:bg-warm-800 transition inline-flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
        {loading ? 'Redirecting to PayFast...' : 'Book Consultation'}
        {!loading ? <ArrowRight size={16} /> : null}
      </button>

      <p className="text-xs text-warm-400 mt-4">
        Emergency symptoms? Call 10177 immediately. Online consults are for non-emergency care.
      </p>
    </div>
  )
}
