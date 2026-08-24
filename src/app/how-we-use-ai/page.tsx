import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles, ShieldCheck, UserCheck, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'How We Use AI',
  description:
    'How Aliento uses AI to assist Dr Adonis in preparing your documents — and the choices you have.',
}

export default function HowWeUseAiPage() {
  return (
    <div className="bg-cream-100 min-h-screen py-16 lg:py-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-px bg-warm-300" />
            <span className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-warm-500">
              Transparency
            </span>
          </div>
          <h1 className="text-4xl font-display font-semibold text-warm-900 mb-4">
            How Aliento uses AI
          </h1>
          <p className="text-lg text-warm-500 leading-relaxed">
            We believe you deserve to know exactly how technology is used in
            your care — so here it is, in plain language.
          </p>
        </div>

        <div className="space-y-6">

          {/* What AI does */}
          <section className="bg-white border border-warm-200 rounded-2xl p-6 lg:p-8 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-display font-semibold text-warm-900 mb-3">
              <Sparkles size={18} className="text-sage-500" /> What AI does here
            </h2>
            <p className="text-warm-600 leading-relaxed text-sm">
              When you complete a questionnaire, AI helps Dr Adonis by preparing
              a first draft of your documents — such as sick notes,
              prescriptions or our blog articles — based on what you tell us.
              Think of it as a helpful assistant that saves time on typing, so
              your doctor can focus on you.
            </p>
          </section>

          {/* A doctor always decides */}
          <section className="bg-white border border-warm-200 rounded-2xl p-6 lg:p-8 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-display font-semibold text-warm-900 mb-3">
              <UserCheck size={18} className="text-sage-500" /> A doctor always decides
            </h2>
            <p className="text-warm-600 leading-relaxed text-sm">
              AI never decides anything about your care, never signs anything,
              and never sends anything. Every document is reviewed, edited and
              approved by Dr Adonis, who takes full professional responsibility
              for it — exactly as if it were written entirely by hand.
            </p>
          </section>

          {/* Privacy */}
          <section className="bg-white border border-warm-200 rounded-2xl p-6 lg:p-8 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-display font-semibold text-warm-900 mb-3">
              <ShieldCheck size={18} className="text-sage-500" /> Your privacy
            </h2>
            <ul className="text-warm-600 leading-relaxed text-sm space-y-2 list-disc list-inside">
              <li>
                Your name, ID number and contact details are removed before AI
                sees anything.
              </li>
              <li>
                AI tools may process information outside South Africa — always
                without those personal details attached.
              </li>
              <li>
                We keep a record of when AI was used as part of your file, so
                there is always a clear trail.
              </li>
            </ul>
          </section>

          {/* Your choice */}
          <section className="bg-white border border-warm-200 rounded-2xl p-6 lg:p-8 shadow-sm">
            <h2 className="text-xl font-display font-semibold text-warm-900 mb-3">
              It&apos;s your choice
            </h2>
            <p className="text-warm-600 leading-relaxed text-sm mb-3">
              Each time you complete a questionnaire, we ask whether you&apos;re
              comfortable with AI helping prepare your documents. You can opt
              out at any time.
            </p>
            <p className="text-warm-600 leading-relaxed text-sm">
              Opting out changes nothing else: the only difference is that Dr
              Adonis writes everything from scratch herself. Your service,
              pricing and care stay exactly the same.
            </p>
          </section>

          {/* Questions */}
          <section className="rounded-2xl bg-sage-50 border border-sage-200 p-6 lg:p-8">
            <h2 className="flex items-center gap-2 text-xl font-display font-semibold text-warm-900 mb-3">
              <Mail size={18} className="text-sage-600" /> Questions?
            </h2>
            <p className="text-warm-600 leading-relaxed text-sm">
              We&apos;re happy to talk it through. Email us at{' '}
              <a
                href="mailto:info@alientomd.com"
                className="text-sage-700 underline underline-offset-2 hover:text-sage-800 font-medium"
              >
                info@alientomd.com
              </a>{' '}
              and we&apos;ll get back to you within 24 hours.
            </p>
          </section>

        </div>

        <p className="text-center mt-10">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 rounded-full border border-warm-300 text-sm text-warm-700 hover:bg-warm-50 transition-all"
          >
            Back to Home
          </Link>
        </p>

      </div>
    </div>
  )
}
