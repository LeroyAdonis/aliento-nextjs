'use client'

import {
  YesNoField, RadioGroupField, TextareaField, ConditionalField, SectionDivider,
} from '@/components/ui/form-primitives'

export function Step4Medical() {
  return (
    <div className="space-y-5">
      <SectionDivider title="Chronic Conditions" />
      <YesNoField name="diabetes" label="Diabetes" />
      <YesNoField name="hypertension" label="Hypertension (High blood pressure)" />
      <YesNoField name="cardiacDisease" label="Cardiac / Heart disease" />
      <YesNoField name="asthma" label="Asthma" />
      <YesNoField name="stroke" label="Stroke" />
      <YesNoField name="urinaryTractDisease" label="Urinary tract disease" />
      <TextareaField
        name="otherRespiratoryDisease"
        label="Other respiratory disease"
        rows={2}
        placeholder="State 'No' if not applicable"
      />
      <TextareaField
        name="mentalHealthDisease"
        label="Mental health condition"
        rows={2}
        placeholder="State 'No' if not applicable"
      />
      <TextareaField
        name="seizures"
        label="Seizures / Epilepsy"
        rows={2}
        placeholder="State 'No' if not applicable"
      />
      <TextareaField
        name="thyroidDisease"
        label="Thyroid disease"
        rows={2}
        placeholder="State 'No' if not applicable"
      />

      <SectionDivider title="Allergies" />
      <TextareaField
        name="allergies"
        label="Known allergies"
        rows={2}
        placeholder="State 'No' if not applicable"
      />
      <TextareaField
        name="skinAllergies"
        label="Skin allergies"
        rows={2}
        placeholder="State 'No' if not applicable"
      />
      <TextareaField
        name="adverseAllergyReaction"
        label="Adverse allergic reaction in the past"
        rows={2}
        placeholder="State 'No' if not applicable"
      />
      <TextareaField
        name="autoimmuneDisease"
        label="Autoimmune disease"
        rows={2}
        placeholder="State 'No' if not applicable"
      />

      <SectionDivider title="Reproductive Health" />
      <YesNoField name="pregnantOrBreastfeeding" label="Are you currently pregnant or breastfeeding?" />
      <YesNoField name="menopausal" label="Are you menopausal?" />
      <RadioGroupField
        name="menstrualPeriods"
        label="Menstrual periods (if applicable)"
        options={['Regular', 'Heavy', 'Painful']}
      />

      <SectionDivider title="COVID-19" />
      <YesNoField name="hadCovid" label="Have you had COVID-19?" />
      <ConditionalField watchField="hadCovid" triggerValue="Yes">
        <div className="space-y-4">
          <TextareaField
            name="covidDate"
            label="Approximate date you had COVID-19"
            rows={2}
            placeholder="e.g. March 2022"
          />
          <TextareaField
            name="longCovidSymptoms"
            label="Long COVID symptoms (if any)"
            rows={2}
            placeholder="State 'No' if not applicable"
          />
        </div>
      </ConditionalField>
      <RadioGroupField
        name="covidVaccinationStatus"
        label="COVID-19 vaccination status"
        options={['Vaccinated', 'Not Vaccinated', 'Prefer not to say']}
      />

      <SectionDivider title="Other" />
      <TextareaField
        name="otherChronicIllnesses"
        label="Other chronic illnesses not listed above"
        rows={2}
        placeholder="State 'No' if not applicable"
      />
    </div>
  )
}
