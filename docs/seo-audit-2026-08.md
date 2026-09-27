# SEO Audit — alientomd.com (Aliento Health)

**Audit date:** 24 August 2026
**Auditor:** Independent technical + content SEO audit
**Scope:** Live site (curl, 2026-08-24) + repo `/root/aliento-nextjs` (Next.js 16.1.7 / React 19.2.3, Vercel auto-deploy on push to main)
**Compliance lens:** HPCSA rules — all recommendations below use factual claims only (pricing, process, credentials). No patient testimonials, outcome promises, or cure guarantees are suggested anywhere.

---

## 1. Executive Summary

### Current state

Aliento has a clean, fast, well-built Next.js codebase with sensible metadata foundations (`metadataBase`, OG/Twitter cards, `en_ZA` locale, title template). But **the site is effectively invisible to search engines and AI assistants at the infrastructure level**, and no page targets the commercial keywords its competitors rank for.

The three most damaging facts found during this audit:

1. **`https://alientomd.com/robots.txt` returns HTTP 404 and `https://alientomd.com/sitemap.xml` returns HTTP 404.** Neither `src/app/robots.ts`, `src/app/sitemap.ts`, nor a static `public/robots.txt` exists in the repo. There is no sitemap reference, no crawl guidance, and no explicit AI-crawler policy anywhere.
2. **Zero structured data is emitted on the live site.** The homepage served **0 JSON-LD blocks**. The only Article schema in the repo lives in `src/app/blog/[slug]/page.tsx:87-100` — a route that is **permanently redirected away** by `next.config.ts` (`/blog/:slug → /health-topics/:slug`, 308), so it never renders. There is no Organization, Physician, LocalBusiness, or FAQPage schema at all.
3. **No canonical tags exist on the live site** except dead code. The live article page (`/health-topics/when-to-see-a-doctor`) has no canonical, and its `og:url` falls back to the root (`https://alientomd.com`) because `health-topics/[slug]` defines no OpenGraph of its own.

