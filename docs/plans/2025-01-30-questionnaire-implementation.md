# Custom Questionnaire Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the JotForm iframe on `/questionnaire` with a fully custom 10-step multi-step wizard using React Hook Form + Zod, saving responses to the Neon DB and emailing Dr. Adonis via Resend.

**Architecture:** `QuestionnaireWizard` (Client Component) wraps all 10 step components under a single `FormProvider`. Each "Continue" click validates only the current step's Zod schema before advancing. On step 10 submit, a POST to `/api/questionnaire` inserts into the `questionnaires` DB table and fires a Resend email to `leegale@alientomd.com`.

**Tech Stack:** Next.js 16 App Router, React 19, React Hook Form, Zod v4, Drizzle ORM + Neon, Resend, Framer Motion v12, Tailwind CSS v4, Lucide React, `cn()` util (`@/lib/utils`)

---

### Task 1: Install Missing Dependencies

**Files:**
- Modify: `package.json` (via npm install)

**Step 1: Install react-hook-form and @hookform/resolvers**

```bash
cd C:\scratchpad\aliento-nextjs
npm install react-hook-form @hookform/resolvers
```

Expected: Both packages added to `dependencies` in `package.json`. No errors.

> Note: Zod v4 is already installed. `@hookform/resolvers` v3.10.0+ supports Zod v4 via `import { zodResolver } from '@hookform/resolvers/zod'`. If you see a "Zod v4 not supported" error, use `import { zodResolver } from '@hookform/resolvers/zod-v4'` instead.

**Step 2: Verify install**

```bash
node -e "require('react-hook-form'); console.log('ok')"
```

Expected: prints `ok`

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add react-hook-form and @hookform/resolvers"
```

---

### Task 2: Create Zod Schemas and TypeScript Types

**Files:**
- Create: `src/app/questionnaire/schema.ts`
- Create: `src/app/questionnaire/types.ts`

**Step 1: Create `src/app/questionnaire/schema.ts`**

```typescript
import { z } from 'zod'

// ─── Step 1: Personal Information ────────────────────────────────────────────
export const step1Schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  age: z.string().min(1, 'Age is required'),
  gender: z.enum(['Male', 'Female', 'N/A']),
  race: z.enum(['Black', 'White', 'Coloured', 'Indian', 'Other']),
  email: z.string().email('Valid email required'),
  emailConfirm: z.string().email('Valid email required'),
  education: z.enum(['Matric or equivalent', 'Undergraduate and beyond', 'Other']),
  medicalAid: z.enum(['Yes', 'No']),
  medicalAidNumber: z.string().optional(),
  streetAddress: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  province: z.string().min(1, 'Province is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  phone: z.string().min(1, 'Phone number is required'),
  gpName: z.string().min(1, "GP's name is required"),
}).refine(d => d.email === d.emailConfirm, {
  message: 'Emails must match',
  path: ['emailConfirm'],
})

// ─── Step 2: Body Metrics ─────────────────────────────────────────────────────
export const step2Schema = z.object({
  currentWeight: z.string().min(1, 'Required'),
  currentHeight: z.string().min(1, 'Required'),
  waistCircumference: z.string().min(1, 'Required'),
  goalWeight: z.string().min(1, 'Required'),
  weightChangedOver5kg: z.enum(['Yes', 'No']),
  weightChangeAmount: z.string().optional(),
  bloodGroup: z.string().optional(),
  lastBloodWorkDate: z.string().optional(),
  bloodLab: z.enum(['Lancet', 'Ampath', 'Other']).optional(),
  consentBloodAccess: z.enum(['Yes', 'No']),
})

// ─── Step 3: Ergonomics ───────────────────────────────────────────────────────
export const step3Schema = z.object({
  badPosture: z.enum(['Yes', 'No']),
  backPain: z.enum(['Yes', 'No']),
  painWhenWalking: z.enum(['Yes', 'No']),
  hipPain: z.enum(['Yes', 'No']),
  headaches: z.enum(['Yes', 'No']),
  workAtDesk: z.enum(['Yes', 'No']),
  laptopOnLap: z.enum(['Yes', 'No']),
  mobileOver6hrs: z.enum(['Yes', 'No']),
  troubleConcentrating: z.enum(['Yes', 'No']),
})

// ─── Step 4: Medical History ──────────────────────────────────────────────────
export const step4Schema = z.object({
  diabetes: z.enum(['Yes', 'No']),
  hypertension: z.enum(['Yes', 'No']),
  cardiacDisease: z.enum(['Yes', 'No']),
  asthma: z.enum(['Yes', 'No']),
  stroke: z.enum(['Yes', 'No']),
  urinaryTractDisease: z.enum(['Yes', 'No']),
  otherRespiratoryDisease: z.string().min(1, "State 'No' if not applicable"),
  mentalHealthDisease: z.string().min(1, "State 'No' if not applicable"),
  seizures: z.string().min(1, "State 'No' if not applicable"),
  thyroidDisease: z.string().min(1, "State 'No' if not applicable"),
  allergies: z.string().min(1, "State 'No' if not applicable"),
  skinAllergies: z.string().min(1, "State 'No' if not applicable"),
  adverseAllergyReaction: z.string().min(1, "State 'No' if not applicable"),
  autoimmuneDisease: z.string().min(1, "State 'No' if not applicable"),
  pregnantOrBreastfeeding: z.enum(['Yes', 'No']),
  menopausal: z.enum(['Yes', 'No']),
  menstrualPeriods: z.enum(['Regular', 'Heavy', 'Painful']).optional(),
  hadCovid: z.enum(['Yes', 'No']),
  covidDate: z.string().optional(),
  longCovidSymptoms: z.string().optional(),
  covidVaccinationStatus: z.enum(['Vaccinated', 'Not Vaccinated', 'Prefer not to say']),
  otherChronicIllnesses: z.string().optional(),
})

// ─── Step 5: Chronic Medication ───────────────────────────────────────────────
export const step5Schema = z.object({
  currentMedications: z.string().min(1, "State 'No' if not applicable"),
})

// ─── Step 6: Surgical History ─────────────────────────────────────────────────
export const step6Schema = z.object({
  surgicalHistory: z.string().min(1, "State 'No' if not applicable"),
})

