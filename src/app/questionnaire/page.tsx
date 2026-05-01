import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Shield, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Health Questionnaire',
  description:
    'Complete your pre-consultation health questionnaire. Your information is protected by doctor-patient confidentiality.',
}

export default function QuestionnairePage() {
  return (
    <div className="bg-cream-100 min-h-screen">
      {/* Header */}
      <section className="relative py-16 lg:py-20 overflow-hidden grain">
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

          <h1 className="text-3xl lg:text-5xl font-display font-semibold text-warm-900 mb-6 leading-tight">
            Health & Wellness <br />
            <span className="text-gradient-primary italic">Questionnaire</span>
          </h1>

          <p className="text-lg text-warm-500 max-w-2xl leading-relaxed mb-6">
            Help Dr. Gaila prepare for your consultation by completing this questionnaire.
            Your information is protected and confidential.
          </p>

          {/* Confidentiality & Consent notice */}
          <div className="rounded-2xl border border-sage-200 bg-sage-50 p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center flex-shrink-0 mt-1">
                <Shield size={20} className="text-sage-600" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-warm-900 mb-3 text-lg">
                  Confidentiality & Informed Consent
                </h3>
                <div className="text-sm text-warm-600 space-y-3">
                  <p>
                    All information you provide in this questionnaire is protected by 
                    <strong> doctor-patient confidentiality</strong> and will be handled in 
                    accordance with the Protection of Personal Information Act (POPIA).
                  </p>
                  <p>
                    Your data is stored securely and will only be used for the purpose of 
                    your medical consultation. It will not be shared with any third party 
                    without your explicit written consent.
                  </p>
                  <p>
                    By completing and submitting this form, you acknowledge that you have 
                    read and understood this confidentiality notice and consent to the 
                    collection and processing of your health information for your consultation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded JotForm */}
      <section className="pb-20 lg:pb-28">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="rounded-3xl border border-warm-200 bg-white overflow-hidden shadow-sm">
            <iframe
              src="https://form.jotform.com/251703501661044"
              title="Aliento Health & Wellness Questionnaire"
              width="100%"
              height="6800"
              className="border-0"
              allowFullScreen
              allow="geolocation; microphone; camera; fullscreen"
            />
          </div>
        </div>
      </section>
    </div>
  )
}