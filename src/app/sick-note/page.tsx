import { Metadata } from 'next'
import Link from 'next/link'
import { FileText, ArrowRight, ClipboardList, Clock, CreditCard, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sick Note — Aliento Health',
  description:
    'Request a sick leave assessment online. R250 — doctor evaluates and provides a recommendation within 24 hours.',
}

const steps = [
  {
    step: '01',
    title: 'Tell us about your illness',
    body: 'Complete a brief assessment form with your sick leave details and symptoms.',
  },
  {
    step: '02',
    title: 'Secure payment',
    body: 'Pay R250 via Payfast. Your transaction is encrypted and safe.',
  },
  {
    step: '03',
    title: 'Receive your certificate',
    body: 'Your sick note is reviewed and emailed to you as a secure PDF.',
  },
]

const included = [
  { icon: ClipboardList, label: 'Medical assessment', detail: 'Qualified GP reviews your symptoms' },
  { icon: Clock, label: 'Quick turnaround', detail: 'Certificate issued within hours' },
  { icon: CreditCard, label: 'Transparent pricing', detail: 'R250 flat fee, no hidden costs' },
  { icon: CheckCircle2, label: 'Digital delivery', detail: 'PDF certificate sent to your inbox' },
]

export default function SickNotePage() {
  return (
    <div className="bg-cream-100">
      {/* ── Hero ── */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-cream-200/50 to-cream-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] organic-blob bg-cream-200/50 animate-breathe-slow pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-warm-300" />
              <span className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-warm-500">Sick leave</span>
              <div className="w-8 h-px bg-warm-300" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-display font-semibold text-warm-900 mb-6 leading-tight">
              Sick Leave Assessment, <span className="italic text-warm-600">from home.</span>
            </h1>
            <p className="text-lg text-warm-500 max-w-2xl leading-relaxed mb-6">
              Not feeling well? Request a medical sick leave certificate online. A qualified
              doctor will assess your symptoms and issue your sick note — no clinic visit needed.
            </p>
            <ul className="text-sm text-warm-600 space-y-2 mb-8">
              <li>• R250 — flat fee</li>
              <li>• Doctor-assessed certificate</li>
              <li>• Email delivery within hours</li>
            </ul>

            {/* CTA */}
            <Link
              href="/sick-note/questionnaire"
              className="inline-flex items-center gap-2 bg-sage-500 text-white px-8 py-4 rounded-full font-semibold text-sm hover:bg-sage-600 transition-all hover:-translate-y-0.5 shadow-sm"
            >
              Start Your Assessment <ArrowRight size={16} />
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
                <div className="w-14 h-14 rounded-full bg-cream-200 flex items-center justify-center text-warm-600 font-display font-semibold text-lg mx-auto mb-5">{step}</div>
                <h3 className="font-display text-lg font-semibold text-warm-900 mb-3">{title}</h3>
                <p className="text-warm-500 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What&apos;s included ── */}
      <section className="py-20 bg-cream-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="text-2xl lg:text-3xl font-display font-semibold text-warm-900 mb-10 text-center">What&apos;s included</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {included.map(({ icon: Icon, label, detail }) => (
              <div key={label} className="bg-white/80 rounded-2xl p-7 border border-warm-200/40 text-center">
                <div className="w-12 h-12 rounded-xl bg-cream-100 flex items-center justify-center mx-auto mb-4">
                  <Icon size={20} className="text-warm-500" />
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
            Sick leave certificates are issued after a medical assessment and are subject to
            the doctor&apos;s clinical judgement. For medical emergencies, call 10177 (EMS)
            or go to your nearest emergency room.
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