// ─── Step 7: Stress & Emotional Well-being ────────────────────────────────────
export const step7Schema = z.object({
  stressProfile: z.array(z.enum(['Anxious', 'Calm', 'Impulsive', 'Overly stressed', 'Reckless'])).min(1, 'Select at least one'),
  smokes: z.enum(['Yes', 'No']),
  smokingDuration: z.string().optional(),
  smokingPerDay: z.string().optional(),
  drinksOver3xWeek: z.enum(['Yes', 'No']),
  drinkType: z.string().optional(),
  recreationalDrugs: z.enum(['Yes', 'No']),
  exercisesDaily: z.enum(['Yes', 'No']),
  exerciseType: z.string().optional(),
  healthyDiet: z.enum(['Yes', 'No']),
})

// ─── Step 8: Screening ────────────────────────────────────────────────────────
export const step8Schema = z.object({
  screeningFullBloodCount: z.boolean().default(false),
  screeningLiverFunction: z.boolean().default(false),
  screeningKidneyFunction: z.boolean().default(false),
  screeningThyroidFunction: z.boolean().default(false),
  screeningECG: z.boolean().default(false),
  screeningLungFunction: z.boolean().default(false),
  screeningPapSmear: z.boolean().default(false),
  screeningMammogram: z.boolean().default(false),
  screeningGeneticTesting: z.boolean().default(false),
  screeningGastroscopy: z.boolean().default(false),
  otherMedicalTests: z.string().optional(),
})

// ─── Step 9: Family History ───────────────────────────────────────────────────
export const step9Schema = z.object({
  familyHypertension: z.enum(['Yes', 'No']),
  familyDiabetes: z.enum(['Yes', 'No']),
  familySeizures: z.enum(['Yes', 'No']),
  familyHeartDisease: z.enum(['Yes', 'No']),
  familyAutoimmuneDisease: z.enum(['Yes', 'No']),
  familyKidneyDisorders: z.enum(['Yes', 'No']),
  familyAlzheimers: z.enum(['Yes', 'No']),
  familyHighCholesterol: z.enum(['Yes', 'No']),
  familyCancer: z.string().optional(),
})

// ─── Step 10: Consent & Indemnity ─────────────────────────────────────────────
export const step10Schema = z.object({
  consentResearch: z.enum(['agree', 'disagree'], { message: 'Please select an option' }),
  consentPOPI: z.literal('agree', { message: 'POPI compliance is required' }),
  consentIndemnity: z.literal(true, { message: 'You must accept the indemnity to proceed' }),
})

// ─── Combined full schema (for final API submission) ──────────────────────────
export const fullSchema = step1Schema
  .and(step2Schema)
  .and(step3Schema)
  .and(step4Schema)
  .and(step5Schema)
  .and(step6Schema)
  .and(step7Schema)
  .and(step8Schema)
  .and(step9Schema)
  .and(step10Schema)

export const stepSchemas = [
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  step6Schema,
  step7Schema,
  step8Schema,
  step9Schema,
  step10Schema,
] as const
```

**Step 2: Create `src/app/questionnaire/types.ts`**

```typescript
import { z } from 'zod'
import {
  step1Schema, step2Schema, step3Schema, step4Schema,
  step5Schema, step6Schema, step7Schema, step8Schema,
  step9Schema, step10Schema, fullSchema,
} from './schema'

export type Step1Data = z.infer<typeof step1Schema>
export type Step2Data = z.infer<typeof step2Schema>
export type Step3Data = z.infer<typeof step3Schema>
export type Step4Data = z.infer<typeof step4Schema>
export type Step5Data = z.infer<typeof step5Schema>
export type Step6Data = z.infer<typeof step6Schema>
export type Step7Data = z.infer<typeof step7Schema>
export type Step8Data = z.infer<typeof step8Schema>
export type Step9Data = z.infer<typeof step9Schema>
export type Step10Data = z.infer<typeof step10Schema>
export type FullFormData = z.infer<typeof fullSchema>
```

**Step 3: Commit**

```bash
git add src/app/questionnaire/schema.ts src/app/questionnaire/types.ts
git commit -m "feat(questionnaire): add Zod schemas and TypeScript types"
```

---

### Task 3: Create Shared Form UI Primitives

**Files:**
- Create: `src/components/ui/form-primitives.tsx`

These are lightweight, unstyled wrapper components that keep individual step files concise. All apply the Aliento design system (cream/sage/warm Tailwind tokens + `cn()`).

**Step 1: Create `src/components/ui/form-primitives.tsx`**

```typescript
'use client'

import { useFormContext, Controller } from 'react-hook-form'
import { cn } from '@/lib/utils'

// ─── FieldWrapper ─────────────────────────────────────────────────────────────
export function FieldWrapper({ label, name, children, hint }: {
  label: string
  name: string
  children: React.ReactNode
  hint?: string
}) {
  const { formState: { errors } } = useFormContext()
  const error = name.split('.').reduce((acc: unknown, k) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[k]
    return undefined
  }, errors) as { message?: string } | undefined

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-warm-800">{label}</label>
      {hint && <p className="text-xs text-warm-400 -mt-1">{hint}</p>}
      {children}
      {error?.message && (
        <p className="text-xs text-red-600">{error.message}</p>
      )}
    </div>
  )
}

// ─── TextField ────────────────────────────────────────────────────────────────
export function TextField({ name, label, placeholder, type = 'text', hint }: {
  name: string
  label: string
  placeholder?: string
  type?: string
  hint?: string
}) {
  const { register } = useFormContext()
  return (
    <FieldWrapper label={label} name={name} hint={hint}>
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-warm-300 bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 outline-none transition-all text-warm-900 placeholder:text-warm-300 text-sm"
      />
    </FieldWrapper>
  )
}

