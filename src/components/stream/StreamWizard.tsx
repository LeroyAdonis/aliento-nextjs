'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Loader2, CreditCard } from 'lucide-react'
import { z } from 'zod'

// ─── Shared step schemas ─────────────────────────────────────────────────────

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email address required'),
  phone: z.string().min(1, 'Phone number is required'),
})

export type PersonalInfo = z.infer<typeof personalInfoSchema>

// ─── Step definitions ────────────────────────────────────────────────────────

export interface StepDef {
  title: string
  schema: z.ZodObject<any>
  Component: React.FC
}

export interface StreamWizardProps {
  steps: StepDef[]
  packageId: string
  successPath: string
  cancelPath: string
  accentColor: 'blush' | 'cream' | 'sage'
  streamLabel: string
}

const accentMap: Record<string, { bg: string; border: string; btn: string; btnHover: string; ring: string }> = {
  blush:  { bg: 'bg-blush-100', border: 'border-blush-200', btn: 'bg-blush-500', btnHover: 'hover:bg-blush-600', ring: 'focus:ring-blush-500/20' },
  cream:  { bg: 'bg-cream-200', border: 'border-cream-300', btn: 'bg-sage-500', btnHover: 'hover:bg-sage-600', ring: 'focus:ring-sage-500/20' },
  sage:   { bg: 'bg-sage-100', border: 'border-sage-200', btn: 'bg-sage-500', btnHover: 'hover:bg-sage-600', ring: 'focus:ring-sage-500/20' },
}

// ─── Shared step components ──────────────────────────────────────────────────

/** Personal Info — used by all three streams */
export function PersonalInfoStepFields() {
  const { register, formState: { errors } } = useFormContext()
  const err = (name: string) => errors[name]?.message as string | undefined

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-warm-800 mb-1.5">First Name</label>
          <input
            {...register('firstName')}
            className="w-full px-4 py-3 rounded-xl border border-warm-300 bg-white focus:ring-2 focus:border-sage-500 outline-none transition-all text-warm-900 placeholder:text-warm-300 text-sm"
            placeholder="Your first name"
          />
          {err('firstName') && <p className="text-xs text-red-500 mt-1">{err('firstName')}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-800 mb-1.5">Last Name</label>
          <input
            {...register('lastName')}
            className="w-full px-4 py-3 rounded-xl border border-warm-300 bg-white focus:ring-2 focus:border-sage-500 outline-none transition-all text-warm-900 placeholder:text-warm-300 text-sm"
            placeholder="Your last name"
          />
          {err('lastName') && <p className="text-xs text-red-500 mt-1">{err('lastName')}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-warm-800 mb-1.5">Email Address</label>
        <input
          {...register('email')}
          type="email"
          className="w-full px-4 py-3 rounded-xl border border-warm-300 bg-white focus:ring-2 focus:border-sage-500 outline-none transition-all text-warm-900 placeholder:text-warm-300 text-sm"
          placeholder="you@email.com"
        />
        {err('email') && <p className="text-xs text-red-500 mt-1">{err('email')}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-warm-800 mb-1.5">Phone Number</label>
        <input
          {...register('phone')}
          type="tel"
          className="w-full px-4 py-3 rounded-xl border border-warm-300 bg-white focus:ring-2 focus:border-sage-500 outline-none transition-all text-warm-900 placeholder:text-warm-300 text-sm"
          placeholder="+27 XX XXX XXXX"
        />
        {err('phone') && <p className="text-xs text-red-500 mt-1">{err('phone')}</p>}
      </div>
    </div>
  )
}

// ─── StreamWizard ────────────────────────────────────────────────────────────

type WizardData = Record<string, string>

export function StreamWizard({ steps, packageId, successPath, cancelPath, accentColor, streamLabel }: StreamWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const colors = accentMap[accentColor]

  const combinedSchema = steps.reduce((acc, s) => acc.merge(s.schema), z.object({}) as z.ZodObject<any>)
  type Combined = z.infer<typeof combinedSchema>

  const methods = useForm<Combined>({
    mode: 'onTouched',
    defaultValues: {},
  })

  const isLast = currentStep === steps.length - 1
  const StepComponent = steps[currentStep].Component

  const validateCurrentStep = async (): Promise<boolean> => {
    const schema = steps[currentStep].schema
    const allValues = methods.getValues()
    const result = schema.safeParse(allValues)
    if (result.success) return true

    const zodErrors = result.error.flatten().fieldErrors
    for (const [field, msgs] of Object.entries(zodErrors)) {
      if (msgs && msgs.length > 0) {
        methods.setError(field as any, { message: msgs[0] })
      }
    }
    return false
  }

  const handleNext = async () => {
    const valid = await validateCurrentStep()
    if (!valid) return
    setDirection(1)
    setCurrentStep(s => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    setDirection(-1)
    setCurrentStep(s => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    const valid = await validateCurrentStep()
    if (!valid) return

    setSubmitting(true)
    setSubmitError(null)

    try {
      const allValues = methods.getValues() as unknown as WizardData
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId,
          buyerEmail: allValues.email,
          buyerName: `${allValues.firstName} ${allValues.lastName}`,
          successPath,
          cancelPath,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Payment initiation failed')
      }

      // Submit Payfast form
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = result.url
      Object.entries(result.data).forEach(([key, value]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = value as string
        form.appendChild(input)
      })
      document.body.appendChild(form)
      form.submit()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  const progressPct = ((currentStep + 1) / steps.length) * 100

  const variants = {
    enter:  (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
  }

  return (
    <FormProvider {...methods}>
      <div className="max-w-3xl mx-auto px-6 lg:px-8 pb-24">

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold tracking-widest uppercase text-warm-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-xs font-medium text-warm-600">
              {steps[currentStep].title}
            </span>
          </div>
          <div className="h-1.5 w-full bg-warm-200 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${colors.btn}`}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Step card */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: 'easeInOut' }}
          >
            <div className="bg-white border border-warm-200 rounded-2xl p-6 lg:p-8 shadow-sm">
              <h2 className="text-xl font-display font-semibold text-warm-900 mb-6">
                {steps[currentStep].title}
              </h2>
              <StepComponent />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Submit error */}
        {submitError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-warm-300 text-sm text-warm-700 hover:bg-warm-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} /> Back
          </button>

          {isLast ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-sm font-semibold transition-all disabled:opacity-60 ${colors.btn} ${colors.btnHover}`}
            >
              {submitting
                ? <><Loader2 size={16} className="animate-spin" /> Processing...</>
                : <><CreditCard size={16} /> Pay & Submit — R250</>
              }
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-sm font-semibold transition-all ${colors.btn} ${colors.btnHover}`}
            >
              Continue <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </FormProvider>
  )
}
