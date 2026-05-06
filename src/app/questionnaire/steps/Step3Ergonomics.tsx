'use client'

import { YesNoField } from '@/components/ui/form-primitives'

export function Step3Ergonomics() {
  return (
    <div className="space-y-5">
      <p className="text-sm text-warm-500 -mt-2">
        These questions help Dr. Adonis understand your posture, pain patterns and digital habits.
      </p>
      <YesNoField name="badPosture" label="Do you have bad posture?" />
      <YesNoField name="backPain" label="Do you have back pain?" />
      <YesNoField name="painWhenWalking" label="Do you experience pain when walking?" />
      <YesNoField name="hipPain" label="Do you have hip pain?" />
      <YesNoField name="headaches" label="Do you suffer from headaches?" />
      <YesNoField name="workAtDesk" label="Do you work at a desk?" />
      <YesNoField name="laptopOnLap" label="Do you use a laptop on your lap?" />
      <YesNoField name="mobileOver6hrs" label="Do you use your mobile device for more than 6 hours per day?" />
      <YesNoField name="troubleConcentrating" label="Do you have trouble concentrating?" />
    </div>
  )
}