// ─── TextareaField ────────────────────────────────────────────────────────────
export function TextareaField({ name, label, placeholder, rows = 4, hint }: {
  name: string
  label: string
  placeholder?: string
  rows?: number
  hint?: string
}) {
  const { register } = useFormContext()
  return (
    <FieldWrapper label={label} name={name} hint={hint}>
      <textarea
        {...register(name)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-warm-300 bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 outline-none transition-all text-warm-900 placeholder:text-warm-300 text-sm resize-none"
      />
    </FieldWrapper>
  )
}

// ─── RadioGroupField ──────────────────────────────────────────────────────────
export function RadioGroupField({ name, label, options, hint }: {
  name: string
  label: string
  options: string[]
  hint?: string
}) {
  const { register } = useFormContext()
  return (
    <FieldWrapper label={label} name={name} hint={hint}>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-warm-300 bg-white cursor-pointer has-[:checked]:border-sage-500 has-[:checked]:bg-sage-50 has-[:checked]:text-sage-700 transition-all text-sm text-warm-700">
            <input
              {...register(name)}
              type="radio"
              value={opt}
              className="sr-only"
            />
            {opt}
          </label>
        ))}
      </div>
    </FieldWrapper>
  )
}

// ─── YesNoField ───────────────────────────────────────────────────────────────
export function YesNoField({ name, label, hint }: {
  name: string
  label: string
  hint?: string
}) {
  return <RadioGroupField name={name} label={label} options={['Yes', 'No']} hint={hint} />
}

// ─── CheckboxGroupField ───────────────────────────────────────────────────────
export function CheckboxGroupField({ name, label, options, hint }: {
  name: string
  label: string
  options: string[]
  hint?: string
}) {
  const { control } = useFormContext()
  return (
    <FieldWrapper label={label} name={name} hint={hint}>
      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <div className="flex flex-wrap gap-2">
            {options.map(opt => {
              const checked = (field.value as string[]).includes(opt)
              return (
                <label key={opt} className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-full border cursor-pointer transition-all text-sm',
                  checked
                    ? 'border-sage-500 bg-sage-50 text-sage-700'
                    : 'border-warm-300 bg-white text-warm-700'
                )}>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={e => {
                      const current = field.value as string[]
                      field.onChange(
                        e.target.checked ? [...current, opt] : current.filter(v => v !== opt)
                      )
                    }}
                  />
                  {opt}
                </label>
              )
            })}
          </div>
        )}
      />
    </FieldWrapper>
  )
}

// ─── CheckboxField (single) ────────────────────────────────────────────────────
export function CheckboxField({ name, label, hint }: {
  name: string
  label: string
  hint?: string
}) {
  const { register } = useFormContext()
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <input
        {...register(name)}
        type="checkbox"
        className="mt-0.5 w-5 h-5 rounded border border-warm-300 accent-sage-600 flex-shrink-0"
      />
      <span className="text-sm text-warm-700 leading-relaxed">{label}</span>
    </label>
  )
}

// ─── ConditionalField ─────────────────────────────────────────────────────────
// Renders children only when a watched field equals a trigger value
export function ConditionalField({ watchField, triggerValue, children }: {
  watchField: string
  triggerValue: string
  children: React.ReactNode
}) {
  const { watch } = useFormContext()
  const watched = watch(watchField)
  if (watched !== triggerValue) return null
  return <div className="animate-in fade-in slide-in-from-top-1 duration-200">{children}</div>
}

// ─── SectionTitle ─────────────────────────────────────────────────────────────
export function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <div className="h-px flex-1 bg-warm-200" />
      <span className="text-xs font-semibold tracking-widest uppercase text-warm-400 shrink-0">{title}</span>
      <div className="h-px flex-1 bg-warm-200" />
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/ui/form-primitives.tsx
git commit -m "feat(questionnaire): add shared form UI primitives"
```

---

### Task 4: Create the Wizard Shell

**Files:**
- Create: `src/app/questionnaire/QuestionnaireWizard.tsx`

This is the core Client Component. It owns all form state via `useForm` + `FormProvider`, manages step index, validates per-step on "Continue", and POSTs to `/api/questionnaire` on final submit.

**Step 1: Create `src/app/questionnaire/QuestionnaireWizard.tsx`**

```typescript
'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
  { title: 'Personal Information',       component: Step1Personal },
  { title: 'Body Metrics',              component: Step2Metrics },
  { title: 'Ergonomics',                component: Step3Ergonomics },
  { title: 'Medical History',           component: Step4Medical },
  { title: 'Chronic Medication',        component: Step5Medication },
  { title: 'Surgical History',          component: Step6Surgical },
  { title: 'Stress & Well-being',       component: Step7Stress },
  { title: 'Screening',                 component: Step8Screening },
  { title: 'Family History',            component: Step9Family },
  { title: 'Consent & Indemnity',       component: Step10Consent },
]

interface Props {
  bookingUid?: string
}

