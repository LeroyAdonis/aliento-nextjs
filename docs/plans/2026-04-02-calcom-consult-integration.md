# Cal.com Consult Booking Integration Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Launch a production-ready Cal.com booking flow on `/consult` with branded UI, booking confirmation pages, and reschedule/cancel handling integrated into the existing Aliento Next.js app.

**Architecture:** Use `@calcom/embed-react` for client-side booking on `/consult` (already installed), and add secure server route handlers to read/update booking state via Cal.com API v2 using a secret key. Add webhook ingestion for booking lifecycle events to keep internal state and downstream notifications consistent.

**Tech Stack:** Next.js App Router (RSC + route handlers), TypeScript, `@calcom/embed-react`, existing Tailwind/theme tokens, existing PayFast integration.

---

## Current-state findings

- `src/app/consult/page.tsx` is currently a polished placeholder with disabled booking CTAs.
- `@calcom/embed-react` is already installed and a component exists at `src/components/integrations/CalEmbed.tsx`.
- Cal embed is currently used on `/contact` in a tabbed UI and hardcodes fallback username `leegale` + off-brand blue (`#7db8f7`).
- PayFast flow exists (`/api/payment`, `/api/payment/notify`) and can remain separate unless explicitly coupled to booking.

## Recommended integration approach

1. **Primary:** Embed-first Cal.com booking on `/consult` with **PayFast payment gate** before booking opens.
2. **Payment flow:** User selects duration → PayFast checkout → on payment success → Cal embed unlocks for booking.
3. **Complementary:** Add server-backed booking status routes + webhook receiver for confirmation/reschedule/cancel pages.
4. **Video location:** Zoom primary → Teams secondary → Cal Video fallback per event config.
5. **Webhooks:** Structured logging with extension points for future DB persistence.

## Updated end-to-end booking flow

1. User lands on `/consult`, sees service options and pricing.
2. User selects 30min or 60min consult.
3. User clicks "Book Consultation" → redirected to PayFast checkout.
4. On PayFast success (`/api/payment/notify` confirms), user is redirected to booking gate page.
5. Booking gate page shows Cal.com embedded scheduler (now unlocked).
6. User books the appointment via Cal embed.
7. On booking success, user is redirected to `/consult/confirmed/[bookingUid]`.
8. Confirmation page shows all details with reschedule/cancel links.

---

### Task 1: Cal.com configuration and environment contract

**Files:**
- Create: `.env.example` (if missing)
- Modify: `README.md`

**Steps:**
1. Define required env vars:
   - `NEXT_PUBLIC_CALCOM_USERNAME`
   - `NEXT_PUBLIC_CALCOM_EVENT_SLUG_30`
   - `NEXT_PUBLIC_CALCOM_EVENT_SLUG_60`
   - `CALCOM_API_KEY`
   - `CALCOM_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_SITE_URL`
2. Document Cal.com dashboard setup:
   - Create 30min + 60min event types.
   - Set organizer timezone, buffers, availability windows.
   - Configure video location (Zoom/Teams/Cal Video) per policy.
   - Configure webhook subscriber URL: `/api/webhooks/calcom`.
3. Add local/dev notes for webhook testing via tunnel when needed.

---

### Task 2: Refactor reusable Cal embed component to match Aliento theme

**Files:**
- Modify: `src/components/integrations/CalEmbed.tsx`
- Optionally create: `src/components/integrations/calcom-config.ts`

**Steps:**
1. Replace hardcoded fallback username with required prop/env-only behavior.
2. Add props for:
   - `eventSlug` (30/60)
   - `prefill` (`name`, `email`)
   - `rescheduleUid`
   - `className`
3. Update branding styles to match `src/lib/theme.ts` tokens (sage/blush/cream palette).
4. Emit `onBookingSuccess` callback (if supported by embed events) to route to confirmation page.
5. Keep `ssr: false` dynamic usage for stability.

---

### Task 3: Replace `/consult` placeholder with real booking experience

**Files:**
- Modify: `src/app/consult/page.tsx`
- Create: `src/components/consult/ConsultBookingPanel.tsx` (client)

**Steps:**
1. Keep existing hero + trust content sections.
2. Replace disabled "Coming Soon" buttons with a booking panel:
   - Duration toggle (30 min / 1 hour)
   - Optional prefill fields (name/email)
   - Embedded Cal scheduler
