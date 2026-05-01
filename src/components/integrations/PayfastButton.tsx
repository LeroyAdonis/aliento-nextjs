'use client'

import { useState } from 'react'
import { ArrowRight, CreditCard, Clock, Loader2 } from 'lucide-react'

const packages = [
  {
    id: 'consult-30',
    name: '30-Minute Consultation',
    price: 'R250',
    duration: '30 min',
    description: 'Focused virtual consultation via Zoom or Teams',
  },
  {
    id: 'consult-60',
    name: '1-Hour Consultation',
    price: 'R500',
    duration: '1 hour',
    description: 'Extended virtual consultation for complex assessments',
    popular: true,
  },
]

export function PayfastButton() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePayment = async () => {
    if (!selectedPackage || !formData.name || !formData.email) {
      setError('Please fill in all fields and select a package')
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
          buyerName: formData.name,
          buyerEmail: formData.email,
          successPath: '/consult/book',
          cancelPath: '/consult?payment=cancelled',
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        setError(result.error || 'Payment initiation failed')
        setLoading(false)
        return
      }

      // Create and submit a hidden form to Payfast
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
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Package Selection */}
      <div className="grid sm:grid-cols-2 gap-4">
        {packages.map((pkg) => (
          <button
            key={pkg.id}
            onClick={() => setSelectedPackage(pkg.id)}
            className={`relative text-left p-6 rounded-2xl border-2 transition-all duration-300 ${
              selectedPackage === pkg.id
                ? 'border-primary-400 bg-primary-50/50 shadow-md'
                : 'border-warm-200 bg-white hover:border-warm-300 hover:shadow-sm'
            }`}
          >
            {pkg.popular && (
              <span className="absolute -top-3 right-4 px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                Popular
              </span>
            )}
            <div className="flex items-center gap-2 text-warm-400 text-sm mb-2">
              <Clock size={14} />
              {pkg.duration}
            </div>
            <h4 className="font-display font-semibold text-warm-900 text-lg mb-1">{pkg.name}</h4>
            <p className="text-warm-500 text-sm mb-3">{pkg.description}</p>
            <span className="text-2xl font-display font-bold text-primary-600">{pkg.price}</span>
          </button>
        ))}
      </div>

      {/* Contact Details */}
      {selectedPackage && (
        <div className="space-y-4 animate-reveal">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-2">Your Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-warm-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-warm-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all"
                placeholder="you@email.com"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full sm:w-auto bg-warm-900 text-white px-8 py-4 rounded-full font-medium hover:bg-warm-800 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard size={18} />
                Pay & Book Consultation
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          <p className="text-warm-400 text-xs">
            Secure payment processed by Payfast. You will receive a booking confirmation via email.
          </p>
        </div>
      )}
    </div>
  )
}
