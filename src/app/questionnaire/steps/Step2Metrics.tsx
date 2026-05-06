'use client'

import {
  TextField, RadioGroupField, ConditionalField, SectionDivider,
} from '@/components/ui/form-primitives'

export function Step2Metrics() {
  return (
    <div className="space-y-5">
      <SectionDivider title="Current Measurements" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TextField name="currentWeight" label="Current Weight (kg)" placeholder="80" />
        <TextField name="currentHeight" label="Height (cm)" placeholder="165" />
        <TextField name="waistCircumference" label="Waist Circumference (cm)" placeholder="90" />
      </div>
      <TextField name="goalWeight" label="Goal Weight (kg)" placeholder="70" />

      <SectionDivider title="Weight History" />
      <RadioGroupField
        name="weightChangedOver5kg"
        label="Has your weight changed by more than 5 kg in the past year?"
        options={['Yes', 'No']}
      />
      <ConditionalField watchField="weightChangedOver5kg" triggerValue="Yes">
        <TextField
          name="weightChangeAmount"
          label="By how much? (kg)"
          placeholder="e.g. 10 kg gained"
        />
      </ConditionalField>

      <SectionDivider title="Blood Work" />
      <TextField
        name="bloodGroup"
        label="Blood Group (if known)"
        placeholder="e.g. O+"
        hint="Leave blank if unsure"
      />
      <TextField
        name="lastBloodWorkDate"
        label="Date of Last Blood Work"
        type="date"
        hint="Leave blank if you have never had blood work done"
      />
      <RadioGroupField
        name="bloodLab"
        label="Blood laboratory used"
        options={['Lancet', 'Ampath', 'Other']}
      />
      <RadioGroupField
        name="consentBloodAccess"
        label="Do you consent to Dr. Adonis accessing your blood work?"
        options={['Yes', 'No']}
      />
    </div>
  )
}