Meanwhile, competitors (Udok, DirectDoc) have built dedicated keyword-targeted landing pages — `/sick-note-online-south-africa`, `/online-prescription-south-africa`, `/doctor-near-me-online-south-africa` — exactly matching the transactional queries Aliento's four service pages should own but currently don't (titles like "Sick Note — Aliento Health" don't contain "online" or "South Africa").

### Top 3 quick wins (highest impact ÷ effort)

| # | Fix | Effort | Impact |
|---|-----|--------|--------|
| 1 | Add `src/app/robots.ts` + `src/app/sitemap.ts` and push to main | ~30 min | Enables discovery/indexation of every page; unlocks Search Console reporting |
| 2 | Rewrite service-page titles/descriptions to match transactional SA queries ("Sick Note Online South Africa", "Repeat Prescription Online") and fix double-branding ("— Aliento Health \| Aliento") | ~1 hr | Makes existing money pages eligible to rank for their actual queries |
| 3 | Add `Organization`/`Physician` + `FAQPage` JSON-LD (home + service pages) with Dr Adonis's real credentials and machine-readable R250 pricing | ~2 hrs | Rich-result eligibility; strongest E-E-A-T lever available to a solo GP practice; directly feeds AI answers |

---

## 2. Technical Findings

Evidence convention: quotes below are from live curl responses (2026-08-24) or repo file/line references.

| # | Issue | Priority | Evidence | Impact | Fix |
|---|-------|----------|----------|--------|-----|
| T1 | **robots.txt missing (HTTP 404)** | P0 | `curl https://alientomd.com/robots.txt` → full HTML 404 app shell, `<meta name="robots" content="noindex"/>`, HTTP 404. RSC payload confirms it was routed as an app page: `"c":["","robots.txt"]`. Repo has no `public/robots.txt`, no `src/app/robots.ts`. | Crawlers get no directives; no sitemap pointer; no AI-bot policy. Wasted crawl on 404 pages. | Create `src/app/robots.ts` (snippet §7-A). |
| T2 | **sitemap.xml missing (HTTP 404)** | P0 | Same as above: `"c":["","sitemap.xml"]` → 404 app shell. | Pages are discovered only via links; new Sanity articles may take weeks to be found; Search Console can't report coverage properly. | Create `src/app/sitemap.ts` (§7-B). |
| T3 | **No canonical tags sitewide** | P0 | Live homepage head: `CANONICAL: []`. Live article `/health-topics/when-to-see-a-doctor`: `CANONICAL: []`. Only `alternates.canonical` in repo is `blog/[slug]/page.tsx:36-38` — unreachable (redirected). Root `layout.tsx` defines no alternates. | Duplicate/noisy URLs (UTMs, query params like `/health-topics?category=Nutrition`) can dilute signals; Google chooses canonicals for you. | Add per-page `alternates.canonical`; do **not** put one in root layout (child metadata would inherit `canonical: '/'` for every page). See §7-C. |
| T4 | **Article schema is dead code; zero live JSON-LD** | P0 | `next.config.ts` redirects `/blog/:slug` → `/health-topics/:slug` (308). All schema + canonical logic sits in the redirected route. Live article: `LD+JSON count: 0`. No Organization/Physician/FAQPage anywhere in repo (`rg 'ld\+json' src` → only blog/[slug]). | No rich results; weak entity signals for Dr Adonis/Aliento; invisible to LLM answer engines' structured extraction. | Move Article JSON-LD into `health-topics/[slug]/page.tsx`; add Physician/Organization on home; FAQPage on service pages (§7-D/E/F). |
| T5 | **Wrong-domain fallback for blog URLs** | P1 | `blog/[slug]/page.tsx:29,82`: `process.env.NEXT_PUBLIC_SITE_URL \|\| 'https://aliento.africa'`. If `NEXT_PUBLIC_SITE_URL` is unset in Vercel, any reuse of this pattern emits wrong-domain canonicals/OG URLs. Currently masked only because the route redirects. | Latent risk: cross-domain canonicals would de-index your content. | Standardise on `'https://alientomd.com'`; confirm `NEXT_PUBLIC_SITE_URL=https://alientomd.com` in Vercel env vars. |
| T6 | **Funnel/transformation pages are indexable** | P1 | No `robots` meta on: `/consult/book`, `/consult/bookings`, `/consult/reschedule`, `/consult/cancel/*`, `/questionnaire`, `*/questionnaire`, `*/confirmed`, `/prescription/[scriptId]`. Several inherit the root default title ("Aliento — Breathe, Screen, Live"). Only `/admin` is protected (`admin/layout.tsx:8` `robots: 'noindex, nofollow'`). | Personalised/thin pages can enter the index, create duplicates, and leak "Payment Confirmed" titles into SERPs. | Add `robots: { index: false }` metadata to all funnel routes (§7-G). |
| T7 | **Double-branded titles via template collision** | P1 | Title template is `%s | Aliento` (`layout.tsx:10`) but three pages hardcode brand again: `"Get a Prescription — Aliento Health"`, `"Sick Note — Aliento Health"`, `"Second Opinion — Aliento Health"` → render as e.g. *"Get a Prescription — Aliento Health | Aliento"*. | Wastes title pixels, looks spammy in SERPs. | Drop "— Aliento Health" from those three exports; put keywords there instead. |
| T8 | **Pages with no metadata export** | P1 | No `export const metadata` in: `page.tsx` (home), `contact/page.tsx`, `blog/page.tsx` (redirected anyway), `consult/book/page.tsx`, `consult/reschedule/page.tsx`, all `*/questionnaire/page.tsx`. Home inherits default; contact shows *"Aliento — Breathe, Screen, Live"* in SERPs. | Contact page SERP entry is brand-only; home never mentions price/service keywords in title. | Add metadata to contact; rewrite home default (§7-H). |
| T9 | **Dead routes consuming nav/metadata effort** | P2 | `next.config.ts`: `/services → /` (307), `/blog → /health-topics` (308). `services/page.tsx` metadata ("Our Services… diagnostics…") unreachable; nav "Services" dropdown items point to real pages (OK). | Confusing; "diagnostics" claim in unreachable copy isn't a service offered per business description. | Delete or redirect-aware cleanup; keep 308s (they're fine for users). |
| T10 | **Heading issues** | P2 | Two `<h1>` elements: `prescription/[scriptId]/page.tsx`, `consult/confirmed/[bookingUid]/page.tsx`. Indexable pages with **no H1**: `/health-topics` renders H1 "Breathe, Screen, Live." (brand tagline, duplicated conceptually with logo tagline); `/about` H1 lives in `About.tsx:39` (fine); home H1 = "Your health, explained clearly." (poetic, zero keywords). | Weak topical signal on the two most important content hubs. | One descriptive H1 per page; make `/health-topics` H1 keyword-bearing ("Health Topics: Expert Articles by Dr Leegale Adonis"). |
| T11 | **Internal linking gaps** | P2 | Home body links all four services ✔ (`/consult`, `/prescription`, `/second-opinion`, `/sick-note` confirmed in live HTML). But footer "Explore" column omits prescription/sick-note/second-opinion (only `/consult` present) — verified in live footer markup. Blog articles render via shared `BlogPostContent` with **no service CTAs** (checked component imports). | Money pages lose sitewide link equity; articles don't convert readers to bookings. | Add the three missing service links to `Footer.tsx`; add a contextual CTA block at the end of `BlogPostContent`. |
| T12 | Image alt text | OK ✔ | Repo regex for `<img>` without alt: none found. Live homepage: 3 imgs, all with alt. | — | Keep the standard when adding images. |
| T13 | HTTPS/HSTS/host | OK ✔ | `strict-transport-security: max-age=63072000`, `server: Vercel`, HTTP/2 200. | — | — |

