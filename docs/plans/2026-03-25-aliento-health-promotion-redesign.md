# Aliento Health Promotion Website — Full Redesign Design Document

**Date:** 2026-03-25  
**Payoff Line:** "Breathe, Screen, Live"  
**Approach:** Full Visual Overhaul

---

## 1. Brand & Design System

### Logo
- Wordmark + breath/leaf icon
- "Aliento" in a warm rounded serif (Instrument Serif)
- Small flowing curved icon to the left — suggests both breath and a sprouting leaf
- SVG-based, embedded in codebase
- Works at all scales: web, social, print

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `sage` | `#7C9E8A` | Headers, accents, icons, active nav |
| `sage-light` | `#EEF5F0` | Section backgrounds |
| `cream` | `#FDF8F0` | Main page background |
| `blush` | `#F2C4C4` | Soft highlights, CTA section bg |
| `blush-deep` | `#D9896A` | Primary buttons, links, hover states |
| `warm-text` | `#2E2A26` | Body text |
| `muted` | `#857A6A` | Secondary/supporting text |

### Typography
- **Display/Headings:** Instrument Serif (Google Fonts) — warm, editorial, credible
- **Body:** Plus Jakarta Sans (already installed) — clean, modern, readable
- **Scale:** fluid clamp()-based sizing, large editorial headings on key sections

### Visual Language
- Rounded corners: 12–16px on cards, 8px on buttons
- Soft box shadows (no hard drop shadows)
- Generous whitespace — breathing room between sections
- Organic blob shape in hero background (sage-tinted, low opacity)
- Subtle grain texture on hero
- No clinical cold blues; no harsh lines

---

## 2. Navigation & Information Architecture

### Header
- Single-row: Logo (left) | Nav links (center) | "Book a Consult" CTA (right)
- No top contact bar
- Sticky on scroll with cream/white background
- Mobile: hamburger → full-screen sage overlay menu
- Active route highlighted in sage

### Navigation Links
```
Home | Health Topics | About | Consult | Contact
```

### Pages
| Page | URL | Notes |
|------|-----|-------|
| Home | `/` | Blog-first layout |
| Health Topics | `/health-topics` | Blog index (rename from `/blog`) with category filter |
| Blog Post | `/health-topics/[slug]` | Individual article page |
| About | `/about` | Doctor intro + mission |
| Consult | `/consult` | Virtual consultation info (non-functional UI for now) |
| Contact | `/contact` | Contact form (existing API preserved) |

> **Note:** Old `/blog` and `/blog/[slug]` routes should redirect to new paths, or aliases maintained.

### Footer
3-column layout:
1. **Brand** — Logo, tagline "Breathe, Screen, Live", brief mission statement
2. **Explore** — Navigation links + Health Topic categories
3. **Connect** — Email, social media links (placeholder for now)

---

## 3. Homepage Sections (Blog-First Layout)

### Section 1: Hero
- Full-width, cream background
- Large editorial heading: *"Your health, explained clearly."*
- Tagline: *"Breathe, Screen, Live"*
- Subtext: Short 1-sentence description of what Aliento is
- Two CTAs: "Explore Health Topics" (primary, blush-deep) + "Book a Virtual Consult" (ghost)
- Background: organic sage blob (low opacity) + subtle grain
- Retain `.animate-breathe` subtle animation on the blob

### Section 2: Featured Article
- Full-width card, blush-light background
- Latest or featured blog post
- Large image/illustration area, category badge, title, excerpt, "Read More →"

### Section 3: Health Topic Categories
- Section heading: *"Browse by health topic"*
- 6 category cards: Nutrition | Mental Health | Screening | Medical Conditions | Research | Wellness
- Each card: sage icon circle, category name, post count, 1-line description
- Grid: 1 col mobile → 2 col tablet → 3 col desktop
- Links to `/health-topics?category=X`

### Section 4: About the Doctor
- Two-column: photo/illustration left, content right
- Warm cream background
- Heading: *"A knowledgeable friend who happens to be a doctor"*
- Short intro: who the doctor is, philosophy, and what the site is for
- No clinical language; warm, human tone