export function QuestionnaireWizard({ bookingUid }: Props) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = back
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

  const handleNext = async () => {
    const schema = stepSchemas[currentStep]
    const allValues = methods.getValues()
    const parsed = schema.safeParse(allValues)
    if (!parsed.success) {
      // Trigger validation display via RHF trigger
      const fieldNames = Object.keys(parsed.error.formErrors.fieldErrors ?? {})
      await methods.trigger(fieldNames as (keyof FullFormData)[])
      return
    }
    setDirection(1)
    setCurrentStep(prev => prev + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    setDirection(-1)
    setCurrentStep(prev => prev - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    // Validate final step first
    const schema = stepSchemas[currentStep]
    const allValues = methods.getValues()
    const finalParsed = schema.safeParse(allValues)
    if (!finalParsed.success) {
      const fieldNames = Object.keys(finalParsed.error.formErrors.fieldErrors ?? {})
      await methods.trigger(fieldNames as (keyof FullFormData)[])
      return
    }

    setSubmitting(true)
    setSubmitError(null)
    try {
      const payload = {
        bookingUid: bookingUid ?? null,
        patientName: `${allValues.firstName} ${allValues.lastName}`,
        patientEmail: allValues.email,
        data: allValues,
      }
      const res = await fetch('/api/questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error((err as { error?: string }).error ?? 'Submission failed')
      }
      router.push('/questionnaire/confirmed')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  const progressPct = ((currentStep + 1) / STEPS.length) * 100

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
  }

  return (
    <FormProvider {...methods}>
      <div className="max-w-3xl mx-auto px-6 lg:px-8 pb-24">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold tracking-widest uppercase text-warm-400">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <span className="text-xs font-medium text-warm-600">{STEPS[currentStep].title}</span>
          </div>
          <div className="h-1.5 w-full bg-warm-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-sage-500 rounded-full"
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="bg-white border border-warm-200 rounded-2xl p-6 lg:p-8 shadow-sm">
              <h2 className="text-xl font-display font-semibold text-warm-900 mb-6">
                {STEPS[currentStep].title}
              </h2>
              <StepComponent />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Error banner */}
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
              {submitting ? (
                <><Loader2 size={16} className="animate-spin" /> Submitting...</>
              ) : (
                <><CheckCircle2 size={16} /> Submit Questionnaire</>
              )}
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
```

**Step 2: Commit**

```bash
git add src/app/questionnaire/QuestionnaireWizard.tsx
git commit -m "feat(questionnaire): add multi-step wizard shell"
```

---

### Task 5: Create Steps 1–5

**Files:**
- Create: `src/app/questionnaire/steps/Step1Personal.tsx`
- Create: `src/app/questionnaire/steps/Step2Metrics.tsx`
- Create: `src/app/questionnaire/steps/Step3Ergonomics.tsx`
- Create: `src/app/questionnaire/steps/Step4Medical.tsx`
- Create: `src/app/questionnaire/steps/Step5Medication.tsx`

**Step 1: Create `src/app/questionnaire/steps/Step1Personal.tsx`**

```typescript
import { TextField, RadioGroupField, ConditionalField } from '@/components/ui/form-primitives'

export function Step1Personal() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <TextField name="firstName" label="First Name" placeholder="Jane" />
        <TextField name="lastName" label="Last Name" placeholder="Smith" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <TextField name="age" label="Age" placeholder="35" />
        <RadioGroupField name="gender" label="Gender" options={['Male', 'Female', 'N/A']} />
      </div>
      <RadioGroupField name="race" label="Race" options={['Black', 'White', 'Coloured', 'Indian', 'Other']} />
      <TextField name="email" label="Email Address" placeholder="jane@example.com" type="email" />
      <TextField name="emailConfirm" label="Confirm Email Address" placeholder="jane@example.com" type="email" />
      <RadioGroupField
        name="education"
        label="Highest Level of Education"
        options={['Matric or equivalent', 'Undergraduate and beyond', 'Other']}
      />
      <RadioGroupField name="medicalAid" label="Do you have Medical Aid?" options={['Yes', 'No']} />
      <ConditionalField watchField="medicalAid" triggerValue="Yes">
        <TextField name="medicalAidNumber" label="Medical Aid Number" placeholder="MA-123456" />
      </ConditionalField>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <TextField name="streetAddress" label="Street Address" placeholder="12 Oak Avenue" />
        <TextField name="city" label="City" placeholder="Cape Town" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <TextField name="province" label="Province" placeholder="Western Cape" />
        <TextField name="postalCode" label="Postal Code" placeholder="8001" />
      </div>
      <TextField name="phone" label="Phone Number" placeholder="082-555-0123" />
      <TextField name="gpName" label="Name of GP" placeholder="Dr. Smith" />
    </div>
  )
}
```

**Step 2: Create `src/app/questionnaire/steps/Step2Metrics.tsx`**

```typescript
import { TextField, RadioGroupField, YesNoField, ConditionalField } from '@/components/ui/form-primitives'

export function Step2Metrics() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <TextField name="currentWeight" label="Current Weight (kg)" placeholder="70" />
        <TextField name="currentHeight" label="Current Height (cm)" placeholder="165" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <TextField name="waistCircumference" label="Waist Circumference (cm)" placeholder="80" />
        <TextField name="goalWeight" label="Goal Weight (kg)" placeholder="65" />
      </div>
      <YesNoField name="weightChangedOver5kg" label="Has your weight changed by more than 5kg in the last year?" />
      <ConditionalField watchField="weightChangedOver5kg" triggerValue="Yes">
        <TextField name="weightChangeAmount" label="By how much did your weight change?" placeholder="e.g. 8kg" />
      </ConditionalField>
      <TextField name="bloodGroup" label="Blood Group (if known)" placeholder="e.g. O+" hint="Leave blank if unknown" />
      <TextField name="lastBloodWorkDate" label="Date of Last Blood Work" type="date" />
      <RadioGroupField name="bloodLab" label="Lab Where Blood Work Was Done" options={['Lancet', 'Ampath', 'Other']} />
      <YesNoField name="consentBloodAccess" label="Do you consent to Dr. Adonis accessing your blood work results?" />
    </div>
  )
}
```

**Step 3: Create `src/app/questionnaire/steps/Step3Ergonomics.tsx`**

```typescript
import { YesNoField } from '@/components/ui/form-primitives'

const fields: { name: string; label: string }[] = [
  { name: 'badPosture',         label: 'Do you have bad posture?' },
  { name: 'backPain',           label: 'Do you experience back pain?' },
  { name: 'painWhenWalking',    label: 'Do you experience pain when walking?' },
  { name: 'hipPain',            label: 'Do you experience hip pain?' },
  { name: 'headaches',          label: 'Do you suffer from headaches?' },
  { name: 'workAtDesk',         label: 'Do you work at a desk?' },
  { name: 'laptopOnLap',        label: 'Do you sit with a laptop on your lap?' },
  { name: 'mobileOver6hrs',     label: 'Do you use a mobile device for more than 6 hours a day?' },
  { name: 'troubleConcentrating', label: 'Do you have trouble concentrating for long periods?' },
]

export function Step3Ergonomics() {
  return (
    <div className="space-y-5">
      {fields.map(f => (
        <YesNoField key={f.name} name={f.name} label={f.label} />
      ))}
    </div>
  )
}
```

**Step 4: Create `src/app/questionnaire/steps/Step4Medical.tsx`**

```typescript
import {
  YesNoField, RadioGroupField, TextField, TextareaField,
  ConditionalField, SectionDivider
} from '@/components/ui/form-primitives'