**Not verifiable from here (be aware):** Core Web Vitals field data (needs PageSpeed/CrUX), index coverage (needs Google Search Console access), backlink profile. Recommend connecting GSC + Bing Webmaster Tools first thing after shipping T1–T4.

---

## 3. On-Page Findings Per Page

Title lengths account for the `%s | Aliento` template where applicable. "Default" = inherits root layout metadata.

| URL | Title (rendered) | Description | H1 | Verdict |
|-----|------------------|-------------|----|---------|
| `/` | "Aliento — Breathe, Screen, Live" (31 ch, brand-only) | 186 ch, education-first, mentions "virtual medical consultations" but no price/keyword anchor ("online doctor South Africa" absent) | "Your health, explained clearly." | ❌ **Rewrite.** Most important page targets no commercial query. Suggest default title ≈ "Online Doctor South Africa — R250 Virtual GP Consultations \| Aliento". |
| `/consult` | "Book a Virtual Consultation \| Aliento" (38 ch) ✔ | "Book a virtual face-to-face medical consultation. R250 for 20 min or R500 for 35 min." ✔ pricing in meta | ✔ single | 🟡 **Good base;** add "South Africa / online doctor consultation" phrasing + FAQPage schema. |
| `/prescription` | "Get a Prescription — Aliento Health \| Aliento" (double-brand) | "Request a medication script refill online. R250 — … within 24 hours." ✔ | ✔ | ❌ **Rewrite title** → "Repeat Prescription Online South Africa"; keep desc. |
| `/sick-note` | "Sick Note — Aliento Health \| Aliento" (weak keyword) | "Request a sick leave assessment online. R250 — … within 24 hours." | ✔ | ❌ **Rewrite title** → "Sick Note Online South Africa"; add BCEA/validity FAQ (factual). |
| `/second-opinion` | "Second Opinion — Aliento Health \| Aliento" | "Get an independent second opinion on your diagnosis. R250 — …" | ✔ | 🟡 Title → "Second Medical Opinion Online South Africa". |
| `/about` | "About Us \| Aliento" (generic) | 148 ch incl. full credential string MBBCH/MBA/FCPHM/MMed/PhD ✔ | ✔ (in `About.tsx:39`) | 🟡 Title → "About Dr Leegale Adonis — Public Health Specialist, Johannesburg". Strong E-E-A-T page; add Person/Physician schema. |
| `/contact` | *(none — inherits default)* | *(inherits default)* | ✔ | ❌ Add export: title "Contact Aliento — Online Doctor Support", desc with email + hours. |
| `/health-topics` | "Health Topics \| Aliento" (23 ch, thin) | "Browse expert-backed articles on nutrition, mental health…" (111 ch) ✔ | "Breathe, Screen, Live." ❌ | 🟡 Better H1 + title: "Health Articles by a Doctor — Nutrition, Chronic Care…". This is the blog hub; treat as content pillar. |
| `/health-topics/[slug]` | dynamic from Sanity ✔ (e.g. "When to See a Doctor: A Complete Guide \| Aliento") | excerpt-based ✔ (sometimes raw/marketing-y copy, e.g. leading line "To see a doctor or not to see a doctor - that is the question.") | ✔ | 🟡 Missing canonical/OG/Article schema (see T3/T4). Descriptions would benefit from a 140–160 ch excerpt discipline in Sanity. |
| `/how-we-use-ai` | "How We Use AI \| Aliento" | transparency copy ✔ | ✔ | ✔ Good trust page; keep. Minor: target long-tail "is ai used in telemedicine" opportunistically. |
| `/consult/book`, `/consult/bookings`, `/consult/reschedule`, `*/questionnaire`, `*/confirmed`, `/prescription/[scriptId]` | mixed; several inherit default; e.g. "Manage Bookings \| Aliento", "Sick Leave Assessment — Payment Confirmed" | n/a | ⚠️ 2×H1 on `prescription/[scriptId]`, `consult/confirmed/[bookingUid]` | ❌ **noindex all funnel routes** (T6). |
| `/admin/**` | "Aliento Admin" + `noindex, nofollow` ✔ | — | — | ✔ Correctly excluded. |
| `/services`, `/blog` | 307→`/`, 308→`/health-topics` | — | — | ✔ Redirects fine; delete orphan files eventually. |

