'use client'

import { CheckboxField, TextareaField, SectionDivider } from '@/components/ui/form-primitives'

const TESTS = [
  { name: 'screeningFullBloodCount',  label: 'Full Blood Count (FBC)' },
  { name: 'screeningLiverFunction',   label: 'Liver Function Tests (LFTs)' },
  { name: 'screeningKidneyFunction',  label: 'Kidney Function Tests' },
  { name: 'screeningThyroidFunction', label: 'Thyroid Function Tests (TSH/T4)' },
  { name: 'screeningECG',             label: 'ECG (Electrocardiogram)' },
  { name: 'screeningLungFunction',    label: 'Lung Function Tests' },
  { name: 'screeningPapSmear',        label: 'Pap Smear' },
  { name: 'screeningMammogram',       label: 'Mammogram' },
  { name: 'screeningGeneticTesting',  label: 'Genetic Testing' },
  { name: 'screeningGastroscopy',     label: 'Gastroscopy / Colonoscopy' },
]

export function Step8Screening() {
  return (
    <div className="space-y-5">
      <p className="text-sm text-warm-500 -mt-2">
        Select all screening tests you have had in the past 12 months.
      </p>
      <SectionDivider title="Select all that apply" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TESTS.map(t => (
          <CheckboxField key={t.name} name={t.name} label={t.label} />
        ))}
      </div>
      <TextareaField
        name="otherMedicalTests"
        label="Other medical tests not listed above"
        rows={3}
        placeholder="State 'No' if not applicable"
      />
    </div>
  )
}
