import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, Stethoscope } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Second Medical Opinion — Payment Confirmed',
  description: 'Your second medical opinion payment has been confirmed.',
}

export default function SecondOpinionConfirmedPage() {
  return (
    <div className="bg-cream-100 min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-lg w-full text-center">

        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sage-100 mb-8">
          <CheckCircle2 size={40} className="text-sage-600" />
        </div>

        <h1 className="text-3xl lg:text-4xl font-display font-semibold text-warm-900 mb-4">
          Payment Confirmed!
        </h1>

        <p className="text-lg text-warm-500 leading-relaxed mb-3">
          Your second medical opinion request has been received by{' '}
          <span className="font-semibold text-warm-700">Dr. Leegale Adonis</span>.
        </p>
        <p className="text-warm-400 text-sm mb-10">
          A confirmation has been sent to your email. Dr. Adonis will review your case
          and provide a written opinion within 48 hours.
        </p>

        {/* Next Steps */}
        <div className="rounded-xl bg-sage-50 border border-sage-200 p-5 text-left mb-8">
          <h3 className="font-display font-semibold text-warm-900 text-sm mb-3 flex items-center gap-2">
            <Stethoscope size={16} className="text-sage-600" /> Next Steps
          </h3>
          <ol className="text-sm text-warm-600 space-y-2 list-decimal list-inside">
            <li>Check your email for payment confirmation</li>
            <li>Your case will be reviewed by Dr. Adonis</li>
            <li>Written second opinion sent to your inbox within 48 hours</li>
            <li>Discuss the findings with your primary care provider</li>
          </ol>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
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