Duplicate titles across pages: none exact. Too-short (<25 ch): `/about`, `/health-topics`. Too-long (>60 ch): none. Missing entirely: `/contact` + 6 funnel routes.

---

## 4. Keyword Opportunity Table

**Methodology note (honesty first):** I had no paid keyword-tool access during this audit, so **no search volumes are quoted — none below are fabricated**. Priorities are inferred from observable evidence: which queries competitors build dedicated landing pages for (strongest signal of commercial value), ad presence, SERP composition from live searches (2026-08-24), and fit with Aliento's R250 cash-pay positioning. Verify volumes in GSC/Keyword Planner once T1/T2 ship.

Live competitor pricing gathered during research (useful for content + comparison pages):

| Provider | Price (verified Aug 2026) | Source |
|---|---|---|
| Discovery Prepaid Health | R180 online consult | discovery.co.za/prepaidhealth |
| Kena Health | R235 (site); R185 cited in Old Mutual/Next176 PR | kena.health/get-started |
| DirectDoc | R250 cash patient | directdoc.co.za |
| **Aliento** | **R250 (20 min) / R500 (35 min)** | alientomd.com/consult meta |
| EasyCare | R260 | easycare.health |
| Hello Doctor | R265 (own site); R284 (Momentum page) | hellodoctor.co.za |
| Dis-Chem Clinic Connect | R275 virtual (nurse-led) | dischem.co.za/clinic-connect |
| Doctors on Demand | R285 all-inclusive | doctorsondemand.co.za |
| WhatsUpDoctor | R350, 24/7 WhatsApp | whatsupdoctor.co.za |
| Udok | R299 base; R365 early weekday; R450 after-hours/holidays | udok.co.za |
| Docotela | R390 productised incl. note/script/referral | docotela.co.za |
| Intercare | R390 on-demand | intercare.co.za |
| Zapmed | R450 once-off; R220 p/m subscription | zapmed.co.za/pricing |
| EDOC Health | R450 / 15 min | edochealth.co.za |

Aliento is **joint-cheapest branded telehealth option** — this is a genuinely marketable fact (state it factually: "R250 per virtual consultation").

| Query | Intent | Priority | Best target page | Notes / who ranks now |
|---|---|---|---|---|
| online doctor south africa | Transactional | **P0** | `/` (rewrite) + `/consult` | Udok, DirectDoc, EDOC compete; DirectDoc even built `/doctor-near-me-online-south-africa/`. Aliento's home currently targets nothing. |
| sick note online south africa · get a sick note online · medical certificate online | Transactional | **P0** | `/sick-note` (rewrite) + explainer article | Udok has dedicated landing `app.udok.co.za/sick-note-online-south-africa` w/ FAQ; WhatsUpDoctor `/dr-sick-note/`; DirectDoc blog post ranks. Aliento title says just "Sick Note". |
| online prescription south africa · repeat prescription online · script renewal | Transactional | **P0** | `/prescription` (rewrite) + how-to article | Udok landing `/online-prescription-south-africa`; Doxi markets "Script Refill/Renewals"; Pharmacy Direct explains upload-vs-consult. |
| virtual doctor consultation · online gp consultation | Transactional | **P1** | `/consult` | Crowded but high-value; differentiate on fixed R250 + named doctor. |
| doctor without medical aid · affordable private doctor no aid | Transactional | **P1** | New cost-comparison page (§5-C3) | Discovery Prepaid, NetcarePlus vouchers, NeoHealth fee tables compete. Nobody owns "the forgotten middle" framing. |
| private doctor cost south africa · how much is a gp visit south africa · online doctor cost | Informational→Transactional | **P1** | Cost-comparison page | Udok FAQ targets "How much does a GP consultation cost in South Africa?"; NeoHealth publishes full fee table (ranks well). Factual price ranges + citations win here. |
| telehealth south africa | Commercial research | **P1** | `/` secondary / hub article | Head term; apps dominate (Kena, E-Care, Lotus Life, DocTalk pre-launch). Long game via content hub. |
| second medical opinion online | Transactional | **P2** | `/second-opinion` | Low competition; low volume but perfect buyer intent. |
| how to get a sick note (informational) · bcea sick note rules · sick note requirements employer sa | Informational | **P1** | Blog article → CTA `/sick-note` | Global Business (globalbusiness.co.za) and Labourwise rank with legal explainers; a doctor-authored medically+legally accurate version is differentiated and HPCSA-safe. |
| when to see a doctor [condition] | Informational | **Ongoing** | Existing `/health-topics` posts | Already publishing adjacent content; needs schema + authorship signals + internal CTAs to pay off. |
| gp johannesburg · online doctor johannesburg | Local/Transactional | **P2** | `/about` + LocalBusiness-style schema | Practice is Johannesburg-based & virtual-first; local schema helps map-pack-adjacent results without claiming walk-in services. |

