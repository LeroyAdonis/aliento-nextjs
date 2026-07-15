'use client'

import { z } from 'zod'
import { useFormContext } from 'react-hook-form'
import { StreamWizard, PersonalInfoStepFields } from '@/components/stream/StreamWizard'

// ─── Step 2: Current Diagnosis ────────────────────────────────────────────────

const diagnosisSchema = z.object({
  currentDiagnosis: z.string().min(1, 'Please describe your current diagnosis'),
  treatingDoctor: z.string().min(1, 'Please provide your treating doctor name'),
  reasonForSecondOpinion: z.string().min(1, 'Please explain why you want a second opinion'),
  additionalInfo: z.string().optional(),
})

function DiagnosisStep() {
  const { register, formState: { errors } } = useFormContext()
  const err = (name: string) => errors[name]?.message as string | undefined

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-warm-800 mb-1.5">Current Diagnosis</label>
        <textarea
          {...register('currentDiagnosis')}
          rows={3}
          placeholder="Describe your current diagnosis and relevant medical history"
          className="w-full px-4 py-3 rounded-xl border border-warm-300 bg-white focus:ring-2 focus:border-sage-500 outline-none transition-all text-warm-900 placeholder:text-warm-300 text-sm resize-none"
        />
        {err('currentDiagnosis') && <p className="text-xs text-red-500 mt-1">{err('currentDiagnosis')}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-warm-800 mb-1.5">Treating Doctor / Specialist</label>
        <input
          {...register('treatingDoctor')}
          placeholder="Name of your current doctor"
          className="w-full px-4 py-3 rounded-xl border border-warm-300 bg-white focus:ring-2 focus:border-sage-500 outline-none transition-all text-warm-900 placeholder:text-warm-300 text-sm"
        />
        {err('treatingDoctor') && <p className="text-xs text-red-500 mt-1">{err('treatingDoctor')}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-warm-800 mb-1.5">Reason for Second Opinion</label>
        <textarea
          {...register('reasonForSecondOpinion')}
          rows={3}
          placeholder="Explain why you would like a second opinion"
          className="w-full px-4 py-3 rounded-xl border border-warm-300 bg-white focus:ring-2 focus:border-sage-500 outline-none transition-all text-warm-900 placeholder:text-warm-300 text-sm resize-none"
        />
        {err('reasonForSecondOpinion') && <p className="text-xs text-red-500 mt-1">{err('reasonForSecondOpinion')}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-warm-800 mb-1.5">Additional Information <span className="text-warm-400 font-normal">(optional)</span></label>
        <textarea
          {...register('additionalInfo')}
          rows={2}
          placeholder="Any test results, reports, or context"
          className="w-full px-4 py-3 rounded-xl border border-warm-300 bg-white focus:ring-2 focus:border-sage-500 outline-none transition-all text-warm-900 placeholder:text-warm-300 text-sm resize-none"
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
        <h3 className="text-sm font-semibold text-warm-800">Medical Details</h3>
        <div className="grid gap-2 text-sm">
          <div><span className="text-warm-400">Diagnosis:</span> <span className="text-warm-800">{vals.currentDiagnosis}</span></div>
          <div><span className="text-warm-400">Treating Doctor:</span> <span className="text-warm-800">{vals.treatingDoctor}</span></div>
          <div><span className="text-warm-400">Reason:</span> <span className="text-warm-800">{vals.reasonForSecondOpinion}</span></div>
          {vals.additionalInfo && <div><span className="text-warm-400">Additional Info:</span> <span className="text-warm-800">{vals.additionalInfo}</span></div>}
        </div>
      </div>

      <div className="rounded-xl bg-sage-50 p-4">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            {...register('agreeTerms')}
            type="checkbox"
            value="agree"
            className="mt-0.5 w-5 h-5 rounded border border-warm-300 accent-sage-600 flex-shrink-0"
          />
          <span className="text-sm text-warm-700 leading-relaxed">
            I confirm that the information provided is accurate and true. I understand
            that a doctor will review my case and provide a professional second opinion
            based on the details I have submitted.
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
    title: 'Current Diagnosis',
    schema: diagnosisSchema,
    Component: DiagnosisStep,
  },
  {
    title: 'Review',
    schema: reviewSchema,
    Component: ReviewStep,
  },
]

export default function SecondOpinionQuestionnairePage() {
  return (
    <div className="bg-cream-100 min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-px bg-sage-400" />
          <span className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-sage-500">Second opinion</span>
          <div className="w-8 h-px bg-sage-400" />
        </div>
        <h1 className="text-3xl font-display font-semibold text-warm-900">Request a Second Medical Opinion</h1>
        <p className="text-warm-500 text-sm mt-2">Share your diagnosis details for an independent review. R250.</p>
      </div>
      <StreamWizard
        steps={steps}
        packageId="secondopinion-1"
        successPath="/second-opinion/confirmed"
        cancelPath="/second-opinion"
        accentColor="sage"
        streamLabel="Second Medical Opinion"
      />
    </div>
  )
}
