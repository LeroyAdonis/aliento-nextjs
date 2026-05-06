import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Shield, Clock } from 'lucide-react'
import { QuestionnaireWizard } from './QuestionnaireWizard'

export const metadata: Metadata = {
  title: 'Health Questionnaire',
  description:
    'Complete your pre-consultation health questionnaire. Your information is protected by doctor-patient confidentiality.',
}

interface Props {
  searchParams: Promise<{ bookingUid?: string }>
}

export default async function QuestionnairePage({ searchParams }: Props) {
  const { bookingUid } = await searchParams

  return (
    <div className="bg-cream-100 min-h-screen">

      {/* Header */}
      <section className="relative py-14 lg:py-18 overflow-hidden grain">
        <div className="absolute inset-0 bg-gradient-to-b from-sage-50/60 to-cream-100" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-12">
          <Link
            href="/consult"
            className="inline-flex items-center gap-2 text-warm-500 hover:text-warm-900 mb-8 transition-colors group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to Consult
          </Link>

          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-sage-400" />
            <span className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-sage-500">
              Pre-Consultation
            </span>
            <div className="w-8 h-px bg-sage-400" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <h1 className="text-3xl lg:text-5xl font-display font-semibold text-warm-900 leading-tight">
              Health & Wellness <br />
              <span className="text-gradient-primary italic">Questionnaire</span>
            </h1>
            <div className="flex items-center gap-2 text-sm text-warm-500 bg-white/70 border border-warm-200 rounded-full px-4 py-2 w-fit shrink-0">
              <Clock size={14} className="text-sage-500" />
              <span>10 steps · ~10 min</span>
            </div>
          </div>

          <p className="text-lg text-warm-500 max-w-2xl leading-relaxed mb-8">
            Help Dr. Leegale Adonis prepare for your consultation by completing this questionnaire.
            Your information is protected and confidential.
          </p>

          {/* Confidentiality & Consent notice */}
          <div className="rounded-2xl border border-sage-200 bg-sage-50/80 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Shield size={20} className="text-sage-600" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-warm-900 mb-3 text-lg">
                  Confidentiality & Informed Consent
                </h3>
                <div className="text-sm text-warm-600 space-y-2">
                  <p>
                    All information is protected by <strong>doctor-patient confidentiality</strong> and
                    handled under the Protection of Personal Information Act (POPIA).
                  </p>
                  <p>
                    By submitting this form you consent to the collection and processing of your
                    health information for the purpose of your consultation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wizard */}
      <section className="pb-20 lg:pb-28 pt-6">
        <QuestionnaireWizard bookingUid={bookingUid} />
      </section>
    </div>
  )
}
