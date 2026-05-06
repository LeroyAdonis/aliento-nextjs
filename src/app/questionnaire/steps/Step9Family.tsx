'use client'

import { YesNoField, TextareaField } from '@/components/ui/form-primitives'

export function Step9Family() {
  return (
    <div className="space-y-5">
      <p className="text-sm text-warm-500 -mt-2">
        Does anyone in your immediate family (parents, siblings) have a history of the following conditions?
      </p>
      <YesNoField name="familyHypertension" label="Hypertension (High blood pressure)" />
      <YesNoField name="familyDiabetes" label="Diabetes" />
      <YesNoField name="familySeizures" label="Seizures / Epilepsy" />
      <YesNoField name="familyHeartDisease" label="Heart disease" />
      <YesNoField name="familyAutoimmuneDisease" label="Autoimmune disease" />
      <YesNoField name="familyKidneyDisorders" label="Kidney disorders" />
      <YesNoField name="familyAlzheimers" label="Alzheimer's / Dementia" />
      <YesNoField name="familyHighCholesterol" label="High cholesterol" />
      <TextareaField
        name="familyCancer"
        label="Cancer (specify type if known)"
        rows={3}
        placeholder="State 'No' if not applicable"
      />
    </div>
  )
}
