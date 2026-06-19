'use client'

import { TextareaField } from '@/components/ui/form-primitives'

export function Step5Medication() {
  return (
    <div className="space-y-5">
      <p className="text-sm text-warm-500 -mt-2">
        Please provide details about any prescription medications, supplements, and
        over-the-counter medication you currently take.
      </p>
      <TextareaField
        name="currentMedications"
        label="Current medications"
        rows={4}
        placeholder="e.g. Metformin 500mg twice daily, Vitamin D3 1000IU"
      />
      <TextareaField
        name="medicationType"
        label="Types of medication"
        rows={3}
        placeholder="e.g. Blood pressure meds, antidepressants, insulin, supplements..."
      />
      <TextareaField
        name="medicationDuration"
        label="Length of time on medication"
        rows={3}
        placeholder="e.g. 2 years, since 2022, started 3 months ago..."
      />
      <TextareaField
        name="medicationSideEffects"
        label="Any side effects"
        rows={3}
        placeholder="e.g. Nausea, dizziness, dry mouth, 'None' if none..."
      />
    </div>
  )
}
