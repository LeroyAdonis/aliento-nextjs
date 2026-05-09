'use client'

import {
  TextField, RadioGroupField, SectionDivider, ConditionalField,
} from '@/components/ui/form-primitives'

export function Step1Personal() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField name="firstName" label="First Name" placeholder="Jane" />
        <TextField name="lastName" label="Last Name" placeholder="Smith" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField name="age" label="Age" placeholder="35" type="number" />
        <RadioGroupField name="gender" label="Gender" options={['Male', 'Female', 'N/A']} />
      </div>
      <TextField 
        name="idNumber" 
        label="South African ID Number" 
        placeholder="13-digit ID number (e.g., 8001015009087)" 
        maxLength={13}
      />
      <RadioGroupField
        name="race"
        label="Race / Ethnicity"
        options={['Black', 'White', 'Coloured', 'Indian', 'Other']}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField name="email" label="Email Address" type="email" placeholder="jane@example.com" />
        <TextField name="emailConfirm" label="Confirm Email" type="email" placeholder="jane@example.com" />
      </div>
      <RadioGroupField
        name="education"
        label="Highest Education Level"
        options={['Matric or equivalent', 'Undergraduate and beyond', 'Other']}
      />

      <SectionDivider title="Medical Aid" />
      <RadioGroupField name="medicalAid" label="Do you have medical aid?" options={['Yes', 'No']} />
      <ConditionalField watchField="medicalAid" triggerValue="Yes">
        <TextField name="medicalAidNumber" label="Medical Aid Number" placeholder="Optional" />
      </ConditionalField>

      <SectionDivider title="Address" />
      <TextField name="streetAddress" label="Street Address" placeholder="123 Bloom Street" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField name="city" label="City" placeholder="Cape Town" />
        <TextField name="province" label="Province" placeholder="Western Cape" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField name="postalCode" label="Postal Code" placeholder="8001" />
        <TextField name="phone" label="Phone Number" placeholder="+27 XX XXX XXXX" />
      </div>

      <SectionDivider title="General Practitioner" />
      <TextField name="gpName" label="Your GP's Full Name" placeholder="Dr. John Doe" />
    </div>
  )
}
