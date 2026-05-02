'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react'
import { stepSchemas } from './schema'
import type { FullFormData } from './types'
import { Step1Personal } from './steps/Step1Personal'
import { Step2Metrics } from './steps/Step2Metrics'
import { Step3Ergonomics } from './steps/Step3Ergonomics'
import { Step4Medical } from './steps/Step4Medical'
import { Step5Medication } from './steps/Step5Medication'
import { Step6Surgical } from './steps/Step6Surgical'
import { Step7Stress } from './steps/Step7Stress'
import { Step8Screening } from './steps/Step8Screening'
import { Step9Family } from './steps/Step9Family'
import { Step10Consent } from './steps/Step10Consent'
import { useRouter } from 'next/navigation'

const STEPS = [
  { title: 'Personal Information',  component: Step1Personal },
  { title: 'Body Metrics',          component: Step2Metrics },
  { title: 'Ergonomics',            component: Step3Ergonomics },
  { title: 'Medical History',       component: Step4Medical },
  { title: 'Chronic Medication',    component: Step5Medication },
  { title: 'Surgical History',      component: Step6Surgical },
  { title: 'Stress & Well-being',   component: Step7Stress },
  { title: 'Screening',             component: Step8Screening },
  { title: 'Family History',        component: Step9Family },
  { title: 'Consent & Indemnity',   component: Step10Consent },
]

interface Props {
  bookingUid?: string
}

export function QuestionnaireWizard({ bookingUid }: Props) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const methods = useForm<FullFormData>({
    mode: 'onTouched',
    defaultValues: {
      stressProfile: [],
      screeningFullBloodCount: false,
      screeningLiverFunction: false,
      screeningKidneyFunction: false,
      screeningThyroidFunction: false,
      screeningECG: false,
      screeningLungFunction: false,
      screeningPapSmear: false,
      screeningMammogram: false,
      screeningGeneticTesting: false,
      screeningGastroscopy: false,
      consentIndemnity: false,
    },
  })

  const isLast = currentStep === STEPS.length - 1
  const StepComponent = STEPS[currentStep].component

  const validateCurrentStep = async (): Promise<boolean> => {
    const schema = stepSchemas[currentStep]
    const allValues = methods.getValues()
    const result = schema.safeParse(allValues)
    if (result.success) return true

    // Map Zod errors back to RHF field errors
    const zodErrors = result.error.flatten().fieldErrors
    let firstErrorField: string | null = null
    for (const [field, msgs] of Object.entries(zodErrors)) {
      if (msgs && msgs.length > 0) {
        methods.setError(field as keyof FullFormData, { message: msgs[0] })
        if (!firstErrorField) firstErrorField = field
      }
    }
    // Also surface refine-level errors (e.g. email confirm mismatch)
    for (const issue of result.error.issues) {
      if (issue.path.length > 0) {
        const path = issue.path.join('.') as keyof FullFormData
        methods.setError(path, { message: issue.message })
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
      const allValues = methods.getValues()
      const res = await fetch('/api/questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingUid: bookingUid ?? null,
          patientName: `${allValues.firstName} ${allValues.lastName}`,
          patientEmail: allValues.email,
          data: allValues,
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string }
        throw new Error(body.error ?? 'Submission failed')
      }

      router.push('/questionnaire/confirmed')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  const progressPct = ((currentStep + 1) / STEPS.length) * 100

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
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <span className="text-xs font-medium text-warm-600">
              {STEPS[currentStep].title}
            </span>
          </div>
          <div className="h-1.5 w-full bg-warm-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-sage-500 rounded-full"
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
                {STEPS[currentStep].title}
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
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-sage-600 text-white text-sm font-semibold hover:bg-sage-700 disabled:opacity-60 transition-all"
            >
              {submitting
                ? <><Loader2 size={16} className="animate-spin" /> Submitting...</>
                : <><CheckCircle2 size={16} /> Submit Questionnaire</>
              }
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-sage-600 text-white text-sm font-semibold hover:bg-sage-700 transition-all"
            >
              Continue <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </FormProvider>
  )
}