### Section 5: Recent Articles
- Section heading: *"Latest from the blog"*
- 3-column grid of 3 most recent posts (BlogCard components)
- "View All Articles →" link to `/health-topics`

### Section 6: Virtual Consult CTA
- Blush-pink section background
- Headline: *"Have a health question? Talk to a real doctor."*
- Description: virtual consultation details (Zoom/Teams, visual assessment, R500/hr, 30min/1hr)
- CTA: "Book a Consult" (primary button)
- Note: button/form is non-functional in this phase; links to `/consult` page

---

## 4. Supporting Pages

### Health Topics (`/health-topics`)
- Hero: small heading + search bar
- Category filter chips (same 6 categories)
- Featured post at top
- Masonry/grid of all posts
- Pagination or infinite scroll

### Blog Post (`/health-topics/[slug]`)
- Title, author, date, category badge
- Large hero image area
- Rich content with good reading typography
- Inline "related post" links supported (existing MDX links)
- "Related Articles" section at bottom (same category)
- "Book a Consult" sidebar/bottom CTA

### About (`/about`)
- Hero: *"We believe everyone deserves to understand their health."*
- Doctor profile section
- Mission statement: health promotion, education, not a clinical practice
- What the site covers (health categories)
- CTA to Health Topics and Consult

### Consult (`/consult`)
- Hero: *"Virtual consultations from the comfort of home"*
- How it works: 3 steps (Book → Pay → Consult via Zoom/Teams)
- What's included: visual assessment, all devices, R500/hr, 30min or 1hr
- Platform: Zoom and Microsoft Teams logos
- Pricing card
- CTA button: "Book Now" (non-functional placeholder for now — Cal.com to be wired in Phase 2)

### Contact (`/contact`)
- Keep existing contact form and API
- Update styling to match new design system

---

## 5. Content Updates

### Key Messaging Changes
| Old | New |
|-----|-----|
| "Empowering Personal Health" | "Your health, explained clearly" |
| "Aliento Medical" | "Aliento" |
| "Personalised healthcare with cutting-edge technology" | "Health education, promotion, and virtual care" |
| Navigation: Services | Navigation: Health Topics |
| Book Appointment | Book a Consult |

### Blog Post Content (keep existing MDX, update frontmatter author)
- All 6 existing posts are well-written — keep content
- Update `author` field to a real name (placeholder: "Dr. Aliento")
- Ensure all category tags match the 6 defined categories
- Re-slug paths to work under `/health-topics/[slug]`

### New Content Needed (to be written by Writing skill)
- About page copy
- Consult page copy
- Homepage hero subtext + CTA labels
- Health topic category descriptions (for category cards)
- Footer tagline + mission blurb
- SEO metadata for all pages

---

## 6. Technical Notes

### What to Change
- `src/lib/design-system.ts` — update all color tokens to new palette
- `src/lib/theme.ts` — update theme colors
- `src/app/globals.css` — update CSS variables, keep font imports
- All section components — restyle to new palette and layout
- Header + Footer — full rewrite
- `src/app/layout.tsx` — update metadata (title, description)
- `src/app/page.tsx` — update homepage section composition
- Add new page: `src/app/consult/page.tsx`
- Rename blog routes (or alias `/health-topics` to `/blog` path)

### What NOT to Change
- Sanity integration (`src/lib/sanity.ts`, admin route) — leave untouched
- Cal.com embed (`src/components/integrations/CalEmbed.tsx`) — leave untouched
- Payment integration (`src/lib/payfast.ts`, payment routes) — leave untouched
- Contact form API (`src/app/api/contact/route.ts`) — leave untouched
- Blog data pipeline (`scripts/generate-blog-data.js`, blog MDX files) — leave untouched

### Logo Implementation
- Create `public/logo.svg` — wordmark + leaf/breath icon in sage
- Create `public/logo-white.svg` — white version for dark backgrounds
- Update Header to use SVG logo instead of text

---

## 7. Phase 2 Vision (Architecture Notes)

Design with these in mind — no implementation now:
- Screening/self-test tools embedded per health topic
- Product recommendations (Dis-Chem, Takealot, Clicks affiliate links)
- Future contributor system for blog (already in MDX author field)
- Category-specific landing pages with curated content

---

*Design approved by user on 2026-03-25.*
