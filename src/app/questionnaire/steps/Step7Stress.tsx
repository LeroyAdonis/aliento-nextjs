'use client'

import {
  CheckboxGroupField, YesNoField, TextareaField, ConditionalField, SectionDivider,
} from '@/components/ui/form-primitives'

const STRESS_OPTIONS = ['Anxious', 'Calm', 'Impulsive', 'Overly stressed', 'Reckless']

export function Step7Stress() {
  return (
    <div className="space-y-5">
      <CheckboxGroupField
        name="stressProfile"
        label="How would you describe yourself? (select all that apply)"
        options={STRESS_OPTIONS}
      />

      <SectionDivider title="Smoking" />
      <YesNoField name="smokes" label="Do you smoke?" />
      <ConditionalField watchField="smokes" triggerValue="Yes">
        <div className="space-y-4">
          <TextareaField
            name="smokingDuration"
            label="How long have you been smoking?"
            rows={2}
            placeholder="e.g. 10 years"
          />
          <TextareaField
            name="smokingPerDay"
            label="How many cigarettes per day?"
            rows={2}
            placeholder="e.g. 5–10"
          />
        </div>
      </ConditionalField>

      <SectionDivider title="Alcohol" />
      <YesNoField name="drinksOver3xWeek" label="Do you drink alcohol more than 3 times per week?" />
      <ConditionalField watchField="drinksOver3xWeek" triggerValue="Yes">
        <TextareaField
          name="drinkType"
          label="What type of alcohol and how much?"
          rows={2}
          placeholder="e.g. 2 glasses of wine per evening"
        />
      </ConditionalField>

      <SectionDivider title="Lifestyle" />
      <YesNoField name="recreationalDrugs" label="Do you use recreational drugs?" />
      <YesNoField name="exercisesDaily" label="Do you exercise regularly (at least 3× per week)?" />
      <ConditionalField watchField="exercisesDaily" triggerValue="Yes">
        <TextareaField
          name="exerciseType"
          label="What type of exercise do you do?"
          rows={2}
          placeholder="e.g. Running, gym, yoga"
        />
      </ConditionalField>
      <YesNoField name="healthyDiet" label="Do you follow a healthy / balanced diet?" />
    </div>
  )
}
