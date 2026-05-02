# Design: Aliento Health Questionnaire (Custom Multi-Step Wizard)

## Problem Statement

The existing questionnaire page embeds a JotForm iframe, which has branding limitations, lacks style consistency with the site, and cannot be controlled (footer removal, pagination, data ownership). The goal is to replace it with a fully custom, branded multi-step wizard that saves responses to the database and emails Dr. Adonis via Resend.

## Approach

**React Hook Form + Zod** multi-step wizard — 10 sections from Dr. Adonis's original JotForm, each as a separate wizard step with per-step Zod validation. Final submission POSTs to an API route that saves to the DB and triggers a Resend email.

---

## Architecture

### Route
`/questionnaire?bookingUid=<uid>` — `bookingUid` ties the questionnaire to a Cal.com booking.

### File Structure

```
src/app/questionnaire/
  page.tsx                      ← Server Component (reads searchParams)
  QuestionnaireWizard.tsx       ← Client Component (wizard shell, progress bar, step routing)
  steps/
    Step1Personal.tsx           ← Section 1: Personal Information
    Step2Metrics.tsx            ← Section 2: Body Metrics
    Step3Ergonomics.tsx         ← Section 3: Ergonomics
    Step4Medical.tsx            ← Section 4: Medical History
    Step5Medication.tsx         ← Section 5: Chronic Medication
    Step6Surgical.tsx           ← Section 6: Surgical History
    Step7Stress.tsx             ← Section 7: Stress & Emotional Well-being
    Step8Screening.tsx          ← Section 8: Screening
    Step9Family.tsx             ← Section 9: Family History
    Step10Consent.tsx           ← Section 10: Consent & Indemnity
  schema.ts                     ← Zod schemas per step + combined full schema
  types.ts                      ← TypeScript types inferred from Zod schemas

src/app/api/questionnaire/
  route.ts                      ← POST handler: DB insert + Resend email

src/app/questionnaire/confirmed/
  page.tsx                      ← Thank-you/confirmation page
```

### Data Flow

1. Patient visits `/questionnaire?bookingUid=xyz` (linked from booking confirmation email)
2. `QuestionnaireWizard` manages form state via `useForm` + `FormProvider`
3. Each step registers fields; "Continue" validates only the current step's Zod schema
4. On step 10 "Submit Questionnaire" → POST `/api/questionnaire` with `{ bookingUid, ...allFields }`
5. API route: INSERT into `questionnaires` table (`rawData` = JSON.stringify of all fields) + send Resend email to `leegale@alientomd.com`
6. Patient redirected to `/questionnaire/confirmed`

---

## Form Sections & Fields

### Step 1 — Personal Information
| Field | Type |
|---|---|
| First Name / Last Name | text |
| Age | text |
| Gender | radio: Male / Female / N/A |
| Race | radio: Black / White / Coloured / Indian / Other |
| Email (+ confirmation) | email x2 |
| Highest education | radio: Matric or equivalent / Undergraduate and beyond / Other |
| Medical Aid | radio: Yes / No |
| Medical Aid Number | text (conditional on Yes) |
| Street Address, City, Province, Postal Code | text fields |
| Phone Number | text (format: 000-000-0000) |
| Name of GP | text |

### Step 2 — Body Metrics
| Field | Type |
|---|---|
| Current weight (kg) | text |
| Current height (cm) | text |
| Waist circumference (cm) | text |
| Goal weight (kg) | text |
| Weight changed >5kg in last year? | radio: Yes / No |
| If Yes, by how much? | text (conditional) |
| Blood group | text |
| Date of last blood work | date |
| Lab (Lancet / Ampath / Other) | radio |
| Consent for blood work-up access? | radio: Yes / No |

### Step 3 — Ergonomics
Yes/No radio buttons for: Bad posture, Back pain, Pain when walking, Hip pain, Headaches, Work at a desk, Sit with laptop on lap, Mobile device >6hrs/day, Trouble concentrating long periods.

