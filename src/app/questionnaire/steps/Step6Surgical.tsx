'use client'

import { TextareaField } from '@/components/ui/form-primitives'

export function Step6Surgical() {
  return (
    <div className="space-y-5">
      <p className="text-sm text-warm-500 -mt-2">
        List any operations or surgical procedures you have had in the past, including the year if known.
      </p>
      <TextareaField
        name="surgicalHistory"
        label="Surgical / Procedure history"
        rows={8}
        placeholder={"e.g. Appendectomy – 2015\nC-section – 2019\n\nState 'No' if not applicable."}
      />
    </div>
  )
}
