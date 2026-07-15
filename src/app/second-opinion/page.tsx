import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Stethoscope, Clock, CreditCard, MessageSquare } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Second Opinion — Aliento Health',
  description:
    'Get an independent second opinion on your diagnosis. R250 — doctor reviews your case.',
}

const steps = [
  {
    step: '01',
    title: 'Share your diagnosis',
    body: 'Tell us about your current diagnosis and why you would like a second opinion.',
  },
  {
    step: '02',
    title: 'Secure payment',
    body: 'Pay R250 via Payfast. Your transaction is encrypted and safe.',
  },
  {
    step: '03',
    title: 'Receive your review',
    body: 'A qualified GP reviews your case and provides their professional opinion via email.',
  },
]

const included = [
  { icon: Stethoscope, label: 'Expert review', detail: 'Case reviewed by a qualified GP' },
  { icon: MessageSquare, label: 'Detailed opinion', detail: 'Written second opinion with rationale' },
  { icon: Clock, label: 'Prompt turnaround', detail: 'Review completed within 48 hours' },
  { icon: CreditCard, label: 'Transparent pricing', detail: 'R250 flat fee, no hidden costs' },
]

export default function SecondOpinionPage() {
  return (
    <div className="bg-cream-100">
      {/* ── Hero ── */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-sage-50/60 to-cream-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] organic-blob bg-sage-100/40 animate-breathe-slow pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-sage-400" />
              <span className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-sage-500">Second opinion</span>
              <div className="w-8 h-px bg-sage-400" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-display font-semibold text-warm-900 mb-6 leading-tight">
              Second Medical Opinion, <span className="italic text-sage-700">with confidence.</span>
            </h1>
            <p className="text-lg text-warm-500 max-w-2xl leading-relaxed mb-6">
              Facing a medical decision and want a second opinion? Submit your diagnosis details
              and a qualified GP will provide an independent, professional review of your case.
            </p>
            <ul className="text-sm text-warm-600 space-y-2 mb-8">
              <li>• R250 — flat fee</li>
              <li>• Independent doctor review</li>
              <li>• Written opinion within 48 hours</li>
            </ul>

            {/* CTA */}
            <Link
              href="/second-opinion/questionnaire"
              className="inline-flex items-center gap-2 bg-sage-500 text-white px-8 py-4 rounded-full font-semibold text-sm hover:bg-sage-600 transition-all hover:-translate-y-0.5 shadow-sm"
            >
              Request Your Review <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 bg-cream-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="text-2xl lg:text-3xl font-display font-semibold text-warm-900 mb-12 text-center">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ step, title, body }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-sage-50 flex items-center justify-center text-sage-600 font-display font-semibold text-lg mx-auto mb-5">{step}</div>
                <h3 className="font-display text-lg font-semibold text-warm-900 mb-3">{title}</h3>
                <p className="text-warm-500 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What&apos;s included ── */}
      <section className="py-20 bg-sage-50/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="text-2xl lg:text-3xl font-display font-semibold text-warm-900 mb-10 text-center">What&apos;s included</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {included.map(({ icon: Icon, label, detail }) => (
              <div key={label} className="bg-white/80 rounded-2xl p-7 border border-sage-200/40 text-center">
                <div className="w-12 h-12 rounded-xl bg-sage-50 flex items-center justify-center mx-auto mb-4">
                  <Icon size={20} className="text-sage-600" />
                </div>
                <h3 className="font-body font-semibold text-warm-900 text-sm mb-1">{label}</h3>
                <p className="text-warm-400 text-xs leading-relaxed">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <section className="py-12 bg-warm-100/40 border-t border-warm-200/50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs text-warm-400 leading-relaxed">
            A second opinion provides an additional professional perspective and should not replace
            your primary care. For medical emergencies, call 10177 (EMS) or go to your nearest
            emergency room.
          </p>
        </div>
      </section>

      {/* ── Browse more ── */}
      <section className="py-16 bg-cream-100 text-center">
        <p className="text-warm-500 mb-4 text-sm">Not what you&apos;re looking for?</p>
        <Link href="/health-topics" className="group inline-flex items-center gap-2 text-sage-600 font-body font-medium text-sm hover:text-sage-700 transition-colors">
          Explore our health articles <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </section>
    </div>
  )
}
