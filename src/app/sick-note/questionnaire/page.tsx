'use client'

import { z } from 'zod'
import { useFormContext } from 'react-hook-form'
import { StreamWizard, PersonalInfoStepFields } from '@/components/stream/StreamWizard'

// ─── Step 2: Sick Leave Details ──────────────────────────────────────────────

const sickLeaveSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  symptoms: z.string().min(1, 'Please describe your symptoms'),
  reason: z.string().min(1, 'Please state the reason for sick leave'),
})

function SickLeaveDetailsStep() {
  const { register, formState: { errors } } = useFormContext()
  const err = (name: string) => errors[name]?.message as string | undefined

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-warm-800 mb-1.5">Start Date</label>
          <input
            {...register('startDate')}
            type="date"
            className="w-full px-4 py-3 rounded-xl border border-warm-300 bg-white focus:ring-2 focus:border-sage-500 outline-none transition-all text-warm-900 text-sm"
          />
          {err('startDate') && <p className="text-xs text-red-500 mt-1">{err('startDate')}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-800 mb-1.5">End Date</label>
          <input
            {...register('endDate')}
            type="date"
            className="w-full px-4 py-3 rounded-xl border border-warm-300 bg-white focus:ring-2 focus:border-sage-500 outline-none transition-all text-warm-900 text-sm"
          />
          {err('endDate') && <p className="text-xs text-red-500 mt-1">{err('endDate')}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-warm-800 mb-1.5">Symptoms</label>
        <textarea
          {...register('symptoms')}
          rows={3}
          placeholder="Describe your symptoms in detail"
          className="w-full px-4 py-3 rounded-xl border border-warm-300 bg-white focus:ring-2 focus:border-sage-500 outline-none transition-all text-warm-900 placeholder:text-warm-300 text-sm resize-none"
        />
        {err('symptoms') && <p className="text-xs text-red-500 mt-1">{err('symptoms')}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-warm-800 mb-1.5">Reason for Sick Leave</label>
        <textarea
          {...register('reason')}
          rows={2}
          placeholder="Briefly explain why you need sick leave"
          className="w-full px-4 py-3 rounded-xl border border-warm-300 bg-white focus:ring-2 focus:border-sage-500 outline-none transition-all text-warm-900 placeholder:text-warm-300 text-sm resize-none"
        />
        {err('reason') && <p className="text-xs text-red-500 mt-1">{err('reason')}</p>}
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
        <h3 className="text-sm font-semibold text-warm-800">Sick Leave Details</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-warm-400">From:</span> <span className="text-warm-800">{vals.startDate}</span></div>
          <div><span className="text-warm-400">To:</span> <span className="text-warm-800">{vals.endDate}</span></div>
          <div className="col-span-2"><span className="text-warm-400">Symptoms:</span> <span className="text-warm-800">{vals.symptoms}</span></div>
          <div className="col-span-2"><span className="text-warm-400">Reason:</span> <span className="text-warm-800">{vals.reason}</span></div>
        </div>
      </div>

      <div className="rounded-xl bg-cream-200/50 p-4">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            {...register('agreeTerms')}
            type="checkbox"
            value="agree"
            className="mt-0.5 w-5 h-5 rounded border border-warm-300 accent-sage-600 flex-shrink-0"
          />
          <span className="text-sm text-warm-700 leading-relaxed">
            I confirm that the information provided is accurate and true. I understand
            that a doctor will assess my symptoms and issue a sick note at their
            professional discretion.
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
    title: 'Sick Leave Details',
    schema: sickLeaveSchema,
    Component: SickLeaveDetailsStep,
  },
  {
    title: 'Review',
    schema: reviewSchema,
    Component: ReviewStep,
  },
]

export default function SickNoteQuestionnairePage() {
  return (
    <div className="bg-cream-100 min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-px bg-warm-300" />
          <span className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-warm-500">Sick leave</span>
          <div className="w-8 h-px bg-warm-300" />
        </div>
        <h1 className="text-3xl font-display font-semibold text-warm-900">Sick Leave Assessment</h1>
        <p className="text-warm-500 text-sm mt-2">Complete the assessment to request your sick note. R250.</p>
      </div>
      <StreamWizard
        steps={steps}
        packageId="sicknote-1"
        successPath="/sick-note/confirmed"
        cancelPath="/sick-note"
        accentColor="cream"
        streamLabel="Sick Leave Assessment"
      />
    </div>
  )
}
