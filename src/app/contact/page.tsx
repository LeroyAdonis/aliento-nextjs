/* eslint-disable react/no-unescaped-entities */
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, ArrowRight, CalendarDays } from 'lucide-react'
import Link from 'next/link'
import { useLocalStorageState } from '@/lib/form-persistence'

type ContactFormState = { name: string; email: string; phone: string; message: string }

export default function ContactPage() {
  const [formState, setFormState, clearFormState] = useLocalStorageState<ContactFormState>(
    'contact-v1',
    { name: '', email: '', phone: '', message: '' },
  )
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string }
        throw new Error(body.error ?? 'Could not send message. Please try again.')
      }
      clearFormState()
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Could not send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <section className="relative py-24 lg:py-32 overflow-hidden grain">
        <div className="absolute inset-0 bg-gradient-to-br from-warm-50 via-primary-50/20 to-warm-50" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] organic-blob bg-primary-100/30 animate-breathe-slow" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[2px] bg-primary-500" />
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-warm-400">Get in Touch</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-display font-bold text-warm-900 mb-6 leading-[1.1]">
              Let&apos;s start your<br />
              <span className="text-gradient-primary">health journey.</span>
            </h1>

            <p className="text-xl text-warm-500 leading-relaxed max-w-2xl mb-6">
              Booking now happens on the dedicated consult page. Choose your slot, pay securely, then schedule instantly.
            </p>

            <Link href="/consult" className="inline-flex items-center gap-2 bg-warm-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-warm-800 transition">
              <CalendarDays size={16} />
              Go to Consult Booking
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
              <div>
                <h2 className="text-2xl font-display font-bold text-warm-900 mb-4">Send Us a Message</h2>
                <p className="text-warm-500 mb-8">Have a question? We&apos;ll get back to you within 24 hours.</p>

                {submitted ? (
                  <div className="bg-sage-50 border border-sage-200 rounded-3xl p-8 text-center">
                    <h3 className="text-2xl font-display font-bold text-warm-900 mb-2">Message sent!</h3>
                    <p className="text-warm-500">We&apos;ll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <input type="text" required value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-warm-200" placeholder="Your name" />
                      <input type="email" required value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-warm-200" placeholder="you@email.com" />
                    </div>
                    <input type="tel" value={formState.phone} onChange={(e) => setFormState({ ...formState, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-warm-200" placeholder="+27 xxx xxx xxx" />
                    <textarea required rows={5} value={formState.message} onChange={(e) => setFormState({ ...formState, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-warm-200 resize-none" placeholder="How can we help you?" />
                    {submitError ? (
                      <p className="text-sm text-red-600">{submitError}</p>
                    ) : null}
                    <button type="submit" disabled={submitting} className="w-full sm:w-auto bg-warm-900 text-white px-8 py-4 rounded-full font-medium hover:bg-warm-800 transition-all flex items-center justify-center gap-2 group disabled:opacity-50">
                      {submitting ? 'Sending...' : 'Send Message'}
                      {!submitting && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <a href="tel:+27762367921" className="flex items-start gap-4 group">
                <Phone size={20} className="text-primary-600" />
                <div><p className="font-medium text-warm-900">Phone</p><p className="text-warm-500">+27 76 236 7921</p></div>
              </a>
              <a href="mailto:info@alientomd.com" className="flex items-start gap-4 group">
                <Mail size={20} className="text-sage-600" />
                <div><p className="font-medium text-warm-900">Email</p><p className="text-warm-500">info@alientomd.com</p></div>
              </a>
              <div className="flex items-start gap-4"><MapPin size={20} className="text-coral-600" /><div><p className="font-medium text-warm-900">Location</p><p className="text-warm-500">Virtual consultations — South Africa wide</p></div></div>
              <div className="flex items-start gap-4"><Clock size={20} className="text-warm-600" /><div><p className="font-medium text-warm-900">Hours</p><p className="text-warm-500">Monday - Friday: 8AM - 5PM</p></div></div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
