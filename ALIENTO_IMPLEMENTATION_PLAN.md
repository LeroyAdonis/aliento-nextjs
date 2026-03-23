# Aliento Implementation Plan (dev-aliento branch)

_Last updated: 2026-03-23_

## Vision
A fresh, modern healthcare blog and consult platform for South Africa with warm pastel branding, locally relevant features, and future-ready admin tools.

---

## Core UX Plan (from chat session)

### Home Page
- Pastel palette, “Breathe • Screen • Live” tagline at the top
- Brand new logo (no more clinic cross)
- Headline: “Your health deserves more.”
- Subtle earth tones, modern font pairing

### Blog
- “Insights for your healthiest life”
- Main search
- Pastel category system
- Ready for Sanity CMS posts (Leegail can edit everything herself)

### Consult Page
- Booking CTA (“See a doctor from your couch”)
- Clear consult breakdown: skin, chronic disease, nutrition, wellness, etc.
- Cal.com (booking) & Payfast (payments) integration — pending details from Leegail

---

## Technical Roadmap

- Stack: Next.js, Clash Display + Satoshi fonts, styled-components
- API: Resend (contact form/email), GitHub auto-commit for blog content

### Launch state (complete)
- All core pages styled, responsive, and themed
- Blog and consult flows in place
- Admin dashboard exists (basic version)

### Next upgrades
- [ ] Upgrade admin: Better Auth login (secure, robust)
- [ ] Rich text editor for posts (Tiptap)
- [ ] Image uploads via Cloudflare R2 (blog + consult pages)
- [ ] Cal.com & Payfast wiring as soon as credentials/details are supplied
- [ ] Full mobile polish (final QA)
- [ ] Copywriting pass (final voice & local SA context)

---

## Handover & Release Checklist
- [ ] Confirm dev-aliento branch builds and deploys cleanly on Vercel preview
- [ ] PR review & stakeholder visual check
- [ ] Integration credentials/config captured in 1Password/Secured
- [ ] Go-live checklist: update CNAME or alias when ready

---

## Stakeholders
- Leroy Adonis (Product Lead)
- Prof. Leegail Adonis (Clinical/Content Lead, info@alientomd.com)

---

## Last chat review (copied verbatim)

> New Home:
> • Pastel palette, "Breathe • Screen • Live" up top, softer and a lot warmer
> • Brand new logo (no more stale clinic cross 😂)
> • Headline: "Your health deserves more."
> • Subtle earth tones, modern font pairing
>
> Blog:
> • "Insights for your healthiest life" — main search, pastel category system
> • Ready for Sanity CMS posts (she’ll be able to edit everything herself)
>
> Consult Page:
> • Booking CTA, "See a doctor from your couch."
> • Clear breakdown: what you can consult for (skin, chronic disease, nutrition, wellness, etc.)
> • Will wire in Cal.com and Payfast as soon as Gaila sends those details
>
> All this is live locally and ready for Vercel deploy once you want to flip the switch.

---

If you want me to keep this plan always up-to-date, just say the word and I’ll keep it as a living source file in the repo. Ping for progress anytime!