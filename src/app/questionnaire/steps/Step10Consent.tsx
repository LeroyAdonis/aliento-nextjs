'use client'

import { RadioGroupField, CheckboxField, SectionDivider } from '@/components/ui/form-primitives'

const POPI_TEXT = `By ticking 'agree', you acknowledge that your information will be stored and used in accordance with the Protection of Personal Information Act (POPIA) and will not be shared with any third parties without your consent.`

const INDEMNITY_TEXT = `I understand and accept that the information provided in this questionnaire will be used to assist Dr. Leegale Adonis in providing personalised medical and wellness care. I confirm that all information provided is accurate to the best of my knowledge. I indemnify Dr. Adonis and Aliento against any liability arising from inaccurate or incomplete information provided by me.`

export function Step10Consent() {
  return (
    <div className="space-y-6">
      <SectionDivider title="Research Consent" />
      <RadioGroupField
        name="consentResearch"
        label="Do you consent to your de-identified data being used for research purposes?"
        options={['Yes', 'No', 'Prefer not to say']}
      />

      <SectionDivider title="POPIA Compliance" />
      <div className="bg-warm-50 border border-warm-200 rounded-xl p-4">
        <p className="text-sm text-warm-700 leading-relaxed">{POPI_TEXT}</p>
      </div>
      <RadioGroupField
        name="consentPOPI"
        label="POPIA consent"
        options={['agree', 'disagree']}
      />

      <SectionDivider title="Indemnity" />
      <div className="bg-warm-50 border border-warm-200 rounded-xl p-4">
        <p className="text-sm text-warm-700 leading-relaxed">{INDEMNITY_TEXT}</p>
      </div>
      <CheckboxField
        name="consentIndemnity"
        label="I have read and accept the indemnity statement above."
      />
    </div>
  )
}
