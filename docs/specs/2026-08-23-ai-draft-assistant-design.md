# AI Draft Assistant — Aliento Health (Design Spec)

**Date:** 2026-08-23
**Status:** Approved (grilling session, 7 rounds)
**Author:** Ricky (Hermes Agent) + Leroy
**Repo:** `/root/aliento-nextjs` · **Live:** alientomd.com

---

## 1. Context & Goal

Aliento Health (Dr Leegale Franscesca Adonis — MBBCH, MBA, FCPHM (SA), MMed Comm Health, PhD) is a solo Johannesburg private practice running online prescriptions, sick notes, second opinions and consults at alientomd.com. The doctor does all document creation and signing herself; every script/sick note is currently typed manually from a patient questionnaire.

**Goal:** Integrate AI into day-to-day operations so Dr Leegale reviews-and-signs instead of types. Position Aliento as the first SA practice marketing **"AI-drafted, doctor-signed"** documents — competitive research confirms zero SA competitors claim this lane (see `/root/.hermes/ai-medical-recon.md`).

**Market/regulatory context (verified 2026-08):**
- HPCSA Booklet 20 (Sept 2025, rev. Nov 2025) explicitly permits **assistive AI** — AI never the final decision-maker, practitioner always accountable, disclosure required, opt-out must not disadvantage patients.
- E-scripts are settled law (Medicines Act Reg 33 + AES signatures).
- No SA competitor markets AI-drafted documents with doctor review, WhatsApp-native HPCSA-compliant AI flows, or follow-up/adherence automation.

## 2. Locked Decisions (from grilling)

| # | Decision |
|---|---|
| 1 | **Ops-first.** AI assists the doctor internally; patient-facing AI (WhatsApp intake) is phase 2. |
| 2 | **Scope A+C+D:** (A) AI-drafted scripts + sick notes — one engine, two templates; (C) kills manual re-keying of questionnaires; (D) AI-drafted content/SEO moat. |
| 3 | **Review surface:** admin dashboard, one-click flow. Dr Leegale edits drafts, never accepts blindly. |
| 4 | **AI path:** OpenRouter → Gemini (free tier) via the existing ILALI AI gateway pattern (OpenAI-compatible endpoint, key in `~/.hermes/keys`). Pseudonymize PII before the call; reinsert after. |
| 5 | **Consent:** patient-facing consent line + opt-out on every questionnaire; "How Aliento uses AI" disclosure page. Required by HPCSA Booklet 20; used as trust/marketing signal. |
| 6 | **Success metrics:** (a) questionnaire → signed & sent turnaround < 5 min; (b) ≥ 3 hrs/week of doctor typing saved; (c) hard rule — AI never signs; 100% doctor review. |
| 7 | **Volume:** 10–30 docs/week, scripts-heavy. Free-tier Gemini has ample headroom. |

## 3. Non-Goals (v1)

- No autonomous/AI-only document generation or sending.
- No patient-facing chat, WhatsApp flow, or AI triage (phase 2).
- No new infra, no new paid services (free-tier only).
- No PDF generation changes — existing HTML-based pipeline stays.

## 3.1 Usability Principles — Designed for a Non-Tech-Savvy Doctor

Dr Leegale is not tech-savvy. The AI must never add cognitive load. Non-negotiables:

1. **One obvious action per screen.** The primary action is always a single, big, plain-English button. No nested menus, no mode toggles, no jargon ("draft", "send", "preview" only — terms she already knows).
2. **The existing flow never changes shape.** AI fills the SAME fields she already edits. She never learns a new screen to benefit from AI.
3. **Zero blank-page anxiety.** If she opens a script/note from a questionnaire and clicks "✨ Write draft for me", the fields fill visibly with a clear banner: *"AI draft ready — please review and edit before sending."* The banner disappears once she edits or generates.
4. **Failures are friendly and non-blocking.** If AI is unavailable: button stays visible, click shows *"AI is unavailable right now — no problem, you can type as usual."* Manual flow is always fully working. Never an error page, never a spinner that dies silently.
5. **Everything is reversible and safe.** Editing a draft never locks anything; Generate → Preview → Send stays exactly as today. No auto-send, no auto-sign, no surprises.
6. **Big targets, high contrast, generous spacing.** 44px+ hit areas, 16px+ base font, existing warm/sage palette. Works on her desktop; must not break on a small laptop.
7. **Trust labels.** Every AI-filled field is visibly marked (subtle "AI" chip) so she always knows what the machine wrote vs what she wrote. This is also the HPCSA disclosure made visible.

