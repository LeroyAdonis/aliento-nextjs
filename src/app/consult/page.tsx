import { Metadata } from 'next'
import Link from 'next/link'
import { Video, Clock, CreditCard, Monitor, ArrowRight } from 'lucide-react'
import { ConsultBookingPanel } from '@/components/consult/ConsultBookingPanel'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aliento.africa'

export const metadata: Metadata = {
  title: 'Book a Virtual Consultation',
  description:
    'Book a virtual face-to-face medical consultation via Zoom or Microsoft Teams. R500/hr, 30 min or 1-hour sessions, with visual assessment.',
  alternates: { canonical: `${SITE_URL}/consult` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/consult`,
    title: 'Book a Virtual Consultation | Aliento Medical',
    description: 'Book a virtual face-to-face medical consultation via Zoom or Microsoft Teams.',
    siteName: 'Aliento Medical',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book a Virtual Consultation | Aliento Medical',
    description: 'Book a virtual face-to-face medical consultation via Zoom or Microsoft Teams.',
  },
}

const steps = [
  {
    step: '01',
    title: 'Choose a session',
    body: 'Pick a 30-minute or 1-hour consultation and complete secure PayFast checkout.',
  },
  {
    step: '02',
    title: 'Unlock booking',
    body: 'After payment confirmation, your Cal.com scheduler unlocks instantly.',
  },
  {
    step: '03',
    title: 'Join your consult',
    body: 'Receive a Zoom or Teams link (Cal Video fallback) and join from any device.',
  },
]

const included = [
  { icon: Video, label: 'Face-to-face via video', detail: 'Zoom primary, Teams secondary' },
  { icon: Monitor, label: 'Visual assessment', detail: 'Show rashes, lumps, or swelling on camera' },
  { icon: Clock, label: 'Flexible sessions', detail: '30-minute or 1-hour slots' },
  { icon: CreditCard, label: 'Transparent pricing', detail: 'R500 per hour, paid upfront' },
]

export default function ConsultPage() {
  return (
    <div className="bg-cream-100">
      <section className="py-16 lg:py-24 bg-gradient-to-b from-blush-50/60 to-cream-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] organic-blob bg-blush-100/40 animate-breathe-slow pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-blush-400" />
              <span className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-blush-500">Virtual consultations</span>
              <div className="w-8 h-px bg-blush-400" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-display font-semibold text-warm-900 mb-6 leading-tight">
              Expert medical care, <span className="italic text-blush-700">from the comfort of home.</span>
            </h1>
            <p className="text-lg text-warm-500 max-w-2xl leading-relaxed mb-6">
              Book a face-to-face virtual consultation with a qualified South African doctor. Payment is required first,
              then your booking calendar unlocks securely.
            </p>
            <ul className="text-sm text-warm-600 space-y-2 mb-8">
              <li>• 30 min consult — R250</li>
              <li>• 1 hour consult — R500</li>
              <li>• No referral needed</li>
            </ul>
          </div>

          <ConsultBookingPanel />
        </div>
      </section>

      <section className="py-20 bg-cream-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="text-2xl lg:text-3xl font-display font-semibold text-warm-900 mb-12 text-center">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ step, title, body }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-blush-100 flex items-center justify-center text-blush-600 font-display font-semibold text-lg mx-auto mb-5">{step}</div>
                <h3 className="font-display text-lg font-semibold text-warm-900 mb-3">{title}</h3>
                <p className="text-warm-500 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blush-50/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="text-2xl lg:text-3xl font-display font-semibold text-warm-900 mb-10 text-center">What&apos;s included</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {included.map(({ icon: Icon, label, detail }) => (
              <div key={label} className="bg-white/80 rounded-2xl p-7 border border-blush-200/40 text-center">
                <div className="w-12 h-12 rounded-xl bg-blush-100 flex items-center justify-center mx-auto mb-4">
                  <Icon size={20} className="text-blush-600" />
                </div>
                <h3 className="font-body font-semibold text-warm-900 text-sm mb-1">{label}</h3>
                <p className="text-warm-400 text-xs leading-relaxed">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-warm-100/40 border-t border-warm-200/50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs text-warm-400 leading-relaxed">
            Virtual consultations are for non-emergency medical guidance only. For medical emergencies, call 10177 (EMS)
            or go to your nearest emergency room. Cancellation policy: no refunds for missed sessions.
          </p>
        </div>
      </section>

      <section className="py-16 bg-cream-100 text-center">
        <p className="text-warm-500 mb-4 text-sm">Prefer to browse first?</p>
        <Link href="/health-topics" className="group inline-flex items-center gap-2 text-sage-600 font-body font-medium text-sm hover:text-sage-700 transition-colors">
          Explore our health articles <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </section>
    </div>
  )
}
