'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Video, Clock, CreditCard, CheckCircle2, ChevronRight,
  Stethoscope, Heart, Brain, Apple, Shield, Microscope, Zap,
} from 'lucide-react'

const SESSIONS = [
  {
    id: '30min',
    label: '30-Minute Consultation',
    price: 'R250',
    duration: '30 min',
    best: 'Quick follow-ups, single-concern questions, prescription queries',
    highlight: false,
  },
  {
    id: '60min',
    label: '1-Hour Consultation',
    price: 'R500',
    duration: '60 min',
    best: 'Comprehensive assessments, chronic conditions, new patients',
    highlight: true,
  },
] as const

const TOPICS = [
  { icon: Stethoscope, label: 'General Health' },
  { icon: Heart, label: 'Chronic Conditions' },
  { icon: Brain, label: 'Mental Wellness' },
  { icon: Apple, label: 'Nutrition & Diet' },
  { icon: Shield, label: 'Preventive Screening' },
  { icon: Microscope, label: 'Skin & Rashes' },
  { icon: Zap, label: 'Novel Techniques' },
  { icon: Video, label: 'Visual Assessment' },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Choose your session', body: 'Select 30 min or 1 hour depending on your needs.' },
  { step: '02', title: 'Pay securely upfront', body: 'Card payment via Payfast — fully SA-compatible, safe and instant.' },
  { step: '03', title: 'Receive your link', body: 'You\'ll get a Zoom or Microsoft Teams link via email within minutes.' },
  { step: '04', title: 'Join your consultation', body: 'Face-to-face video with your doctor — show any visible symptoms on camera.' },
]

