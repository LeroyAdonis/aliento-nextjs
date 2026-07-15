import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Prescription Refill — Payment Confirmed',
  description: 'Your prescription refill payment has been confirmed.',
}

export default function PrescriptionConfirmedPage() {
  return (
    <div className="bg-cream-100 min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-lg w-full text-center">

        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blush-100 mb-8">
          <CheckCircle2 size={40} className="text-blush-600" />
        </div>

        <h1 className="text-3xl lg:text-4xl font-display font-semibold text-warm-900 mb-4">
          Payment Confirmed!
        </h1>

        <p className="text-lg text-warm-500 leading-relaxed mb-3">
          Your prescription refill request has been received by{' '}
          <span className="font-semibold text-warm-700">Dr. Leegale Adonis</span>.
        </p>
        <p className="text-warm-400 text-sm mb-10">
          A confirmation has been sent to your email. Your prescription will be reviewed
          and issued shortly. If submitted before 14:00, expect same-day service.
        </p>

        {/* Next Steps */}
        <div className="rounded-xl bg-blush-50 border border-blush-200 p-5 text-left mb-8">
          <h3 className="font-display font-semibold text-warm-900 text-sm mb-3 flex items-center gap-2">
            <FileText size={16} className="text-blush-600" /> Next Steps
          </h3>
          <ol className="text-sm text-warm-600 space-y-2 list-decimal list-inside">
            <li>Check your email for payment confirmation</li>
            <li>Your prescription will be reviewed by Dr. Adonis</li>
            <li>Electronic prescription sent to your inbox as a PDF</li>
            <li>Take the PDF to your pharmacy of choice</li>
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
