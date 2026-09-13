import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, ClipboardList } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sick Note — Request Under Review',
  description: 'Your sick note request is currently being reviewed by a medical doctor.',
}

export default function SickNoteConfirmedPage() {
  return (
    <div className="bg-cream-100 min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-lg w-full text-center">

        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cream-200 mb-8">
          <CheckCircle2 size={40} className="text-warm-600" />
        </div>

        <h1 className="text-3xl lg:text-4xl font-display font-semibold text-warm-900 mb-4">
          Your request is currently being reviewed
        </h1>

        <p className="text-lg text-warm-500 leading-relaxed mb-3">
          Your sick note assessment request has been received by{' '}
          <span className="font-semibold text-warm-700">Dr. Leegale Adonis</span>.
        </p>
        <p className="text-warm-400 text-sm mb-10">
          A medical doctor will review your request and get in touch with you. Your certificate will be emailed once issued.
        </p>

        {/* Next Steps */}
        <div className="rounded-xl bg-cream-200/50 border border-warm-200 p-5 text-left mb-8">
          <h3 className="font-display font-semibold text-warm-900 text-sm mb-3 flex items-center gap-2">
            <ClipboardList size={16} className="text-warm-500" /> Next Steps
          </h3>
          <ol className="text-sm text-warm-600 space-y-2 list-decimal list-inside">
            <li>We have received your sick note request</li>
            <li>A medical doctor reviews your assessment</li>
            <li>The doctor gets in touch with you</li>
            <li>Your certificate is emailed once issued</li>
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