export function Step4Medical() {
  return (
    <div className="space-y-5">
      <SectionDivider title="Diagnosed Conditions" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <YesNoField name="diabetes" label="Diabetes?" />
        <YesNoField name="hypertension" label="Hypertension?" />
        <YesNoField name="cardiacDisease" label="Cardiac Disease?" />
        <YesNoField name="asthma" label="Asthma?" />
        <YesNoField name="stroke" label="Stroke?" />
        <YesNoField name="urinaryTractDisease" label="Urinary Tract Disease?" />
      </div>

      <SectionDivider title="Other Conditions" />
      <TextField name="otherRespiratoryDisease" label="Other Respiratory Disease" placeholder="State 'No' if not applicable" />
      <TextField name="mentalHealthDisease" label="Mental Health Disease" placeholder="State 'No' if not applicable" />
      <TextField name="seizures" label="Seizures" placeholder="State 'No' if not applicable" />
      <TextField name="thyroidDisease" label="Thyroid Disease" placeholder="State 'No' if not applicable" />
      <TextField name="allergies" label="Allergies" placeholder="State 'No' if not applicable" />
      <TextField name="skinAllergies" label="Skin Allergies / Sensitivity" placeholder="State 'No' if not applicable" />
      <TextField name="adverseAllergyReaction" label="Adverse Reaction to Allergy Medications" placeholder="State 'No' if not applicable" />
      <TextField name="autoimmuneDisease" label="Autoimmune Disease" placeholder="State 'No' if not applicable" />

      <SectionDivider title="Reproductive Health" />
      <YesNoField name="pregnantOrBreastfeeding" label="Currently Pregnant or Breastfeeding?" />
      <YesNoField name="menopausal" label="Menopausal?" />
      <RadioGroupField
        name="menstrualPeriods"
        label="Menstrual Periods"
        options={['Regular', 'Heavy', 'Painful']}
      />

      <SectionDivider title="COVID-19" />
      <YesNoField name="hadCovid" label="Have you had COVID-19?" />
      <ConditionalField watchField="hadCovid" triggerValue="Yes">
        <div className="space-y-5">
          <TextField name="covidDate" label="Date of COVID-19" type="date" />
          <TextField name="longCovidSymptoms" label="Long-term COVID symptoms" placeholder="State 'No' if not applicable" />
        </div>
      </ConditionalField>
      <RadioGroupField
        name="covidVaccinationStatus"
        label="COVID-19 Vaccination Status"
        options={['Vaccinated', 'Not Vaccinated', 'Prefer not to say']}
      />
      <TextField name="otherChronicIllnesses" label="Other Chronic Illnesses" placeholder="State 'No' if not applicable" />
    </div>
  )
}
```

**Step 5: Create `src/app/questionnaire/steps/Step5Medication.tsx`**

```typescript
import { TextareaField } from '@/components/ui/form-primitives'

export function Step5Medication() {
  return (
    <div className="space-y-5">
      <p className="text-sm text-warm-500 leading-relaxed">
        Please list all medications you are currently taking, including dosage and frequency.
      </p>
      <TextareaField
        name="currentMedications"
        label="Current Medications and Dosage"
        rows={6}
        placeholder={"e.g. Metformin 500mg twice daily\nState 'No' if not applicable"}
      />
    </div>
  )
}
```

**Step 6: Commit steps 1–5**

```bash
git add src/app/questionnaire/steps/
git commit -m "feat(questionnaire): add steps 1–5"
```

---

### Task 6: Create Steps 6–10

**Files:**
- Create: `src/app/questionnaire/steps/Step6Surgical.tsx`
- Create: `src/app/questionnaire/steps/Step7Stress.tsx`
- Create: `src/app/questionnaire/steps/Step8Screening.tsx`
- Create: `src/app/questionnaire/steps/Step9Family.tsx`
- Create: `src/app/questionnaire/steps/Step10Consent.tsx`

**Step 1: Create `src/app/questionnaire/steps/Step6Surgical.tsx`**

```typescript
import { TextareaField } from '@/components/ui/form-primitives'

export function Step6Surgical() {
  return (
    <div className="space-y-5">
      <p className="text-sm text-warm-500 leading-relaxed">
        Please list any surgeries you have had, including the approximate date and procedure.
      </p>
      <TextareaField
        name="surgicalHistory"
        label="Surgical History"
        rows={6}
        placeholder={"e.g. 2018 — Appendectomy\nState 'No' if not applicable"}
      />
    </div>
  )
}
```

**Step 2: Create `src/app/questionnaire/steps/Step7Stress.tsx`**

```typescript
import {
  CheckboxGroupField, YesNoField, TextField, ConditionalField
} from '@/components/ui/form-primitives'

export function Step7Stress() {
  return (
    <div className="space-y-5">
      <CheckboxGroupField
        name="stressProfile"
        label="How would you describe your stress profile? (Select all that apply)"
        options={['Anxious', 'Calm', 'Impulsive', 'Overly stressed', 'Reckless']}
      />
      <YesNoField name="smokes" label="Do you smoke?" />
      <ConditionalField watchField="smokes" triggerValue="Yes">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <TextField name="smokingDuration" label="How long have you been smoking?" placeholder="e.g. 5 years" />
          <TextField name="smokingPerDay" label="How many cigarettes per day?" placeholder="e.g. 10" />
        </div>
      </ConditionalField>
      <YesNoField name="drinksOver3xWeek" label="Do you drink alcohol more than 3 times per week?" />
      <ConditionalField watchField="drinksOver3xWeek" triggerValue="Yes">
        <TextField name="drinkType" label="What type of alcohol do you drink?" placeholder="e.g. Wine, Beer" />
      </ConditionalField>
      <YesNoField name="recreationalDrugs" label="Do you use recreational drugs?" />
      <YesNoField name="exercisesDaily" label="Do you exercise for at least 30 minutes per day?" />
      <ConditionalField watchField="exercisesDaily" triggerValue="Yes">
        <TextField name="exerciseType" label="What type of exercise?" placeholder="e.g. Running, yoga" />
      </ConditionalField>
      <YesNoField name="healthyDiet" label="Do you eat a healthy, balanced diet?" />
    </div>
  )
}
```

**Step 3: Create `src/app/questionnaire/steps/Step8Screening.tsx`**

```typescript
import { CheckboxField, TextField } from '@/components/ui/form-primitives'