---

## 5. Content Gap Analysis & Recommendations

### What competitors have that Aliento doesn't

1. **Keyword-matched service landing pages.** Udok: `/sick-note-online-south-africa`, `/online-prescription-south-africa` (both with FAQs, pricing, step lists, HPCSA mentions). DirectDoc: `/doctor-near-me-online-south-africa/`. Aliento's equivalent pages exist but carry non-search titles.
2. **FAQ blocks on money pages.** Udok answers "Can I get a sick note without seeing a doctor?" etc. on-page. Aliento's service pages are questionnaire funnels with no FAQ text for crawlers/LLMs to lift.
3. **Legal-validity content around sick notes.** Multiple ranking pieces discuss whether employers must accept e-certificates (Global Business, Labourwise, Doctor In Your Pocket). A doctor-authored version is a clear gap.
4. **Transparent price tables.** NeoHealth/Zapmed publish full fee tables that rank for cost queries. Aliento buries R250 in meta descriptions.
5. **Visible freshness + authorship.** Competitor blogs show dated, attributed posts. Aliento articles *do* render author name + date (`BlogPostContent.tsx:302–308`) but the author is unlinked, credentials aren't shown next to articles, and there's no dateModified.

### Recommended content (all HPCSA-safe — factual, no outcome claims)

| # | Piece | Target keywords | Format / notes |
|---|---|---|---|
| C1 | **"How to Get a Valid Sick Note Online in South Africa (2026)"** — what BCEA s.23 requires, what a valid certificate contains (doctor name, practice number, date, period), when online issuance applies, employer acceptance. CTA → `/sick-note`. | how to get a sick note online, medical certificate south africa, sick note requirements | 1,200–1,500 words, FAQ section + FAQPage schema, authored by Dr Adonis with credential byline. State facts; explicitly note acceptance is at employer discretion and issuance follows assessment. |
| C2 | **"How to Renew a Repeat Prescription Online Without Visiting a Doctor"** — step-by-step of Aliento's actual async flow (questionnaire → doctor review ≤24h → script sent to pharmacy), which medicine categories require more than a repeat script (stated neutrally), pharmacy collection vs delivery. CTA → `/prescription`. | online prescription south africa, repeat prescription online, script renewal online | Include honest limits (e.g., controlled substances need fuller consultation) — compliance-safe and builds trust. |
| C3 | **"What Does a Private Doctor Cost in South Africa Without Medical Aid? (2026 Price Guide)"** — factual ranges from public fee pages (cite sources): R180–R620 span observed above; where a R250 virtual GP fits; hidden costs of time-off-work + travel vs telehealth. | private doctor cost south africa, doctor without medical aid, gp fees, online doctor cost | The "forgotten middle" cornerstone page. Update annually (freshness signal). No competitor disparagement — prices only, sourced. |
| C4 | **"Telehealth vs Government Clinics vs Medical Aid: Options for South Africans Paying Cash"** — decision-guide comparing wait times, costs, continuity of care; neutral tone. | doctor without medical aid, telehealth south africa, affordable doctor | Links to C3 + all four services. Targets the exact audience described in the brief. |
| C5 | **Refresh top 5 existing `/health-topics` posts** (start: `when-to-see-a-doctor`, `health-insurance-versus-medical-aids`, `recommended-total-screening-package`) — add author bio box (credentials + HPCSA reg), reviewed-on date, Article schema, and one contextual CTA each to the relevant service. | long-tail informational | Cheapest wins: content exists; it just lacks trust signals and conversion paths. |