export default function ConsultPage() {
  const [selectedSession, setSelectedSession] = useState<'30min' | '60min'>('60min')

  const session = SESSIONS.find((s) => s.id === selectedSession)!

  // Payfast sandbox/live URL — swap once merchant registered
  const PAYFAST_MERCHANT_ID = process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || 'PENDING'
  const PAYFAST_MERCHANT_KEY = process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_KEY || 'PENDING'
  const isPending = PAYFAST_MERCHANT_ID === 'PENDING'

  const payfastUrl = `https://www.payfast.co.za/eng/process?merchant_id=${PAYFAST_MERCHANT_ID}&merchant_key=${PAYFAST_MERCHANT_KEY}&amount=${selectedSession === '30min' ? '250.00' : '500.00'}&item_name=Aliento+${selectedSession === '30min' ? '30-Minute' : '1-Hour'}+Virtual+Consultation&return_url=${encodeURIComponent('https://alientomd.com/consult/success')}&cancel_url=${encodeURIComponent('https://alientomd.com/consult')}`

  // Cal.com embed username — swap once account is set up
  const CALCOM_USERNAME = process.env.NEXT_PUBLIC_CALCOM_USERNAME || ''
  const calcomUrl = CALCOM_USERNAME
    ? `https://cal.com/${CALCOM_USERNAME}/${selectedSession === '30min' ? '30min' : '60min'}`
    : null

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  }

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative py-24 lg:py-32 overflow-hidden grain">
        <div className="absolute inset-0 bg-gradient-to-br from-warm-50 via-primary-50/30 to-sage-50/20" />
        <div className="absolute top-20 -right-20 w-[500px] h-[500px] organic-blob bg-primary-100/30 animate-breathe-slow" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div variants={fadeUp} initial="hidden" animate="show" className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[2px] bg-primary-500" />
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-warm-400">Virtual Consultation</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-display font-bold text-warm-900 mb-6 leading-[1.1]">
              See a doctor,<br />
              <span className="text-gradient-primary">from anywhere.</span>
            </h1>
            <p className="text-xl text-warm-500 leading-relaxed mb-8 max-w-2xl">
              Face-to-face video consultations with Aliento&apos;s medical professional — via Zoom or Microsoft Teams. 
              Show visible symptoms on camera. Get real answers, fast.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-warm-500">
              {['Zoom & Teams', 'Upfront payment', 'Link within minutes', 'SA-based doctor'].map((t) => (
                <span key={t} className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-sage-500" />
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Session Picker + Booking ──────────────────────── */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* Left: session choice */}
            <div>
              <h2 className="text-2xl font-display font-bold text-warm-900 mb-8">Choose your session</h2>
              <div className="space-y-4 mb-10">
                {SESSIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSession(s.id)}
                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 ${
                      selectedSession === s.id
                        ? 'border-primary-400 bg-primary-50 shadow-md'
                        : 'border-warm-200 bg-white hover:border-warm-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-display font-semibold text-warm-900 text-lg">{s.label}</span>
                          {s.highlight && (
                            <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">Recommended</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-warm-400">
                          <Clock size={13} />
                          {s.duration}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-display font-bold text-warm-900">{s.price}</div>
                        <div className="text-xs text-warm-400">per session</div>
                      </div>
                    </div>
                    <p className="text-sm text-warm-500 mt-3">
                      <span className="text-warm-400 font-medium">Best for: </span>{s.best}
                    </p>
                  </button>
                ))}
              </div>

              {/* What you can discuss */}
              <h3 className="font-display font-semibold text-warm-900 mb-4">What you can consult about</h3>
              <div className="grid grid-cols-2 gap-3">
                {TOPICS.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-warm-50 border border-warm-100">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                      <Icon size={15} className="text-primary-500" />
                    </div>
                    <span className="text-sm text-warm-700 font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: booking + payment */}
            <div className="lg:sticky lg:top-8">
              <div className="bg-warm-50 rounded-3xl border border-warm-200 p-8">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-warm-200">
                  <div>
                    <div className="text-sm text-warm-500 mb-1">Selected</div>
                    <div className="font-display font-semibold text-warm-900">{session.label}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-display font-bold text-warm-900">{session.price}</div>
                    <div className="text-xs text-warm-400">{session.duration}</div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-sm text-warm-600">
                    <Video size={16} className="text-primary-500 flex-shrink-0" />
                    Face-to-face video via Zoom or Microsoft Teams
                  </div>
                  <div className="flex items-center gap-3 text-sm text-warm-600">
                    <CreditCard size={16} className="text-primary-500 flex-shrink-0" />
                    Secure upfront payment via Payfast
                  </div>
                  <div className="flex items-center gap-3 text-sm text-warm-600">
                    <Clock size={16} className="text-primary-500 flex-shrink-0" />
                    Booking link sent within minutes of payment
                  </div>
                </div>

                {/* Step 1: Book slot */}
                {calcomUrl ? (
                  <a
                    href={calcomUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-warm-900 text-white py-4 rounded-2xl font-medium hover:bg-warm-800 transition-all mb-3"
                  >
                    <Video size={18} />
                    Book your time slot
                    <ChevronRight size={16} />
                  </a>
                ) : (
                  <div className="w-full bg-warm-200 text-warm-500 py-4 rounded-2xl font-medium text-center mb-3 cursor-not-allowed text-sm">
                    📅 Booking calendar — coming soon
                  </div>
                )}

                {/* Step 2: Pay */}
                {!isPending ? (
                  <a
                    href={payfastUrl}
                    className="w-full flex items-center justify-center gap-2 border-2 border-primary-400 text-primary-700 py-4 rounded-2xl font-medium hover:bg-primary-50 transition-all"
                  >
                    <CreditCard size={18} />
                    Pay {session.price} securely
                    <ChevronRight size={16} />
                  </a>
                ) : (
                  <div className="w-full border-2 border-warm-200 text-warm-400 py-4 rounded-2xl font-medium text-center cursor-not-allowed text-sm">
                    💳 Payfast payment — coming soon
                  </div>
                )}

                <p className="text-xs text-warm-400 text-center mt-5">
                  Payment required to confirm booking. Full refund if cancelled 24h before.
                </p>
              </div>

              {/* Note about platforms */}
              <div className="mt-4 p-4 bg-primary-50 border border-primary-100 rounded-2xl text-sm text-primary-700">
                💡 Let us know your preferred platform (Zoom or Teams) in the booking notes.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-warm-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-primary-500" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-warm-400">The Process</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-warm-900 mb-12">How it works</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-warm-200/60"
              >
                <div className="text-4xl font-display font-bold text-primary-100 mb-4">{step.step}</div>
                <h3 className="font-display font-semibold text-warm-900 mb-2">{step.title}</h3>
                <p className="text-sm text-warm-500 leading-relaxed">{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <h2 className="text-3xl font-display font-bold text-warm-900 mb-10">Common questions</h2>
          <div className="space-y-6">
            {[
              { q: 'Can I show physical symptoms on camera?', a: 'Yes — that\'s one of the key advantages of our video consultations. Show rashes, lumps, swelling, skin changes, and more directly on camera. Make sure you have good lighting.' },
              { q: 'Is this suitable for emergency situations?', a: 'Virtual consultations are for non-emergency health concerns. If you are experiencing chest pain, difficulty breathing, or any life-threatening emergency, call 10177 immediately or go to your nearest hospital.' },
              { q: 'What if I need a prescription or referral?', a: 'We can issue digital prescriptions and referral letters for appropriate conditions following a consultation.' },
              { q: 'Can I book on behalf of a family member?', a: 'Yes. Please note the patient\'s name and age in the booking notes, and ensure they are present for the consultation.' },
              { q: 'What\'s your cancellation policy?', a: 'Full refund for cancellations made at least 24 hours before the appointment. Within 24 hours, a 50% cancellation fee applies.' },
            ].map((faq) => (
              <details key={faq.q} className="group border border-warm-200 rounded-2xl p-6">
                <summary className="font-display font-semibold text-warm-900 cursor-pointer flex justify-between items-center gap-4">
                  {faq.q}
                  <ChevronRight size={18} className="text-warm-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <p className="mt-4 text-warm-500 leading-relaxed text-sm">{faq.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-warm-500 mb-4">Still have questions?</p>
            <Link href="/contact" className="inline-flex items-center gap-2 text-primary-600 font-medium hover:underline">
              Get in touch <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}