const screeningTests = [
  { name: 'screeningFullBloodCount', label: 'Full Blood Count' },
  { name: 'screeningLiverFunction',  label: 'Liver Function' },
  { name: 'screeningKidneyFunction', label: 'Kidney Function' },
  { name: 'screeningThyroidFunction',label: 'Thyroid Function' },
  { name: 'screeningECG',            label: 'ECG (Heart Tracing)' },
  { name: 'screeningLungFunction',   label: 'Lung Function' },
  { name: 'screeningPapSmear',       label: 'Pap Smear (females)' },
  { name: 'screeningMammogram',      label: 'Mammogram (females)' },
  { name: 'screeningGeneticTesting', label: 'Genetic Testing' },
  { name: 'screeningGastroscopy',    label: 'Gastroscopy / Colonoscopy' },
]

export function Step8Screening() {
  return (
    <div className="space-y-5">
      <p className="text-sm text-warm-500 leading-relaxed">
        Please tick all the screening tests you have had done previously.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {screeningTests.map(t => (
          <CheckboxField key={t.name} name={t.name} label={t.label} />
        ))}
      </div>
      <TextField
        name="otherMedicalTests"
        label="Other Medical Tests"
        placeholder="List any other tests you have had"
        hint="Leave blank if none"
      />
    </div>
  )
}
```

**Step 4: Create `src/app/questionnaire/steps/Step9Family.tsx`**

```typescript
import { YesNoField, TextField } from '@/components/ui/form-primitives'

const familyFields: { name: string; label: string }[] = [
  { name: 'familyHypertension',      label: 'Hypertension' },
  { name: 'familyDiabetes',          label: 'Diabetes' },
  { name: 'familySeizures',          label: 'Seizures / Epilepsy' },
  { name: 'familyHeartDisease',      label: 'Heart Disease / Attack / Stroke / Bypass' },
  { name: 'familyAutoimmuneDisease', label: 'Autoimmune Disease' },
  { name: 'familyKidneyDisorders',   label: 'Kidney Disorders' },
  { name: 'familyAlzheimers',        label: "Alzheimer's Disease" },
  { name: 'familyHighCholesterol',   label: 'High Cholesterol' },
]

export function Step9Family() {
  return (
    <div className="space-y-5">
      <p className="text-sm text-warm-500">
        Has any immediate family member been diagnosed with any of the following?
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {familyFields.map(f => (
          <YesNoField key={f.name} name={f.name} label={f.label} />
        ))}
      </div>
      <TextField
        name="familyCancer"
        label="Any Cancer? Please specify"
        placeholder="e.g. Breast cancer (mother). State 'No' if not applicable."
      />
    </div>
  )
}
```

**Step 5: Create `src/app/questionnaire/steps/Step10Consent.tsx`**

```typescript
import { RadioGroupField } from '@/components/ui/form-primitives'
import { useFormContext, Controller } from 'react-hook-form'

export function Step10Consent() {
  const { control, formState: { errors } } = useFormContext()
  return (
    <div className="space-y-7">
      {/* Research Consent */}
      <RadioGroupField
        name="consentResearch"
        label="Research Consent"
        options={['agree', 'disagree']}
        hint="I agree/do not agree that my anonymised results may be used for research purposes."
      />

      {/* POPI */}
      <RadioGroupField
        name="consentPOPI"
        label="POPI Act Compliance"
        options={['agree', 'disagree']}
        hint="I agree to the collection and processing of my personal information under the Protection of Personal Information Act (POPIA)."
      />

      {/* Indemnity */}
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-warm-800">Indemnity</p>
        <div className="rounded-xl border border-warm-200 bg-warm-50 p-4 text-xs text-warm-600 leading-relaxed mb-3">
          I, the undersigned, hereby indemnify Dr. Leegale Adonis and Aliento Health & Wellness against any claims, 
          demands, actions or proceedings arising from the consultation and/or wellness program, 
          except in cases of gross negligence. I confirm that the information provided in this questionnaire 
          is accurate and complete to the best of my knowledge.
        </div>
        <Controller
          name="consentIndemnity"
          control={control}
          render={({ field }) => (
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!field.value}
                onChange={e => field.onChange(e.target.checked)}
                className="mt-0.5 w-5 h-5 rounded border border-warm-300 accent-sage-600 flex-shrink-0"
              />
              <span className="text-sm text-warm-700">
                I accept the indemnity terms as outlined above
              </span>
            </label>
          )}
        />
        {errors.consentIndemnity && (
          <p className="text-xs text-red-600">You must accept the indemnity to proceed.</p>
        )}
      </div>
    </div>
  )
}
```

**Step 6: Commit steps 6–10**

```bash
git add src/app/questionnaire/steps/
git commit -m "feat(questionnaire): add steps 6–10"
```

---

### Task 7: Update `src/app/questionnaire/page.tsx`

Replace the JotForm iframe section with the `QuestionnaireWizard`. Keep the header section intact.

**Files:**
- Modify: `src/app/questionnaire/page.tsx`

**Step 1: Replace the JotForm form section**

The existing file has two `<section>` elements. Keep the header `<section>` exactly as-is. Replace the second `<section>` (the JotForm section, lines 85–135) with:

```typescript
import { QuestionnaireWizard } from './QuestionnaireWizard'
// ... (add this import at top of file)

// Replace second <section> with:
<section className="pb-20 lg:pb-28 pt-4">
  <QuestionnaireWizard bookingUid={undefined} />
</section>
```

Since `page.tsx` is a Server Component, it needs to read `bookingUid` from `searchParams`. Update the full component signature to:

```typescript
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Shield, Clock } from 'lucide-react'
import { QuestionnaireWizard } from './QuestionnaireWizard'

export const metadata: Metadata = {
  title: 'Health Questionnaire | Aliento',
  description:
    'Complete your pre-consultation health questionnaire. Your information is protected by doctor-patient confidentiality.',
}