---

## 6. AI-SEO Checklist

| Check | Status | Evidence | Recommendation |
|---|---|---|---|
| robots.txt exists | ❌ FAIL | HTTP 404 | Ship `src/app/robots.ts` (§7-A) |
| robots.txt references sitemap | ❌ FAIL | No robots.txt | Included in §7-A |
| AI crawlers allowed (GPTBot, PerplexityBot, ClaudeBot, Google-Extended…) | ⚠️ DEFAULT-ALLOW | No robots.txt ⇒ everything allowed by accident, including crawls of admin/funnel paths | Make it explicit: allow AI bots on content, disallow `/admin`, `/api`, funnel paths (§7-A) |
| llms.txt | ❌ FAIL | `curl .../llms.txt` → 404; none in repo | Add `public/llms.txt` (§7-I) |
| Machine-readable pricing | ⚠️ PARTIAL | R250 appears in meta descriptions and (per repo copy) page bodies; not in any structured format | Add `Offer`/priceRange in Physician schema + visible price tables; keep amounts consistent everywhere |
| FAQPage schema | ❌ FAIL | No ld+json sitewide | Add to `/consult`, `/sick-note`, `/prescription` (§7-F) |
| Organization / Physician schema | ❌ FAIL | None | §7-D — highest-value fix for a solo practice |
| Article/BlogPosting schema | ❌ FAIL (live) | Exists only in redirected `/blog/[slug]`; live article shows `LD+JSON count: 0` | Move into `health-topics/[slug]` (§7-E) |
| Author attribution on articles | 🟡 PARTIAL | Name + date render (`BlogPostContent.tsx:302–308`) but unlinked, no credentials beside articles | Bio box: "Dr Leegale Adonis, MBBCH MBA FCPHM (SA)… HPCSA-registered" + link to `/about`; add `dateModified` when edited |
| Credentials displayed (E-E-A-T) | 🟡 GOOD base | About page shows full degrees + HPCSA No. (`About.tsx:128–158`) | Surface same credential line under every article + Person schema |
| Freshness signals (visible dates) | 🟡 PARTIAL | Dates render on listing/cards; article pages show publishedAt; no updated-at | Show "Reviewed: <date>" on articles; refresh C3/C1 annually |
| Content accessible to simple crawlers | ✔ PASS | All audited pages server-render full HTML (Next.js SSR) — no JS-gating of content found | Keep SSR for all content pages |

---

## 7. 30-Day Action Plan (copy-paste ready)

### P0 — Week 1: Crawlability & indexation

**A. Create `src/app/robots.ts`**

```ts
import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin',
          '/questionnaire',
          '/consult/book',
          '/consult/bookings',
          '/consult/reschedule',
          '/*/questionnaire',
          '/*/confirmed',
          '/prescription/', // covers /[scriptId]
        ],
      },
      {
        // Explicit AI-crawler policy: welcome AI engines to public content
        userAgent: [
          'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
          'PerplexityBot', 'ClaudeBot', 'anthropic-ai',
          'Google-Extended', 'Applebot-Extended',
        ],
        allow: '/',
        disallow: ['/api/', '/admin'],
      },
    ],
    sitemap: 'https://alientomd.com/sitemap.xml',
  }
}
```

**B. Create `src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/sanity'
import { fallbackPosts } from '@/lib/health-topics-fallbacks'

const BASE = 'https://alientomd.com'

export const dynamic = 'force-dynamic' // re-evaluate on deploy; Sanity posts included

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['', '/consult', '/prescription', '/sick-note',
    '/second-opinion', '/about', '/contact', '/how-we-use-ai',
    '/health-topics'].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date(),
    changeFrequency: p === '' ? 'weekly' : 'monthly',
    priority: p === '' ? 1 : p.startsWith('/consult') || ['/prescription','/sick-note','/second-opinion'].includes(p) ? 0.9 : 0.6,
  }) as MetadataRoute.Sitemap[number])

  let posts: { slug: { current: string }; publishedAt?: string }[] = []
  try { posts = await getAllPosts() } catch { posts = fallbackPosts }

  return [
    ...staticRoutes,
    ...posts.map((p) => ({
      url: `${BASE}/health-topics/${p.slug.current}`,
      lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
```

