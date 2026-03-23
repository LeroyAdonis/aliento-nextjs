import { Metadata } from 'next'
import Link from 'next/link'
import { Microscope, Shield, Activity, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Health Screening Tools',
  description: 'Self-screening and digital health assessment tools — coming soon from Aliento Health.',
}

/**
 * PHASE 2 — Screening Tools
 * Scaffold is ready. Plug in self-screening tool components here when ready.
 * See ALIENTO_IMPLEMENTATION_PLAN.md → Phase 2 for details.
 */

const PLANNED_TOOLS = [
  { icon: Shield, title: 'Cardiovascular Risk', desc: 'Assess your 10-year heart disease risk in under 5 minutes.', status: 'Coming soon' },
  { icon: Activity, title: 'Diabetes Risk Screen', desc: 'Answer a few questions to understand your Type 2 diabetes risk.', status: 'Coming soon' },
  { icon: Microscope, title: 'Skin Check Guide', desc: 'Step-by-step guide to self-examining moles and skin changes.', status: 'Coming soon' },
  { icon: Clock, title: 'Mental Wellness Check', desc: 'PHQ-9 and GAD-7 based mood & anxiety self-assessment.', status: 'Coming soon' },
]

export default function ScreeningPage() {
  return (
    <>
      <section className="relative py-24 lg:py-32 overflow-hidden grain">
        <div className="absolute inset-0 bg-gradient-to-br from-warm-50 via-primary-50/20 to-warm-50" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[2px] bg-primary-500" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-warm-400">Health Screening</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-display font-bold text-warm-900 mb-6 leading-[1.1]">
            Know your risk.<br />
            <span className="text-gradient-primary">Act before symptoms.</span>
          </h1>
          <p className="text-xl text-warm-500 max-w-2xl leading-relaxed">
            Digital self-screening tools designed with SA-specific risk profiles in mind. 
            Free, private, and evidence-based.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLANNED_TOOLS.map(({ icon: Icon, title, desc, status }) => (
              <div key={title} className="bg-warm-50 rounded-2xl border border-warm-200 p-6 opacity-80">
                <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center mb-4">
                  <Icon size={22} className="text-primary-600" />
                </div>
                <h3 className="font-display font-semibold text-warm-900 mb-2">{title}</h3>
                <p className="text-sm text-warm-500 mb-4">{desc}</p>
                <span className="inline-block px-3 py-1 bg-warm-200 text-warm-500 rounded-full text-xs font-medium">{status}</span>
              </div>
            ))}
          </div>

          <div className="mt-16 max-w-2xl mx-auto text-center">
            <div className="bg-primary-50 border border-primary-100 rounded-3xl p-8">
              <h2 className="text-2xl font-display font-bold text-warm-900 mb-3">
                Can&apos;t wait? Book a consultation instead.
              </h2>
              <p className="text-warm-500 mb-6">
                Our virtual consultations include thorough health assessments tailored to your risks.
              </p>
              <Link
                href="/consult"
                className="inline-flex items-center gap-2 bg-warm-900 text-white px-6 py-3 rounded-full font-medium hover:bg-warm-800 transition-all"
              >
                Book a Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

