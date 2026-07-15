'use client'

import { z } from 'zod'
import { useFormContext } from 'react-hook-form'
import { StreamWizard, PersonalInfoStepFields } from '@/components/stream/StreamWizard'

// ─── Step 2: Medical Reason ──────────────────────────────────────────────────

const prescriptionDetailsSchema = z.object({
  medicationName: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage information is required'),
  reasonForRefill: z.string().min(1, 'Please describe the reason for your refill'),
  allergies: z.string().optional(),
})

function PrescriptionDetailsStep() {
  const { register, formState: { errors } } = useFormContext()
  const err = (name: string) => errors[name]?.message as string | undefined

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-warm-800 mb-1.5">Medication Name</label>
        <input
          {...register('medicationName')}
          placeholder="e.g. Omeprazole 20mg"
          className="w-full px-4 py-3 rounded-xl border border-warm-300 bg-white focus:ring-2 focus:border-blush-500 outline-none transition-all text-warm-900 placeholder:text-warm-300 text-sm"
        />
        {err('medicationName') && <p className="text-xs text-red-500 mt-1">{err('medicationName')}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-warm-800 mb-1.5">Dosage / Duration</label>
        <input
          {...register('dosage')}
          placeholder="e.g. 1 capsule daily for 30 days"
          className="w-full px-4 py-3 rounded-xl border border-warm-300 bg-white focus:ring-2 focus:border-blush-500 outline-none transition-all text-warm-900 placeholder:text-warm-300 text-sm"
        />
        {err('dosage') && <p className="text-xs text-red-500 mt-1">{err('dosage')}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-warm-800 mb-1.5">Reason for Refill</label>
        <textarea
          {...register('reasonForRefill')}
          rows={3}
          placeholder="Briefly explain why you need a refill"
          className="w-full px-4 py-3 rounded-xl border border-warm-300 bg-white focus:ring-2 focus:border-blush-500 outline-none transition-all text-warm-900 placeholder:text-warm-300 text-sm resize-none"
        />
        {err('reasonForRefill') && <p className="text-xs text-red-500 mt-1">{err('reasonForRefill')}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-warm-800 mb-1.5">Known Allergies <span className="text-warm-400 font-normal">(optional)</span></label>
        <input
          {...register('allergies')}
          placeholder="List any medication allergies"
          className="w-full px-4 py-3 rounded-xl border border-warm-300 bg-white focus:ring-2 focus:border-blush-500 outline-none transition-all text-warm-900 placeholder:text-warm-300 text-sm"
        />
      </div>
    </div>
  )
}

// ─── Step 3: Review ──────────────────────────────────────────────────────────

const reviewSchema = z.object({
  agreeTerms: z.string().refine(v => v === 'agree', { message: 'You must agree to proceed' }),
})

function ReviewStep() {
  const { getValues, register, formState: { errors } } = useFormContext()
  const vals = getValues()

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-warm-50 p-5 space-y-3">
        <h3 className="text-sm font-semibold text-warm-800">Personal Information</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-warm-400">Name:</span> <span className="text-warm-800">{vals.firstName} {vals.lastName}</span></div>
          <div><span className="text-warm-400">Email:</span> <span className="text-warm-800">{vals.email}</span></div>
          <div><span className="text-warm-400">Phone:</span> <span className="text-warm-800">{vals.phone}</span></div>
        </div>
      </div>

      <div className="rounded-xl bg-warm-50 p-5 space-y-3">
        <h3 className="text-sm font-semibold text-warm-800">Prescription Details</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-warm-400">Medication:</span> <span className="text-warm-800">{vals.medicationName}</span></div>
          <div><span className="text-warm-400">Dosage:</span> <span className="text-warm-800">{vals.dosage}</span></div>
          <div className="col-span-2"><span className="text-warm-400">Reason:</span> <span className="text-warm-800">{vals.reasonForRefill}</span></div>
          {vals.allergies && <div className="col-span-2"><span className="text-warm-400">Allergies:</span> <span className="text-warm-800">{vals.allergies}</span></div>}
        </div>
      </div>

      <div className="rounded-xl bg-blush-50 p-4">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            {...register('agreeTerms')}
            type="checkbox"
            value="agree"
            className="mt-0.5 w-5 h-5 rounded border border-warm-300 accent-blush-600 flex-shrink-0"
          />
          <span className="text-sm text-warm-700 leading-relaxed">
            I confirm that the information provided is accurate and true. I understand
            that this is a prescription refill request and a doctor will review my details
            before issuing the prescription.
          </span>
        </label>
        {errors.agreeTerms?.message && (
          <p className="text-xs text-red-500 mt-1">{errors.agreeTerms.message as string}</p>
        )}
      </div>

      <p className="text-xs text-warm-400 text-center">
        Total: <strong className="text-warm-800">R250</strong> — Rendered securely via Payfast.
      </p>
    </div>
  )
}

// ─── Steps configuration ─────────────────────────────────────────────────────

const steps = [
  {
    title: 'Personal Info',
    schema: z.object({
      firstName: z.string().min(1, 'First name is required'),
      lastName: z.string().min(1, 'Last name is required'),
      email: z.string().email('Valid email address required'),
      phone: z.string().min(1, 'Phone number is required'),
    }),
    Component: PersonalInfoStepFields,
  },
  {
    title: 'Medical Reason',
    schema: prescriptionDetailsSchema,
    Component: PrescriptionDetailsStep,
  },
  {
    title: 'Review',
    schema: reviewSchema,
    Component: ReviewStep,
  },
]

export default function PrescriptionQuestionnairePage() {
  return (
    <div className="bg-cream-100 min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-px bg-blush-400" />
          <span className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-blush-500">Prescription refill</span>
          <div className="w-8 h-px bg-blush-400" />
        </div>
        <h1 className="text-3xl font-display font-semibold text-warm-900">Request a Prescription Refill</h1>
        <p className="text-warm-500 text-sm mt-2">Complete the steps below to request your refill. R250.</p>
      </div>
      <StreamWizard
        steps={steps}
        packageId="prescription-1"
        successPath="/prescription/confirmed"
        cancelPath="/prescription"
        accentColor="blush"
        streamLabel="Prescription Refill"
      />
    </div>
  )
}