Push to main → Vercel deploys both automatically. Then verify `curl https://alientomd.com/robots.txt` returns text and register the site in **Google Search Console + Bing Webmaster Tools**; submit the sitemap.

**C. Canonicals — per page, not in root layout.**
⚠️ Do NOT add `alternates` to `layout.tsx` (every child would inherit `canonical: '/'`). Add per key page:

```ts
// e.g. src/app/consult/page.tsx
export const metadata: Metadata = {
  alternates: { canonical: 'https://alientomd.com/consult' },
  // ...
}
```

And in `src/app/health-topics/[slug]/page.tsx` `generateMetadata`, extend the returned object:

```ts
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alientomd.com'
return {
  title: post.title,
  description: post.excerpt ?? '',
  alternates: { canonical: `${siteUrl}/health-topics/${slug}` },
  openGraph: { type: 'article', url: `${siteUrl}/health-topics/${slug}`, /* … */ },
}
```

Also set **`NEXT_PUBLIC_SITE_URL=https://alientomd.com`** in Vercel project env vars (currently the only fallback is `aliento.africa`, `blog/[slug]/page.tsx:29`).

**D. Organization + Physician JSON-LD — add to `src/app/page.tsx` (home)**

```tsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'MedicalOrganization',
      '@id': 'https://alientomd.com/#org',
      name: 'Aliento Health',
      url: 'https://alientomd.com',
      email: 'info@alientomd.com',
      logo: 'https://alientomd.com/logo-icon.svg',
      areaServed: 'ZA',
      priceRange: 'R250',
    },
    {
      '@type': 'Physician',
      '@id': 'https://alientomd.com/#dr-adonis',
      name: 'Dr Leegale Franscesca Adonis',
      honorsSuffixes: 'MBBCh, MBA, FCPHM (SA), MMed Community Health, PhD',
      worksFor: { '@id': 'https://alientomd.com/#org' },
      url: 'https://alientomd.com/about',
      address: { '@type': 'PostalAddress', addressLocality: 'Johannesburg', addressCountry: 'ZA' },
      medicalSpecialty: ['PublicHealth', 'GeneralPractice' ],
      knowsAbout: ['Preventive care','Screening','Chronic disease management','Health promotion'],
    },
  ],
}

// inside the page component return:
<Script id="org-physician" type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
```

(Factual descriptors only — registration numbers/degrees already shown on `/about`. Confirm specialty terms with Dr Adonis before shipping.)

**E. Article schema — move into `src/app/health-topics/[slug]/page.tsx`** (port the block from `blog/[slug]/page.tsx:87–100`, adding publisher, author as `Person` linked to `/about`, and `dateModified` fallback to `datePublished`). Delete the dead `/blog` route files after migration if desired.

### P1 — Weeks 2–3: On-page targeting & trust

**F. FAQPage schema on service pages** (example for `/sick-note`; keep answers strictly factual):

```tsx
const faqLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How do I get a sick note online in South Africa?',
      acceptedAnswer: { '@type': 'Answer', text: 'Complete an online assessment questionnaire. An HPCSA-registered doctor reviews your submission and, if clinically appropriate, issues a digital medical certificate within 24 hours.' }},
    { '@type': 'Question', name: 'How much does an online sick note cost?',
      acceptedAnswer: { '@type': 'Answer', text: 'R250 per sick leave assessment at Aliento.' }},
    { '@type': 'Question', name: 'Will my employer accept an online medical certificate?',
      acceptedAnswer: { '@type': 'Answer', text: 'A certificate issued after a proper consultation with a registered medical practitioner meets the BCEA requirement that it be issued and signed by a medical practitioner. Final acceptance is at the employer\'s discretion.' }},
  ],
}
```
Plus matching visible FAQ text on the page (Google requires the content be present on-page). Similar sets for `/consult` (pricing/times) and `/prescription` (process/timelines).

**G. Noindex funnel pages** — add to each of: `consult/book`, `consult/bookings`, `consult/reschedule`, `consult/cancel/[bookingUid]`, `consult/confirmed/[bookingUid]`, `questionnaire/page.tsx`, `questionnaire/confirmed`, `{sick-note,prescription,second-opinion}/questionnaire`, `*/confirmed`:

```ts
export const metadata: Metadata = { robots: { index: false, follow: false } }
```

**H. Title/description rewrites (exact strings)**