**Usability acceptance gate (must pass before live):** Dr Leegale completes one script + one sick note from questionnaire → signed & sent **without assistance**, on staging, first try. If she hesitates or asks "how do I…", the flow is not done.

## 4. Architecture (Approach A — in-app AI engine)

```
Patient fills questionnaire (existing)   ← + consent/opt-out line + disclosure link
        ↓
Admin opens script/sick-note detail     ← "✨ AI Draft" button
        ↓
POST /api/ai/draft { type, questionnaire, medications? }
        ↓
Pseudonymize (strip name/ID/contact) → OpenRouter → Gemini (gateway)
        ↓
Structured draft returned → fills editable fields (symptoms/reason text
        OR suggested medication rows + note)
        ↓
Dr Leegale reviews/edits → Generate PDF (existing) → Sign → Send (existing)
```

## 5. Components

### 5.1 `src/lib/ai-draft.ts`
- **Pseudonymizer:** strips name, SA ID number, phone, email, address from questionnaire text before the API call; placeholder tokens (e.g. `[PATIENT]`, `[ID]`) reinserted into the returned draft.
- **Gateway client:** OpenAI-compatible POST to the AI gateway (OpenRouter → `google/gemini` free model, same pattern as ILALI). Key from env (`AI_GATEWAY_URL`, `AI_GATEWAY_KEY` — mirror `.env.vercel` conventions).
- **Prompt builder per type:**
  - **Sick note:** input = start/end dates + symptoms + reason; output = clean clinical summary sentence(s) in a professional-but-warm tone (matches her "knowledgeable friend who happens to be a doctor" voice).
  - **Script:** input = questionnaire + existing medication rows; output = suggested medication rows (name, dosage, frequency, duration) + prescriber note. Drafts must not invent medication names beyond what the patient reported — flag uncertainty, never fabricate.
- **Response parsing:** structured JSON (`{ draft: { ...fields } }`); fallback to raw text on parse failure.

### 5.2 `src/app/api/ai/draft/route.ts`
- POST only. Validates `type` ∈ {script, sick-note} and required questionnaire fields.
- Calls `ai-draft.ts`; returns `{ ok, draft }`.
- Server-side only — no client-side AI keys.
- Basic rate limiting (per-IP or per-admin session; generous — 10–30/week workload).

### 5.3 Admin UI
- **Script detail** (`/admin/scripts/[id]`): "✨ AI Draft" button → loading state → fills medication rows + note area. Doctor edits rows as today.
- **Sick note admin** (wherever sick notes are managed; if no admin surface exists yet, add minimal one — verify during implementation): "✨ AI Draft" fills symptoms/reason fields.
- Diff-friendly: drafts land in the existing editable fields; nothing is auto-accepted.

### 5.4 Content engine (D) — AI blog writer
- **"✨ Draft with AI" button in the posts editor** (`/admin/posts/new` + `/admin/posts/edit/[slug]`, TipTap). One click → title suggestions + excerpt + HTML content land in the editor for her to edit. She still publishes via the existing flow — AI never auto-publishes.
- **Style reference from her own writing:** the prompt is few-shot with 2–3 of her **existing published posts** (fetched from Sanity, e.g. the epilepsy explainer) so the draft matches her real voice: *"a knowledgeable friend who happens to be a doctor, explaining over tea — evidence-based, no jargon, warm but not fluffy."*
- **Inputs:** topic/title (or a brief sentence from her) + optional category → draft. A "regenerate" button for a second take.
- **High-intent SEO starters:** "online sick note South Africa", "online prescription SA", "what a sick note needs to say", "how to get a repeat prescription online" + 1–2 health explainers.
- **Cadence:** weekly; she edits, publishes, and over time her published posts enrich the style corpus (reference pool = latest 3 published posts).

### 5.5 Consent, disclosure & records
- Checkbox on each questionnaire: "I consent to AI assisting my doctor in preparing my documents. I can opt out."
- **Consent is recorded, not implied:** each consent/opt-out stored with timestamp in DB (`patient_ai_consent` table: questionnaire submission id, consent bool, opted-out bool, timestamp). POPIA requires demonstrable consent.
- Opt-out = AI button hidden for that patient; manual flow unchanged (existing forms still work).
- Public page: `/how-we-use-ai` — plain-language disclosure (HPCSA Booklet 20 compliance + trust signal). Links from questionnaire + footer.