export default async function QuestionnairePage({
  searchParams,
}: {
  searchParams: Promise<{ bookingUid?: string }>
}) {
  const { bookingUid } = await searchParams

  return (
    <div className="bg-cream-100 min-h-screen">
      {/* Header — keep existing header JSX from lines 22–83 exactly as-is */}
      
      {/* Wizard */}
      <section className="pb-20 lg:pb-28 pt-4">
        <QuestionnaireWizard bookingUid={bookingUid} />
      </section>
    </div>
  )
}
```

> **Note:** Keep all the header JSX (the `<section>` with ArrowLeft, Shield icon, heading etc.) unchanged. Only replace the second `<section>` that contains the JotForm iframe.

**Step 2: Commit**

```bash
git add src/app/questionnaire/page.tsx
git commit -m "feat(questionnaire): replace JotForm with custom wizard"
```

---

### Task 8: Create the Confirmation Page

**Files:**
- Create: `src/app/questionnaire/confirmed/page.tsx`

**Step 1: Create `src/app/questionnaire/confirmed/page.tsx`**

```typescript
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Questionnaire Submitted | Aliento',
}

export default function QuestionnaireConfirmedPage() {
  return (
    <main className="min-h-screen bg-cream-100 flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full bg-white border border-warm-200 rounded-3xl p-10 text-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={32} className="text-sage-600" />
        </div>
        <h1 className="text-2xl font-display font-semibold text-warm-900 mb-3">
          Thank you!
        </h1>
        <p className="text-warm-500 leading-relaxed mb-8">
          Your health questionnaire has been received. Dr. Adonis will review your responses
          before your consultation.
        </p>
        <Link
          href="/consult"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sage-600 text-white text-sm font-semibold hover:bg-sage-700 transition-all"
        >
          Back to Consultations
        </Link>
      </div>
    </main>
  )
}
```

**Step 2: Commit**

```bash
git add src/app/questionnaire/confirmed/
git commit -m "feat(questionnaire): add submission confirmation page"
```

---

### Task 9: Create the API Route

**Files:**
- Create: `src/app/api/questionnaire/route.ts`

This API route receives the full form data, inserts into the `questionnaires` DB table, and sends an email to Dr. Adonis via Resend.

**Step 1: Create `src/app/api/questionnaire/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { questionnaires } from '@/db/schema'
import { sendEmail } from '@/lib/email'

