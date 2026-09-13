'use client'

import { useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, Mail, AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/admin/scripts'
  const emailRef = useRef<HTMLInputElement>(null)
  const secretRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // Read the values from the DOM instead of React state. Password managers and
    // browser autofill fill these fields WITHOUT firing change events, so a
    // state-driven `disabled` guard used to leave the button permanently dead
    // ("nothing happens when I click Sign In"). The DOM value is always correct.
    const email = (emailRef.current?.value || '').trim()
    const secret = secretRef.current?.value || ''

    if (!email || !secret) {
      setError('Please enter both your email and the admin passcode.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, email }),
      })

      if (res.ok) {
        router.push(redirectTo)
      } else {
        const data = await res.json().catch(() => ({ error: 'Login failed' }))
        setError(data.error || 'Invalid credentials. Please try again.')
      }
    } catch {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl border border-warm-200 shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-4">
            <Lock size={22} className="text-sage-600" />
          </div>
          <h1 className="font-display font-bold text-warm-900 text-xl">Aliento Admin</h1>
          <p className="text-sm text-warm-400 mt-1">Sign in to manage consultations</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-warm-600 mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
              <input
                id="admin-email"
                ref={emailRef}
                name="email"
                type="email"
                autoComplete="username"
                placeholder="you@email.com"
                required
                className="w-full bg-cream-50 border border-warm-200 rounded-xl pl-10 pr-4 py-3 text-warm-700 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-passcode" className="block text-sm font-medium text-warm-600 mb-1.5">Passcode</label>
            <input
              id="admin-passcode"
              ref={secretRef}
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter admin passcode..."
              required
              className="w-full bg-cream-50 border border-warm-200 rounded-xl px-4 py-3 text-warm-700 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-400 transition-all"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-warm-900 hover:bg-warm-800 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
