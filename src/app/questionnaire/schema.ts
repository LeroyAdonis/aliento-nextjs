import { z } from 'zod'

// South African ID Number Validation (Luhn Algorithm)
const validateSAID = (idNumber: string) => {
  // Remove any spaces or dashes
  const cleaned = idNumber.replace(/\s/g, '').replace(/-/g, '')
  
  // Check if it's exactly 13 digits
  if (!/^\d{13}$/.test(cleaned)) {
    return false
  }
  
  // Luhn algorithm validation
  let sum = 0
  let alternate = false
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10)
    
    if (alternate) {
      digit *= 2
      if (digit > 9) {
        digit = Math.floor(digit / 10) + (digit % 10)
      }
    }
    
    sum += digit
    alternate = !alternate
  }
  
  return sum % 10 === 0
}

// ─── Step 1: Personal Information ────────────────────────────────────────────
export const step1Schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  age: z.string().min(1, 'Age is required'),
  gender: z.enum(['Male', 'Female', 'N/A'], { error: 'Please select a gender' }),
  race: z.enum(['Black', 'White', 'Coloured', 'Indian', 'Other'], { error: 'Please select an option' }),
  idNumber: z.string()
    .min(13, 'ID number must be exactly 13 digits')
    .max(13, 'ID number must be exactly 13 digits')
    .regex(/^\d{13}$/, 'ID number must contain only digits')
    .refine(validateSAID, { message: 'Invalid South African ID number' }),
  email: z.string().email('Valid email required'),
  emailConfirm: z.string().email('Valid email required'),
  education: z.enum(['Matric or equivalent', 'Undergraduate and beyond', 'Other'], { error: 'Please select an option' }),
  medicalAid: z.enum(['Yes', 'No'], { error: 'Please select an option' }),
  medicalAidNumber: z.string().optional(),
  streetAddress: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  province: z.string().min(1, 'Province is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  phone: z.string().min(1, 'Phone number is required'),
  gpName: z.string().min(1, "GP's name is required"),
}).refine(d => d.email === d.emailConfirm, {
  message: 'Emails must match',
  path: ['emailConfirm'],
})

// ─── Step 2: Body Metrics ─────────────────────────────────────────────────────
export const step2Schema = z.object({
  currentWeight: z.string().min(1, 'Required'),
  currentHeight: z.string().min(1, 'Required'),
  waistCircumference: z.string().min(1, 'Required'),
  goalWeight: z.string().min(1, 'Required'),
  weightChangedOver5kg: z.enum(['Yes', 'No'], { error: 'Please select an option' }),
  weightChangeAmount: z.string().optional(),
  bloodGroup: z.string().optional(),
  lastBloodWorkDate: z.string().optional(),
  bloodLab: z.enum(['Lancet', 'Ampath', 'Other']).optional(),
  consentBloodAccess: z.enum(['Yes', 'No'], { error: 'Please select an option' }),
})

// ─── Step 3: Ergonomics ───────────────────────────────────────────────────────
export const step3Schema = z.object({
  badPosture: z.enum(['Yes', 'No'], { error: 'Required' }),
  backPain: z.enum(['Yes', 'No'], { error: 'Required' }),
  painWhenWalking: z.enum(['Yes', 'No'], { error: 'Required' }),
  hipPain: z.enum(['Yes', 'No'], { error: 'Required' }),
  headaches: z.enum(['Yes', 'No'], { error: 'Required' }),
  workAtDesk: z.enum(['Yes', 'No'], { error: 'Required' }),
  laptopOnLap: z.enum(['Yes', 'No'], { error: 'Required' }),
  mobileOver6hrs: z.enum(['Yes', 'No'], { error: 'Required' }),
  troubleConcentrating: z.enum(['Yes', 'No'], { error: 'Required' }),
})