### Step 4 — Medical History
Yes/No radios: Diabetes, Hypertension, Cardiac Disease, Asthma, Stroke, Urinary tract disease.
Open text: Other respiratory disease, Mental health disease, Seizures, Thyroid disease, Allergies, Skin allergies/sensitivity, Adverse reaction to allergy medications, Autoimmune disease.
Radios: Currently pregnant or breastfeeding (Yes/No), Menopausal (Yes/No), Menstrual periods (Regular/Heavy/Painful), Had COVID-19 (Yes/No).
Conditional on COVID Yes: Date of COVID-19 (date), Long-term COVID symptoms (text).
Radio: COVID vaccination status (Vaccinated / Not Vaccinated / Prefer not to say).
Text: Other chronic illnesses.

### Step 5 — Chronic Medication
Single large textarea: List current medications and dosage (placeholder: "State 'No' if not applicable").

### Step 6 — Surgical History
Single large textarea: List dates and procedures (placeholder: "State 'No' if not applicable").

### Step 7 — Stress & Emotional Well-being
| Field | Type |
|---|---|
| Stress profile | multi-select checkboxes: Anxious / Calm / Impulsive / Overly stressed / Reckless |
| Smoke? | radio: Yes / No |
| How long smoking? | text (conditional on Yes) |
| How many per day? | text (conditional on Yes) |
| Drink more than 3x/week? | radio: Yes / No |
| Type of drink | text (conditional on Yes) |
| Use recreational drugs? | radio: Yes / No |
| Exercise at least 30 min/day? | radio: Yes / No |
| Type of exercise | text (conditional on Yes) |
| Eat a healthy balanced diet? | radio: Yes / No |

### Step 8 — Screening (Done these tests?)
Yes/No checkboxes: Full blood count, Liver function, Kidney function, Thyroid function, ECG, Lung function, Pap smear (females), Mammogram (females), Genetic testing, Gastroscopy/colonoscopy.
Text: Other medical tests.

### Step 9 — Family History
Yes/No radios: Hypertension, Diabetes, Seizures/Epilepsy, Heart disease/attack/stroke/bypass, Autoimmune disease, Kidney disorders, Alzheimer's, High cholesterol.
Text: Any Cancer? Please specify.

### Step 10 — Consent & Indemnity
Three checkbox agreements (all required):
1. Research consent: "I agree my results may be anonymously used for research" / "I do not agree"
2. POPI compliance: "I agree to POPI compliance" / "I do not agree"
3. Indemnity: "I accept the indemnity terms as outlined"

---

## UI Design

### Wizard Shell
- **Header:** Aliento logo + "Health & Wellness Questionnaire" subtitle
- **Progress bar:** Thin gold/teal bar spanning full width; text shows "Step N of 10 · [Section Name]"
- **Card:** White/dark rounded card (matches site theme) containing the current step's fields
- **Navigation:** `← Back` ghost button (disabled on step 1) + `Continue →` / `Submit Questionnaire` gold primary button
- **Transitions:** Subtle fade/slide animation between steps

### Field Styling
- Consistent with site input design: dark background inputs, gold focus ring, labels above, inline Zod errors in red below the field
- Radio groups: pill-style horizontal options (vertical on mobile)
- Textareas: min 3 rows
- Conditional fields: smooth height-animated reveal when parent field is "Yes"

### Confirmation Page
- Large checkmark icon in brand gold
- Heading: "Thank you, [First Name]!"
- Body: "Your questionnaire has been received. Dr. Adonis will review it before your consultation."
- CTA: Link back to `/consult` or homepage

---

## API Route (`POST /api/questionnaire`)

**Request body:**
```json
{
  "bookingUid": "string | null",
  "patientName": "string",
  "patientEmail": "string",
  "data": { /* all form fields as object */ }
}
```

**Actions:**
1. INSERT into `questionnaires` table: `id` (nanoid), `patientName`, `patientEmail`, `submittedAt`, `rawData` (JSON string of `data`)
2. Send Resend email to `leegale@alientomd.com` with a formatted HTML summary of all fields grouped by section

**Error handling:** 400 for missing required fields, 500 for DB/email errors (email failure is non-fatal — log and continue).

---

## Dependencies

New packages required:
- `react-hook-form` — form state management
- `zod` — schema validation (may already be present; check)
- `@hookform/resolvers` — connects Zod to RHF

---

## Out of Scope

- No file upload fields
- No patient authentication (questionnaire is access-gated via bookingUid link from email)
- No admin UI to view submissions (raw DB + email is sufficient for now)
