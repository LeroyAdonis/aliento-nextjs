import { Metadata } from 'next'
import Link from 'next/link'
import { Video, Clock, CreditCard, Monitor, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Book a Virtual Consultation',
  description:
    'Book a virtual face-to-face medical consultation via Zoom or Microsoft Teams. R500/hr, 30 min or 1-hour sessions, with visual assessment.',
}

const steps = [
  {
    step: '01',
    title: 'Choose a time',
    body: 'Select your preferred session length and date. 30-minute or 1-hour slots available.',
  },
  {
    step: '02',
    title: 'Pay securely upfront',
    body: 'Payment is captured at time of booking via secure credit card processing. R500/hr.',
  },
  {
    step: '03',
    title: 'Join your consult',
    body: 'Receive a Zoom or Teams link. Join from any device — phone, tablet, or laptop.',
  },
]

const included = [
  { icon: Video,      label: 'Face-to-face via video',  detail: 'Zoom or Microsoft Teams' },
  { icon: Monitor,    label: 'Visual assessment',        detail: 'Show rashes, lumps, or swelling on camera' },
  { icon: Clock,      label: 'Flexible sessions',        detail: '30-minute or 1-hour slots' },
  { icon: CreditCard, label: 'Transparent pricing',      detail: 'R500 per hour, paid at booking' },
]

export default function ConsultPage() {
  return (
    <div className="bg-cream-100">

      {/* Hero */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-blush-50/60 to-cream-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] organic-blob bg-blush-100/40 animate-breathe-slow pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-px bg-blush-400" />
            <span className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-blush-500">
              Virtual consultations
            </span>
            <div className="w-8 h-px bg-blush-400" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-semibold text-warm-900 mb-6 leading-tight">
            Expert medical care,
            <br />
            <span className="italic text-blush-700">from the comfort of home.</span>
          </h1>
          <p className="text-xl text-warm-500 max-w-2xl mx-auto leading-relaxed mb-8">
            Book a face-to-face virtual consultation with a qualified South African doctor via
            Zoom or Microsoft Teams. Visual assessment included — show rashes, lumps, swelling,
            and more. No referral needed.
          </p>

          {/* Booking CTA placeholder */}
          <div className="inline-block">
            <button
              disabled
              className="bg-blush-600/80 text-white px-8 py-4 rounded-full font-body font-medium text-base cursor-not-allowed opacity-70 shadow-sm"
              title="Online booking coming soon"
            >
              Book a Consult — Coming Soon
            </button>
            <p className="text-xs text-warm-400 mt-3">
              Online booking launching soon. In the meantime, email us to arrange a session.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-cream-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="text-2xl lg:text-3xl font-display font-semibold text-warm-900 mb-12 text-center">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ step, title, body }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-blush-100 flex items-center justify-center text-blush-600 font-display font-semibold text-lg mx-auto mb-5">
                  {step}
                </div>
                <h3 className="font-display text-lg font-semibold text-warm-900 mb-3">{title}</h3>
                <p className="text-warm-500 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-20 bg-blush-50/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="text-2xl lg:text-3xl font-display font-semibold text-warm-900 mb-10 text-center">
            What&apos;s included
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {included.map(({ icon: Icon, label, detail }) => (
              <div
                key={label}
                className="bg-white/80 rounded-2xl p-7 border border-blush-200/40 text-center"
              >
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

      {/* Pricing */}
      <section className="py-20 bg-cream-100">
        <div className="max-w-md mx-auto px-6 text-center">
          <h2 className="text-2xl font-display font-semibold text-warm-900 mb-8">Simple pricing</h2>
          <div className="rounded-2xl bg-white border border-warm-200/60 shadow-sm p-8">
            <div className="text-5xl font-display font-semibold text-warm-900 mb-2">R500</div>
            <div className="text-warm-400 text-sm mb-6">per hour · R250 for 30 minutes</div>
            <ul className="text-sm text-warm-600 space-y-3 text-left mb-8">
              {[
                'Visual assessment via video',
                'Zoom or Microsoft Teams',
                'Medical advice & guidance',
                'Referral letters if needed',
                'Prescription guidance',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-sage-500">✓</span> {item}
                </li>
              ))}
            </ul>
            <button
              disabled
              className="w-full bg-blush-600/80 text-white py-3.5 rounded-full font-body font-medium text-sm cursor-not-allowed opacity-70"
            >
              Book Now — Coming Soon
            </button>
            <p className="text-xs text-warm-400 mt-4">
              Payment required at time of booking. No refunds for missed sessions.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 bg-warm-100/40 border-t border-warm-200/50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs text-warm-400 leading-relaxed">
            Virtual consultations are for non-emergency medical guidance only.
            For medical emergencies, call 10177 (EMS) or go to your nearest emergency room.
            Aliento consultations do not replace your regular GP relationship.
          </p>
        </div>
      </section>

      {/* Secondary CTA */}
      <section className="py-16 bg-cream-100 text-center">
        <p className="text-warm-500 mb-4 text-sm">Prefer to browse first?</p>
        <Link
          href="/health-topics"
          className="group inline-flex items-center gap-2 text-sage-600 font-body font-medium text-sm hover:text-sage-700 transition-colors"
        >
          Explore our health articles <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </section>

    </div>
  )
}
