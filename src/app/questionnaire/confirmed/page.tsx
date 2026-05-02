import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Questionnaire Received',
  description: 'Your health questionnaire has been received.',
}

export default function QuestionnaireConfirmedPage() {
  return (
    <div className="bg-cream-100 min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-lg w-full text-center">

        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sage-100 mb-8">
          <CheckCircle2 size={40} className="text-sage-600" />
        </div>

        <h1 className="text-3xl lg:text-4xl font-display font-semibold text-warm-900 mb-4">
          Thank you!
        </h1>

        <p className="text-lg text-warm-500 leading-relaxed mb-3">
          Your health questionnaire has been received by{' '}
          <span className="font-semibold text-warm-700">Dr. Leegale Adonis</span>.
        </p>
        <p className="text-warm-400 text-sm mb-10">
          A copy has been sent to your email address. Dr. Adonis will review your responses
          before your consultation.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/consult/book"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sage-600 text-white text-sm font-semibold hover:bg-sage-700 transition-all"
          >
            <Calendar size={16} /> Book a Consultation
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-warm-300 text-sm text-warm-700 hover:bg-warm-50 transition-all"
          >
            Back to Home <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