// ─── Step 4: Medical History ──────────────────────────────────────────────────
export const step4Schema = z.object({
  diabetes: z.enum(['Yes', 'No'], { error: 'Required' }),
  hypertension: z.enum(['Yes', 'No'], { error: 'Required' }),
  cardiacDisease: z.enum(['Yes', 'No'], { error: 'Required' }),
  asthma: z.enum(['Yes', 'No'], { error: 'Required' }),
  stroke: z.enum(['Yes', 'No'], { error: 'Required' }),
  urinaryTractDisease: z.enum(['Yes', 'No'], { error: 'Required' }),
  otherRespiratoryDisease: z.string().min(1, "State 'No' if not applicable"),
  mentalHealthDisease: z.string().min(1, "State 'No' if not applicable"),
  seizures: z.string().min(1, "State 'No' if not applicable"),
  thyroidDisease: z.string().min(1, "State 'No' if not applicable"),
  allergies: z.string().min(1, "State 'No' if not applicable"),
  skinAllergies: z.string().min(1, "State 'No' if not applicable"),
  adverseAllergyReaction: z.string().min(1, "State 'No' if not applicable"),
  autoimmuneDisease: z.string().min(1, "State 'No' if not applicable"),
  pregnantOrBreastfeeding: z.enum(['Yes', 'No'], { error: 'Required' }),
  menopausal: z.enum(['Yes', 'No'], { error: 'Required' }),
  menstrualPeriods: z.enum(['Regular', 'Heavy', 'Painful']).optional(),
  hadCovid: z.enum(['Yes', 'No'], { error: 'Required' }),
  covidDate: z.string().optional(),
  longCovidSymptoms: z.string().optional(),
  covidVaccinationStatus: z.enum(['Vaccinated', 'Not Vaccinated', 'Prefer not to say'], { error: 'Required' }),
  otherChronicIllnesses: z.string().optional(),
})

// ─── Step 5: Chronic Medication ───────────────────────────────────────────────
export const step5Schema = z.object({
  currentMedications: z.string().min(1, "State 'No' if not applicable"),
})

// ─── Step 6: Surgical History ─────────────────────────────────────────────────
export const step6Schema = z.object({
  surgicalHistory: z.string().min(1, "State 'No' if not applicable"),
})

// ─── Step 7: Stress & Emotional Well-being ────────────────────────────────────
export const step7Schema = z.object({
  stressProfile: z.array(z.enum(['Anxious', 'Calm', 'Impulsive', 'Overly stressed', 'Reckless'])).min(1, 'Select at least one'),
  smokes: z.enum(['Yes', 'No'], { error: 'Required' }),
  smokingDuration: z.string().optional(),
  smokingPerDay: z.string().optional(),
  drinksOver3xWeek: z.enum(['Yes', 'No'], { error: 'Required' }),
  drinkType: z.string().optional(),
  recreationalDrugs: z.enum(['Yes', 'No'], { error: 'Required' }),
  exercisesDaily: z.enum(['Yes', 'No'], { error: 'Required' }),
  exerciseType: z.string().optional(),
  healthyDiet: z.enum(['Yes', 'No'], { error: 'Required' }),
})

// ─── Step 8: Screening ────────────────────────────────────────────────────────
export const step8Schema = z.object({
  screeningFullBloodCount: z.boolean().default(false),
  screeningLiverFunction: z.boolean().default(false),
  screeningKidneyFunction: z.boolean().default(false),
  screeningThyroidFunction: z.boolean().default(false),
  screeningECG: z.boolean().default(false),
  screeningLungFunction: z.boolean().default(false),
  screeningPapSmear: z.boolean().default(false),
  screeningMammogram: z.boolean().default(false),
  screeningGeneticTesting: z.boolean().default(false),
  screeningGastroscopy: z.boolean().default(false),
  otherMedicalTests: z.string().optional(),
})

// ─── Step 9: Family History ───────────────────────────────────────────────────
export const step9Schema = z.object({
  familyHypertension: z.enum(['Yes', 'No'], { error: 'Required' }),
  familyDiabetes: z.enum(['Yes', 'No'], { error: 'Required' }),
  familySeizures: z.enum(['Yes', 'No'], { error: 'Required' }),
  familyHeartDisease: z.enum(['Yes', 'No'], { error: 'Required' }),
  familyAutoimmuneDisease: z.enum(['Yes', 'No'], { error: 'Required' }),
  familyKidneyDisorders: z.enum(['Yes', 'No'], { error: 'Required' }),
  familyAlzheimers: z.enum(['Yes', 'No'], { error: 'Required' }),
  familyHighCholesterol: z.enum(['Yes', 'No'], { error: 'Required' }),
  familyCancer: z.string().optional(),
})

// ─── Step 10: Consent & Indemnity ─────────────────────────────────────────────
export const step10Schema = z.object({
  consentResearch: z.string().min(1, 'Please select an option'),
  consentPOPI: z.string().refine(v => v === 'agree', { message: 'POPI compliance is required to proceed' }),
  consentIndemnity: z.boolean().refine(v => v === true, { message: 'You must accept the indemnity to proceed' }),
})

// ─── Step schemas array (index = step - 1) ────────────────────────────────────
export const stepSchemas = [
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  step6Schema,
  step7Schema,
  step8Schema,
  step9Schema,
  step10Schema,
] as const
