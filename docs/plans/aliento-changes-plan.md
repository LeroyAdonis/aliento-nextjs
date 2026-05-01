# Aliento Blog — Changes Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Deliver Gaila's requested changes to the Aliento medical blog: fix pricing, wire up PayFast + Cal.com fully, add doctor headshot/credentials, add a patient health questionnaire with legal disclaimers, and set up the @alientmd.com email.

**Architecture:** Next.js 16 App Router, Sanity CMS, Tailwind CSS 4, Framer Motion. Existing payment flow is partially wired — PayFast lib + payment gate exist, Cal.com embed exists. Need to update pricing, connect the dots, and add new pages/components.

**Tech Stack:** Next.js 16, Sanity 5, Tailwind CSS 4, Framer Motion, @calcom/embed-react, PayFast, Drizzle ORM, Neon Serverless

---

### Task 1: Update Consultation Pricing to 20min R250 / 35min R500

**Objective:** Change consultation packages from 30min/R250 and 60min/R500 to 20min/R250 and 35min/R500. Update all copy across the codebase.

**Files:**
- Modify: `src/lib/payfast.ts:15-31`
- Modify: `src/app/consult/page.tsx:56-59`
- Modify: `src/components/consult/ConsultBookingPanel.tsx:6-9`

**Step 1: Update CONSULTATION_PACKAGES in payfast.ts**

In `src/lib/payfast.ts`, replace the `CONSULTATION_PACKAGES` array:

```typescript
export const CONSULTATION_PACKAGES = [
  {
    id: 'consult-30',
    name: '20-Minute Consultation',
    description: 'Quick virtual consultation via Zoom or Teams',
    amount: 250,
    duration: '20 min',
  },
  {
    id: 'consult-60',
    name: '35-Minute Consultation',
    description: 'Extended virtual consultation via Zoom or Teams',
    amount: 500,
    duration: '35 min',
  },
] as const
```

**Step 2: Update pricing copy in consult/page.tsx**

Replace lines 57-58:
```tsx
<li>• 20 min consult — R250</li>
<li>• 35 min consult — R500</li>
```

**Step 3: Update options in ConsultBookingPanel.tsx**

Replace the `options` array:
```tsx
const options = [
  { id: 'consult-30', label: '20 minutes', price: 'R250' },
  { id: 'consult-60', label: '35 minutes', price: 'R500' },
] as const
```

**Step 4: Update metadata description in consult/page.tsx**

Line 9 — update:
```typescript
description:
  'Book a virtual face-to-face medical consultation. R250 for 20 min or R500 for 35 min.',
```

**Verify:** Run `npm run build` — should compile with no errors.

---

### Task 2: Add Doctor Headshot & Credentials to Home + About Page

**Objective:** Add a real doctor photo (emojis/placeholders currently) and credentials section. Replace the `👩‍⚕️` emoji in `AboutDoctor.tsx` with an `<img>` tag using a stored public image. Add "Dr. [Name], MBChB" etc. Add a credentials/qualifications section.

**Files:**
- Modify: `src/components/sections/AboutDoctor.tsx`
- Modify: `src/app/about/page.tsx` (add credentials section)
- Create: `public/images/doctor-headshot.jpg` (or .webp — Gaila will provide this)

**Step 1: Update AboutDoctor.tsx to accept a headshot image**

Replace the placeholder emoji div with an Image component:

```tsx
import Image from 'next/image'

// Replace the illustration div (lines 12-14):
{/* <div className="rounded-2xl bg-gradient-to-br from-sage-100 to-sage-200/70 aspect-[4/5] max-w-sm mx-auto flex items-center justify-center">
  <span className="text-8xl opacity-30 select-none">👩‍⚕️</span>
</div> */}

// With:
<div className="rounded-2xl overflow-hidden aspect-[4/5] max-w-sm mx-auto bg-gradient-to-br from-sage-100 to-sage-200/70 relative">
  <Image
    src="/images/doctor-headshot.webp"
    alt="Dr. Gaila Aliento"
    fill
    className="object-cover"
    priority
  />
</div>
```

**Step 2: Add credentials text to AboutDoctor.tsx**

After the "A knowledgeable friend who happens to be a doctor" heading, add:

```tsx
<div className="mb-6">
  <p className="text-lg font-display font-semibold text-warm-900">Dr. Gaila Aliento, MBChB</p>
  <p className="text-sm text-sage-600">General Practitioner | Health Promotion Specialist</p>
</div>
```

**Step 3: Update /about page with credentials section**

Add a new credentials section to `src/components/sections/About.tsx` after the story section. Include years of experience, qualifications, and areas of expertise.

---

### Task 3: Wire Up PayFast Payment End-to-End

**Objective:** Ensure the full payment flow works: ConsultBookingPanel → POST /api/payment → PayFast redirect → ITN notify → payment gate unlock → Cal.com embed.

**Files:**
- Modify: `src/lib/payment-gate.ts` — persist to Neon/Drizzle instead of in-memory Map
- Modify: `src/app/api/payment/route.ts` — handle packageId mapping for new IDs
- Check: `src/app/api/payment/notify/route.ts` — ITN handler (already works)
- Modify: `src/app/api/payment/status/[paymentId]/route.ts` — ensure it reads from DB

**Step 1: Set up Drizzle schema for payment records**

Create `src/db/schema/payments.ts`:
```typescript
import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core'

export const payments = pgTable('payments', {
  paymentId: text('payment_id').primaryKey(),
  packageId: text('package_id').notNull(),
  buyerName: text('buyer_name').notNull(),
  buyerEmail: text('buyer_email').notNull(),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  paidAt: timestamp('paid_at'),
})
```

**Step 2: Update payment-gate.ts to use Drizzle + Neon**

Replace the in-memory Map implementation with Drizzle queries against the `payments` table.

**Step 3: Ensure status endpoint reads from DB**

Modify `src/app/api/payment/status/[paymentId]/route.ts` to query Drizzle.

---

### Task 4: Wire Up Cal.com Booking Calendar

**Objective:** Ensure Cal.com embed works correctly post-payment. Set up Cal.com event slugs for the new 20min/35min durations.

**Files:**
- Check: `src/components/integrations/CalEmbed.tsx` — already configured
- Check: `src/app/consult/book/BookingContent.tsx` — maps event slugs by duration
- Modify: `src/app/consult/book/BookingContent.tsx` — ensure 20min maps to the correct Cal event slug

**Step 1: Review the duration → event slug mapping**

In `BookingContent.tsx`, the mapping is:
```
duration=60 → NEXT_PUBLIC_CALCOM_EVENT_SLUG_60
duration=30 → NEXT_PUBLIC_CALCOM_EVENT_SLUG_30 (default)
```

This still works — we just need Gaila to set the correct Cal.com event slugs:
```
NEXT_PUBLIC_CALCOM_EVENT_SLUG_30 = "20-min-consult"
NEXT_PUBLIC_CALCOM_EVENT_SLUG_60 = "35-min-consult"
```

**Step 2: Add env var documentation**

Update README.md or add a `.env.example` file documenting all required env vars.

---

### Task 5: Create Patient Health Questionnaire Page

**Objective:** Add a patient health questionnaire page with confidentiality/consent disclaimers. Include an Excel-style form (name, contact info, medical history, current symptoms, medications).

**Files:**
- Create: `src/app/questionnaire/page.tsx`
- Create: `src/app/questionnaire/QuestionnaireForm.tsx`
- Create: `src/lib/questionnaire-schema.ts`
- Create: `src/app/api/questionnaire/route.ts`
- Modify: `src/components/layout/Header.tsx` — add link in nav or consult page

**Step 1: Create questionnaire schema with Zod**

```typescript
// src/lib/questionnaire-schema.ts
import { z } from 'zod'

export const questionnaireSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone number required'),
  dateOfBirth: z.string().min(1, 'Date of birth required'),
  // Medical history
  medicalConditions: z.string().optional(),
  medications: z.string().optional(),
  allergies: z.string().optional(),
  surgeries: z.string().optional(),
  // Current symptoms
  primaryComplaint: z.string().min(1, 'Please describe your main concern'),
  symptomDuration: z.string().optional(),
  severityLevel: z.enum(['mild', 'moderate', 'severe']).optional(),
  // Consent
  consentToTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the terms to proceed' }),
  }),
  consentToConfidentiality: z.literal(true, {
    errorMap: () => ({ message: 'You must acknowledge the confidentiality notice' }),
  }),
})

export type QuestionnaireData = z.infer<typeof questionnaireSchema>
```