| File | Replace with |
|---|---|
| `layout.tsx` `title.default` | `'Online Doctor South Africa — R250 Virtual GP Consultations \| Aliento'` |
| `layout.tsx` `description` | `'Consult a registered South African doctor online for R250. Sick notes, repeat prescriptions and second opinions reviewed by Dr Leegale Adonis within 24 hours.'` |
| `contact/page.tsx` *(add)* | `title: 'Contact Aliento — Online Doctor Support'`, `description: 'Questions about virtual consultations, prescriptions or sick notes? Email info@alientomd.com — Johannesburg-based, serving all of South Africa.'` |
| `prescription/page.tsx` | `title: 'Repeat Prescription Online South Africa'` (template adds `\| Aliento`; removes double-brand) |
| `sick-note/page.tsx` | `title: 'Sick Note Online South Africa'` |
| `second-opinion/page.tsx` | `title: 'Second Medical Opinion Online South Africa'` |
| `health-topics/page.tsx` | `title: 'Doctor-Written Health Articles'`; update rendered H1 (in the topics hero) from "Breathe, Screen, Live." to something like "Health Topics, Explained by a Doctor" |

**I. Create `public/llms.txt`** (static file is fine):

```
# Aliento Health
> South African online medical practice led by Dr Leegale Franscesca Adonis
> (MBBCh, MBA, FCPHM (SA), MMed Community Health, PhD), Johannesburg.
> Virtual GP consultations R250 (20 min); prescriptions, sick notes and
> second opinions issued after doctor review, usually within 24 hours.
> Cash-pay patients welcome; no medical aid required.

- [Home](https://alientomd.com/)
- [Virtual consultation](https://alientomd.com/consult)
- [Prescriptions](https://alientomd.com/prescription)
- [Sick notes](https://alientomd.com/sick-note)
- [Second opinions](https://alientomd.com/second-opinion)
- [About Dr Adonis](https://alientomd.com/about)
- [Health articles](https://alientomd.com/health-topics)
- [AI transparency](https://alientomd.com/how-we-use-ai)
```

**J. Internal linking:** add `/prescription`, `/sick-note`, `/second-opinion` to the footer Explore list in `src/components/layout/Footer.tsx` (mirroring `Header.tsx:21–23`); append a service CTA card at the end of `src/app/blog/[slug]/BlogPostContent.tsx`.

### P2 — Week 4: Content & measurement

1. Publish C1 (sick-note explainer) and C2 (prescription how-to) in Sanity with author bio box + "Reviewed on" date; interlink to service pages.
2. Build C3 (cost guide, 2026 edition) as a new page or flagship article; include the sourced price table from §4.
3. Refresh top 5 existing articles (C5): bio box, dates, one contextual CTA each.
4. Fix duplicate H1s in `prescription/[scriptId]/page.tsx` and `consult/confirmed/[bookingUid]/page.tsx`.
5. Connect Google Search Console + Bing Webmaster Tools; after 2–3 weeks, pull real query/impression data to validate priorities in §4 (replaces the estimate caveat honestly).
6. Optional: verify rich results with Google's Rich Results Test on `/`, an article, and `/sick-note`.

---

## Appendix: Raw evidence log

- `curl https://alientomd.com/robots.txt` → HTTP 404; body is the Next.js 404 shell containing `<meta name="robots" content="noindex"/>` and RSC payload `"c":["","robots.txt"]`.
- `curl https://alientomd.com/sitemap.xml` → HTTP 404; same signature (`"c":["","sitemap.xml"]`).
- `curl https://alientomd.com/llms.txt` → 404; `llms-full.txt` → 404.
- `curl https://alientomd.com/` → HTTP 200; head contains title/description/OG/twitter, **zero** `rel=canonical`, **zero** `application/ld+json`; body H1 "Your health, explained clearly."; internal links include all four services.
- `curl https://alientomd.com/blog` → 308 → `/health-topics`; `/services` → 307 → `/` (matches `next.config.ts` redirects).
- `curl https://alientomd.com/health-topics/when-to-see-a-doctor` → title/desc present; **no canonical**; `og:url = https://alientomd.com` (root fallback); **0 ld+json**.
- Repo greps: no `robots*`/`sitemap*`/`llms*` files outside node_modules; only `alternates` occurrence is `blog/[slug]/page.tsx:36`; only `ld+json` occurrence is `blog/[slug]/page.tsx:87`; `NEXT_PUBLIC_SITE_URL` fallback `aliento.africa` at `blog/[slug]/page.tsx:29,82`; admin noindex at `admin/layout.tsx:8`; package.json pins next 16.1.7.