function buildEmailHtml(patientName: string, bookingUid: string | null, data: Record<string, unknown>): string {
  const row = (label: string, value: unknown) => {
    const display = Array.isArray(value) ? value.join(', ') : String(value ?? '—')
    return `<tr><td style="padding:6px 12px;border-bottom:1px solid #f0ede8;color:#6b6560;font-size:13px;width:45%">${label}</td><td style="padding:6px 12px;border-bottom:1px solid #f0ede8;color:#1c1917;font-size:13px">${display}</td></tr>`
  }
  const section = (title: string, rows: string) => `
    <h3 style="margin:24px 0 8px;font-size:14px;font-weight:600;color:#3f6754;text-transform:uppercase;letter-spacing:0.08em">${title}</h3>
    <table style="width:100%;border-collapse:collapse;background:#fafaf8;border-radius:8px;overflow:hidden">${rows}</table>`

  return `
<!DOCTYPE html>
<html>
<body style="font-family:Inter,sans-serif;background:#fff;color:#1c1917;padding:24px;max-width:640px;margin:0 auto">
  <h2 style="color:#3f6754;margin-bottom:4px">New Questionnaire Submission</h2>
  <p style="color:#6b6560;font-size:14px;margin-top:0">Patient: <strong>${patientName}</strong>${bookingUid ? ` · Booking: <code>${bookingUid}</code>` : ''}</p>
  ${section('Personal Information', [
    row('Name', patientName),
    row('Email', data.email),
    row('Age', data.age),
    row('Gender', data.gender),
    row('Race', data.race),
    row('Education', data.education),
    row('Medical Aid', data.medicalAid),
    row('Medical Aid Number', data.medicalAidNumber),
    row('Address', [data.streetAddress, data.city, data.province, data.postalCode].filter(Boolean).join(', ')),
    row('Phone', data.phone),
    row('GP', data.gpName),
  ].join(''))}
  ${section('Body Metrics', [
    row('Weight', `${data.currentWeight} kg`),
    row('Height', `${data.currentHeight} cm`),
    row('Waist', `${data.waistCircumference} cm`),
    row('Goal Weight', `${data.goalWeight} kg`),
    row('Weight change >5kg', data.weightChangedOver5kg),
    row('Change amount', data.weightChangeAmount),
    row('Blood Group', data.bloodGroup),
    row('Last Blood Work', data.lastBloodWorkDate),
    row('Lab', data.bloodLab),
    row('Blood Access Consent', data.consentBloodAccess),
  ].join(''))}
  ${section('Ergonomics', [
    row('Bad posture', data.badPosture), row('Back pain', data.backPain),
    row('Pain when walking', data.painWhenWalking), row('Hip pain', data.hipPain),
    row('Headaches', data.headaches), row('Works at desk', data.workAtDesk),
    row('Laptop on lap', data.laptopOnLap), row('Mobile >6hrs/day', data.mobileOver6hrs),
    row('Trouble concentrating', data.troubleConcentrating),
  ].join(''))}
  ${section('Medical History', [
    row('Diabetes', data.diabetes), row('Hypertension', data.hypertension),
    row('Cardiac Disease', data.cardiacDisease), row('Asthma', data.asthma),
    row('Stroke', data.stroke), row('Urinary Tract Disease', data.urinaryTractDisease),
    row('Other Respiratory', data.otherRespiratoryDisease),
    row('Mental Health', data.mentalHealthDisease),
    row('Seizures', data.seizures), row('Thyroid', data.thyroidDisease),
    row('Allergies', data.allergies), row('Skin Allergies', data.skinAllergies),
    row('Adverse Allergy Rx', data.adverseAllergyReaction),
    row('Autoimmune', data.autoimmuneDisease),
    row('Pregnant/Breastfeeding', data.pregnantOrBreastfeeding),
    row('Menopausal', data.menopausal), row('Menstrual Periods', data.menstrualPeriods),
    row('Had COVID', data.hadCovid), row('COVID Date', data.covidDate),
    row('Long COVID', data.longCovidSymptoms),
    row('COVID Vaccination', data.covidVaccinationStatus),
    row('Other Chronic', data.otherChronicIllnesses),
  ].join(''))}
  ${section('Chronic Medication', [row('Medications', data.currentMedications)].join(''))}
  ${section('Surgical History', [row('Surgeries', data.surgicalHistory)].join(''))}
  ${section('Stress & Lifestyle', [
    row('Stress Profile', data.stressProfile),
    row('Smokes', data.smokes), row('Smoking Duration', data.smokingDuration),
    row('Cigarettes/day', data.smokingPerDay),
    row('Drinks >3x/week', data.drinksOver3xWeek), row('Drink Type', data.drinkType),
    row('Recreational Drugs', data.recreationalDrugs),
    row('Exercises Daily', data.exercisesDaily), row('Exercise Type', data.exerciseType),
    row('Healthy Diet', data.healthyDiet),
  ].join(''))}
  ${section('Screening Tests Done', [
    row('Full Blood Count', data.screeningFullBloodCount ? 'Yes' : 'No'),
    row('Liver Function', data.screeningLiverFunction ? 'Yes' : 'No'),
    row('Kidney Function', data.screeningKidneyFunction ? 'Yes' : 'No'),
    row('Thyroid Function', data.screeningThyroidFunction ? 'Yes' : 'No'),
    row('ECG', data.screeningECG ? 'Yes' : 'No'),
    row('Lung Function', data.screeningLungFunction ? 'Yes' : 'No'),
    row('Pap Smear', data.screeningPapSmear ? 'Yes' : 'No'),
    row('Mammogram', data.screeningMammogram ? 'Yes' : 'No'),
    row('Genetic Testing', data.screeningGeneticTesting ? 'Yes' : 'No'),
    row('Gastroscopy/Colonoscopy', data.screeningGastroscopy ? 'Yes' : 'No'),
    row('Other Tests', data.otherMedicalTests),
  ].join(''))}
  ${section('Family History', [
    row('Hypertension', data.familyHypertension), row('Diabetes', data.familyDiabetes),
    row('Seizures', data.familySeizures), row('Heart Disease', data.familyHeartDisease),
    row('Autoimmune', data.familyAutoimmuneDisease), row('Kidney', data.familyKidneyDisorders),
    row("Alzheimer's", data.familyAlzheimers), row('High Cholesterol', data.familyHighCholesterol),
    row('Cancer', data.familyCancer),
  ].join(''))}
  ${section('Consent', [
    row('Research Consent', data.consentResearch),
    row('POPI Compliance', data.consentPOPI),
    row('Indemnity Accepted', data.consentIndemnity ? 'Yes' : 'No'),
  ].join(''))}
  <p style="margin-top:24px;font-size:12px;color:#a8a29e">Submitted at ${new Date().toLocaleString('en-ZA')}</p>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { bookingUid, patientName, patientEmail, data } = body as {
      bookingUid: string | null
      patientName: string
      patientEmail: string
      data: Record<string, unknown>
    }

    if (!patientName || !patientEmail || !data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const id = `q-${crypto.randomUUID()}`

    await db.insert(questionnaires).values({
      id,
      patientName,
      patientEmail,
      rawData: JSON.stringify({ bookingUid, ...data }),
    })

    await sendEmail({
      purpose: 'questionnaire',
      subject: `New Questionnaire: ${patientName}`,
      html: buildEmailHtml(patientName, bookingUid, data),
      replyTo: patientEmail,
    }).catch(err => console.error('[Questionnaire] Email send failed (non-fatal):', err))

    return NextResponse.json({ success: true, id })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error'
    console.error('[Questionnaire API]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
```

**Step 2: Verify the `questionnaires` table exists in the DB**

If the table hasn't been pushed to Neon yet, run:

```bash
npx drizzle-kit push
```

This applies the `questionnaires` table from `src/db/schema.ts` to the Neon database. Requires `DATABASE_URL` in `.env.local`.

**Step 3: Commit**

```bash
git add src/app/api/questionnaire/route.ts
git commit -m "feat(questionnaire): add API route with DB insert and Resend email"
```

---

### Task 10: Lint and Build Verification

**Step 1: Run lint**

```bash
npm run lint
```

Expected: No errors (warnings acceptable). Fix any TypeScript errors before proceeding.

**Step 2: Run production build**

```bash
npm run build
```

Expected: Build succeeds. If there are TypeScript or import errors, fix them (most likely missing `'use client'` directives or wrong import paths).

**Step 3: Common fixes if build fails**

- If `zodResolver` import errors → try `import { zodResolver } from '@hookform/resolvers/zod-v4'`
- If Framer Motion AnimatePresence errors → try `import { motion, AnimatePresence } from 'motion/react'`
- If `crypto.randomUUID` type errors → add `/// <reference lib="dom" />` or use `require('crypto').randomUUID()`

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat(questionnaire): full custom multi-step wizard implementation"
```

---

## Summary of Files Created / Modified

| File | Action |
|---|---|
| `package.json` | Modified (new deps) |
| `src/app/questionnaire/schema.ts` | Created |
| `src/app/questionnaire/types.ts` | Created |
| `src/components/ui/form-primitives.tsx` | Created |
| `src/app/questionnaire/QuestionnaireWizard.tsx` | Created |
| `src/app/questionnaire/steps/Step1Personal.tsx` | Created |
| `src/app/questionnaire/steps/Step2Metrics.tsx` | Created |
| `src/app/questionnaire/steps/Step3Ergonomics.tsx` | Created |
| `src/app/questionnaire/steps/Step4Medical.tsx` | Created |
| `src/app/questionnaire/steps/Step5Medication.tsx` | Created |
| `src/app/questionnaire/steps/Step6Surgical.tsx` | Created |
| `src/app/questionnaire/steps/Step7Stress.tsx` | Created |
| `src/app/questionnaire/steps/Step8Screening.tsx` | Created |
| `src/app/questionnaire/steps/Step9Family.tsx` | Created |
| `src/app/questionnaire/steps/Step10Consent.tsx` | Created |
| `src/app/questionnaire/page.tsx` | Modified |
| `src/app/questionnaire/confirmed/page.tsx` | Created |
| `src/app/api/questionnaire/route.ts` | Created |