**Step 2: Create the questionnaire form component**

Create `QuestionnaireForm.tsx` with:
- Patient info fields (name, email, phone, DOB)
- Medical history textareas
- Current symptoms with severity selector
- Confidentiality & informed consent checkboxes with Gaila's legal text
- Submit button that POSTs to `/api/questionnaire`

**Step 3: Add a confidentiality disclaimer section**

Place this prominently at the top of the form:

```tsx
<div className="rounded-2xl border border-sage-200 bg-sage-50 p-6 mb-8">
  <h3 className="font-display font-semibold text-warm-900 mb-3">Confidentiality & Informed Consent</h3>
  <div className="text-sm text-warm-600 space-y-3">
    <p>
      All information you provide in this questionnaire is protected by doctor-patient confidentiality
      and will be handled in accordance with the Protection of Personal Information Act (POPIA).
    </p>
    <p>
      Your data is stored securely and will only be used for the purpose of your medical consultation.
      It will not be shared with any third party without your explicit written consent.
    </p>
    <p>
      By completing and submitting this form, you acknowledge that you have read and understood
      this confidentiality notice and consent to the collection and processing of your health
      information for your consultation.
    </p>
  </div>
</div>
```

**Step 4: Create the backend API route**

Create `src/app/api/questionnaire/route.ts` that:
- Validates the submission with Zod
- Sends the questionnaire data to Gaila's email (@alientmd.com)
- Returns success/failure

---

### Task 6: Update Email Configuration for @alientmd.com

**Objective:** Configure sending of patient questionnaires to Gaila's new @alientmd.com email. Set up email env vars.

**Files:**
- Create: `.env.example`
- Modify: `src/app/api/questionnaire/route.ts` — use @alientmd.com as recipient

**Step 1: Create .env.example**

```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production

# Cal.com Booking
NEXT_PUBLIC_CALCOM_USERNAME=
NEXT_PUBLIC_CALCOM_EVENT_SLUG_30=20-min-consult
NEXT_PUBLIC_CALCOM_EVENT_SLUG_60=35-min-consult
CALCOM_API_KEY=
CALCOM_WEBHOOK_SECRET=

# PayFast
NEXT_PUBLIC_PAYFAST_MERCHANT_ID=
NEXT_PUBLIC_PAYFAST_MERCHANT_KEY=
PAYFAST_PASSPHRASE=

# Site
NEXT_PUBLIC_SITE_URL=https://alientmd.com

# Email (for questionnaire submissions)
CONTACT_EMAIL=gaila@alientmd.com
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
```

**Step 2: Update the questionnaire API to send notification**

The API route should:
1. Store the questionnaire submission
2. Send an email notification to gaila@alientmd.com via an email service
3. Return confirmation to the patient

Since this is a static site on Vercel, recommend using Resend, SendGrid, or the Vercel email integration.

---

### Task 7: Add Questionnaire Link to Header / Navigation

**Objective:** Make the questionnaire accessible from the consult page and/or header.

**Files:**
- Modify: `src/components/layout/Header.tsx` — add "Questionnaire" link in nav
- Modify: `src/app/consult/page.tsx` — add CTA linking to questionnaire

**Step 1: Add nav item to Header.tsx**

Add to the `navItems` array:
```typescript
{ label: 'Questionnaire', href: '/questionnaire' },
```

**Step 2: Add CTA on consult page**

After the pricing list on `/consult`, add a box linking to the questionnaire:
```tsx
<div className="rounded-2xl border border-sage-200 bg-sage-50 p-6 mt-8">
  <h3 className="font-display font-semibold text-warm-900 mb-2">Before your consult</h3>
  <p className="text-sm text-warm-600 mb-4">
    Complete our health questionnaire so Dr. Gaila can prepare for your visit.
  </p>
  <Link href="/questionnaire" className="...">
    Fill in Questionnaire
  </Link>
</div>
```