3. Add medical disclaimer + cancellation policy adjacent to booking panel.
4. Add fallback CTA for direct hosted Cal link if embed fails.
5. Ensure mobile-first behavior (scheduler in card with min height and graceful loading state).

---

### Task 4: Confirmation page route

**Files:**
- Create: `src/app/consult/confirmed/[bookingUid]/page.tsx`
- Create: `src/app/api/calcom/bookings/[bookingUid]/route.ts`
- Create: `src/lib/calcom.ts`

**Steps:**
1. Build server helper (`src/lib/calcom.ts`) for authenticated v2 API calls.
2. Implement API route to fetch booking details by UID securely (never expose API key client-side).
3. Render branded confirmation page:
   - date/time/timezone
   - meeting location/link (if available)
   - attendee + clinician details
   - CTA links: reschedule / cancel
4. Handle invalid/expired UID with safe user-friendly error state.

---

### Task 5: Reschedule and cancel routes

**Files:**
- Create: `src/app/consult/reschedule/page.tsx`
- Create: `src/app/consult/cancel/[bookingUid]/page.tsx`
- Create: `src/app/api/calcom/bookings/[bookingUid]/reschedule/route.ts`
- Create: `src/app/api/calcom/bookings/[bookingUid]/cancel/route.ts`

**Steps:**
1. Reschedule route reads `rescheduleUid` + `eventTypeSlug` query params and mounts scheduler in reschedule mode.
2. Cancel route shows confirmation UI and posts to internal API route.
3. API routes proxy to Cal v2 endpoints with server secret.
4. Return consistent typed JSON responses for UI handling.
5. Display post-action success states and recovery links.

---

### Task 6: Webhook ingestion for booking lifecycle

**Files:**
- Create: `src/app/api/webhooks/calcom/route.ts`
- Optionally create: `src/lib/calcom-webhooks.ts`

**Steps:**
1. Add raw-body signature verification (`x-cal-signature-256`) using `CALCOM_WEBHOOK_SECRET`.
2. Handle events:
   - `BOOKING_CREATED`
   - `BOOKING_RESCHEDULED`
   - `BOOKING_CANCELLED`
3. Log structured event records and set extension points for:
   - email/SMS reminders
   - CRM updates
   - future DB persistence
4. Return 2xx quickly after validation and enqueue/async process heavy side effects.

---

### Task 7: Navigation and cross-page consistency

**Files:**
- Modify: `src/app/contact/page.tsx`
- Optionally modify: `src/components/sections/CTA.tsx`, `src/components/sections/Hero.tsx`

**Steps:**
1. Make `/consult` the canonical booking entry point.
2. On `/contact`, either:
   - remove duplicate scheduler embed and link to `/consult`, or
   - keep embed but reuse refactored shared component + same env config.
3. Ensure all "Book consult" CTAs point to the canonical flow.

---

### Task 8: QA, analytics hooks, and rollout checks

**Files:**
- Modify: `README.md` (runbook)
- Optionally create: `docs/runbooks/calcom-booking.md`

**Steps:**
1. Validate end-to-end scenarios:
   - New booking
   - Reschedule
   - Cancel
   - Invalid UID
   - Embed blocked/fails
2. Validate mobile + desktop rendering and CLS/perf impact.
3. Add basic event tracking points (`booking_started`, `booking_completed`, `reschedule_clicked`, `cancel_confirmed`).
4. Verify webhook signature failure path and replay behavior.

---

## Dependencies

- **Required new packages:** none for MVP (already has `@calcom/embed-react`).
- **Optional later:** `zod` for webhook payload validation and strict typing.

## End-to-end booking flow (phase 1)

1. User lands on `/consult`.
2. User selects duration and books via embedded Cal scheduler.
3. On success, user is redirected to `/consult/confirmed/[bookingUid]`.
4. Confirmation page fetches secure booking details via internal API route.
5. User can choose reschedule/cancel from confirmation page.
6. Cal webhook events update internal systems and trigger notifications.

## Key product decisions needed before implementation

1. Should booking be allowed **before payment**, or must payment be **strictly upfront**?
2. If upfront is strict, do we prefer:
   - Cal native paid bookings (provider constraints), or
   - custom PayFast-gated workflow?
3. Should `/contact` still include a booking embed, or link out to `/consult` only?
4. Which video provider should be default in Cal event types (Zoom, Teams, or Cal Video)?
5. Do we need DB persistence of bookings immediately, or webhook logging only for v1?
