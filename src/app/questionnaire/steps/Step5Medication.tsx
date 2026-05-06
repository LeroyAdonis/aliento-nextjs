'use client'

import { TextareaField } from '@/components/ui/form-primitives'

export function Step5Medication() {
  return (
    <div className="space-y-5">
      <p className="text-sm text-warm-500 -mt-2">
        Please list all prescription medications, supplements, and over-the-counter medication you currently take, including the dosage if known.
      </p>
      <TextareaField
        name="currentMedications"
        label="Current medications"
        rows={8}
        placeholder={"e.g. Metformin 500mg twice daily\nVitamin D3 1000IU\n\nState 'No' if you take none."}
      />
    </div>
  )
}