## 6. Legal & Compliance (POPIA + HPCSA)

### Clinical governance (HPCSA Booklet 20)
- **AI never signs.** Every generated document passes through the existing doctor-review → generate → sign flow. AI is strictly assistive; Dr Leegale remains fully accountable for every document.
- **Disclosure + opt-out** before any AI use; opt-out must not disadvantage the patient (manual flow identical).
- **AI use is part of the clinical record:** every AI draft logged and linked to the final document ID, so the patient file shows what the AI produced and what the doctor changed.
- **Prompt hardening:** "You are drafting for a licensed medical practitioner to review. Never invent facts, medications, or diagnoses. Mark anything uncertain as [REVIEW]."

### POPIA
- **Data minimization:** only the questionnaire fields needed for the draft leave the system; pseudonymizer strips name, SA ID (13-digit + Luhn), phone (0[6-8]…), email, address before the API call; tokens reinserted after.
- **Consent with a record:** `patient_ai_consent` table stores consent/opt-out + timestamp (demonstrable consent).
- **Processor reality:** document that OpenRouter → Google (Gemini) may process data outside SA. The disclosure page states this plainly ("AI services may process your information outside South Africa").
- **Retention:** `ai_draft_log` contains NO PII (pseudonyms only) and is retained 12 months, then purged by cron. Consent records retained per POPIA processing limits. No patient-identifiable data in AI logs.
- **Patient rights:** access/correction/deletion requests handled through existing contact channels; logs are pseudonymised so a request can be honoured without exposing model traffic.
- **Breach readiness:** if the AI gateway or logs are breached, existing practice breach procedure applies (notify Information Regulator + affected patients per POPIA timelines).

### Audit
- `ai_draft_log` table (additive Drizzle migration): timestamp, type, patient pseudonym, questionnaire summary hash, model, prompt version, success/failure. No PII.

## 7. Edge Cases

| Case | Handling |
|---|---|
| Gemini down / timeout | Route returns friendly error; manual flow unchanged. Draft button disabled with "AI unavailable — type manually". |
| Draft parse failure | Fallback: return raw text into the textarea for editing. |
| Questionnaire too thin (no symptoms/reason) | Button disabled until required fields present. |
| Medication name invented by model | Prompt forbids fabrication; doctor reviews every row anyway. |
| Opted-out patient | AI button hidden; manual flow identical. |
| PII detection miss (e.g. unusual ID format) | Pseudonymizer uses regex for SA ID (13 digits + Luhn), phone (0[6-8]…), email; strips anything matching `[PATIENT]`-style tokens. |

## 8. Testing & Rollout

1. **Template QA (gate):** run 5 real de-identified questionnaires through the draft engine; Dr Leegale approves the output style before it ships to prod UI.
2. **Usability gate (must pass before live):** Dr Leegale completes one script + one sick note from questionnaire → signed & sent **without assistance**, on staging, first try. If she hesitates or asks "how do I…", the flow is not done.
3. **Unit:** pseudonymizer round-trip (PII removed → tokens reinserted), prompt builder per type, route validation.
4. **Manual E2E:** questionnaire → draft → edit → generate → preview → send on staging.
5. **Live:** feature-flag via env (`AI_DRAFT_ENABLED`) — default on, flip off instantly if needed.
6. **Success check (2 weeks):** turnaround time and hours-saved review with Dr Leegale; iterate on prompt/template.

## 9. Rollout Order

1. `src/lib/ai-draft.ts` + `/api/ai/draft` route (sick note template first — simplest)
2. Script template + admin UI button on script detail
3. Consent checkbox + `/how-we-use-ai` page
4. `ai_draft_log` table
5. Content engine (D) — posts editor draft button + first 4–6 SEO pages
6. Template QA gate with Dr Leegale before public launch

## 10. Open Items (confirm during implementation)

- Sick-note admin surface — does one exist? (Site has patient-facing questionnaire + confirmed pages; verify admin management path for sick notes.)
- Content system: Sanity (`sanity`/`next-sanity` in deps) vs local markdown (`gray-matter`) — verify which health-topics/blog use, then wire the draft button into the real editor.
- Exact gateway env vars to add to `.env.vercel` (name them `AI_GATEWAY_URL` / `AI_GATEWAY_KEY`).
- Consent copy final wording.
