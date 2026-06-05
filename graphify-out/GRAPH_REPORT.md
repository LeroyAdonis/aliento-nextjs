# Graph Report - .  (2026-06-04)

## Corpus Check
- 172 files · ~84,623 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 503 nodes · 733 edges · 58 communities (34 shown, 24 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 53 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Questionnaire Wizard|Questionnaire Wizard]]
- [[_COMMUNITY_Blog & Sanity CMS|Blog & Sanity CMS]]
- [[_COMMUNITY_Medical Content Authors|Medical Content Authors]]
- [[_COMMUNITY_Health Blog Articles|Health Blog Articles]]
- [[_COMMUNITY_API Routes & Database|API Routes & Database]]
- [[_COMMUNITY_Plans & Brand Assets|Plans & Brand Assets]]
- [[_COMMUNITY_Home Page Sections|Home Page Sections]]
- [[_COMMUNITY_Questionnaire Validation Schemas|Questionnaire Validation Schemas]]
- [[_COMMUNITY_MDX Migration Scripts|MDX Migration Scripts]]
- [[_COMMUNITY_Cal.com Booking API|Cal.com Booking API]]
- [[_COMMUNITY_Consult Booking UI|Consult Booking UI]]
- [[_COMMUNITY_App Layout & Navigation|App Layout & Navigation]]
- [[_COMMUNITY_Admin Editor & Posts|Admin Editor & Posts]]
- [[_COMMUNITY_Services Section|Services Section]]
- [[_COMMUNITY_Sanity Studio Config|Sanity Studio Config]]
- [[_COMMUNITY_About Page|About Page]]
- [[_COMMUNITY_PayFast Payment Gateway|PayFast Payment Gateway]]
- [[_COMMUNITY_Sanity Studio Schemas|Sanity Studio Schemas]]
- [[_COMMUNITY_MDX-to-Sanity Migration|MDX-to-Sanity Migration]]
- [[_COMMUNITY_Consult Booking Flow|Consult Booking Flow]]
- [[_COMMUNITY_Dev Scripts|Dev Scripts]]
- [[_COMMUNITY_Reschedule Booking|Reschedule Booking]]
- [[_COMMUNITY_System README|System README]]
- [[_COMMUNITY_Dev Proxy|Dev Proxy]]
- [[_COMMUNITY_Contact API|Contact API]]
- [[_COMMUNITY_Admin Post CRUD API|Admin Post CRUD API]]
- [[_COMMUNITY_Process Section|Process Section]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_Questionnaire Confirmed|Questionnaire Confirmed]]
- [[_COMMUNITY_Cal.com Embed|Cal.com Embed]]
- [[_COMMUNITY_PayFast Button|PayFast Button]]
- [[_COMMUNITY_Why Choose Us Section|Why Choose Us Section]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Conditions Section|Conditions Section]]
- [[_COMMUNITY_Design System|Design System]]
- [[_COMMUNITY_Theme Config|Theme Config]]
- [[_COMMUNITY_Agent Plans|Agent Plans]]
- [[_COMMUNITY_Studio Deploy|Studio Deploy]]
- [[_COMMUNITY_Lint Output|Lint Output]]
- [[_COMMUNITY_File Icon|File Icon]]
- [[_COMMUNITY_Vercel SSO|Vercel SSO]]
- [[_COMMUNITY_Superpowers Plan Doc|Superpowers Plan Doc]]
- [[_COMMUNITY_Globe Icon|Globe Icon]]
- [[_COMMUNITY_Next.js Logo|Next.js Logo]]
- [[_COMMUNITY_Vercel Logo|Vercel Logo]]
- [[_COMMUNITY_Window Icon|Window Icon]]

## God Nodes (most connected - your core abstractions)
1. `Welcome to Aliento's Health Blog` - 12 edges
2. `Chronic Care blog category` - 12 edges
3. `getAllPosts()` - 10 edges
4. `Aliento Health Clinic` - 10 edges
5. `getCalBookingByUid()` - 8 edges
6. `The Power of Preventive Care: Why Waiting Costs You` - 8 edges
7. `TextareaField()` - 7 edges
8. `SectionDivider()` - 7 edges
9. `sendEmail()` - 7 edges
10. `SanityPost` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Default Blog Category Image (SVG)` --conceptually_related_to--> `Health Topic Categories (Nutrition, Mental Health, Screening, Medical Conditions, Research, Wellness)`  [AMBIGUOUS]
  public/images/blog/default.svg → docs/plans/2026-03-25-aliento-health-promotion-redesign.md
- `Health Topic Categories (Nutrition, Mental Health, Screening, Medical Conditions, Research, Wellness)` --conceptually_related_to--> `Chronic Care Blog Category Image (SVG)`  [INFERRED]
  docs/plans/2026-03-25-aliento-health-promotion-redesign.md → public/images/blog/chronic-care.svg
- `Health Topic Categories (Nutrition, Mental Health, Screening, Medical Conditions, Research, Wellness)` --conceptually_related_to--> `Medical Insights Blog Category Image (SVG)`  [INFERRED]
  docs/plans/2026-03-25-aliento-health-promotion-redesign.md → public/images/blog/medical-insights.svg
- `Health Topic Categories (Nutrition, Mental Health, Screening, Medical Conditions, Research, Wellness)` --conceptually_related_to--> `Mental Health Blog Category Image (SVG)`  [INFERRED]
  docs/plans/2026-03-25-aliento-health-promotion-redesign.md → public/images/blog/mental-health.svg
- `Health Topic Categories (Nutrition, Mental Health, Screening, Medical Conditions, Research, Wellness)` --conceptually_related_to--> `Nutrition Blog Category Image (SVG)`  [INFERRED]
  docs/plans/2026-03-25-aliento-health-promotion-redesign.md → public/images/blog/nutrition.svg

## Communities (58 total, 24 thin omitted)

### Community 0 - "Questionnaire Wizard"
Cohesion: 0.09
Nodes (30): useRHFPersistence(), cn(), metadata, Props, Props, QuestionnaireWizard(), STEPS, stepSchemas (+22 more)

### Community 1 - "Blog & Sanity CMS"
Cohesion: 0.1
Nodes (30): BlogClient(), BlogClientProps, getCategoryColor(), getCategoryGradient(), BlogPage(), fallbackCategories, fallbackPosts, HealthTopicsPage() (+22 more)

### Community 2 - "Medical Content Authors"
Cohesion: 0.09
Nodes (38): Aliento Medical author, Dr. Aliento Team author, Prof. Leegail Adonis author, Aliento Health Clinic, Asthma and Cough-variant Asthma, Cardiovascular Health Ischemic Heart Disease, Chronic Care blog category, Chronic Condition Management (+30 more)

### Community 3 - "Health Blog Articles"
Cohesion: 0.12
Nodes (35): Coughing, Coughing, Coughing - Asthma, Cardiovascular Health: Stay Informed, 5 Tips for Managing Chronic Conditions, Diabetes Mellitus - Everything You Need to Know, Hypertension (High Blood Pressure), How to Boost Your Immune System Naturally This Winter, Mental Health Matters: Breaking the Stigma in South Africa, Understanding Personalised Medicine: The Future of Healthcare (+27 more)

### Community 4 - "API Routes & Database"
Cohesion: 0.11
Nodes (23): GET(), escapeHtml(), POST(), db, sql, payments, questionnaires, EmailPurpose (+15 more)

### Community 5 - "Plans & Brand Assets"
Cohesion: 0.07
Nodes (31): Aliento Blog Changes Implementation Plan, Breathe Screen Live Tagline, Cal.com Embed Booking Flow, Cal.com Consult Booking Integration Plan, Chronic Care Blog Category Image (PNG), Chronic Care Blog Category Image (SVG), Consultation Pricing 20min R250 / 35min R500, Custom Multi-Step Questionnaire Wizard (+23 more)

### Community 6 - "Home Page Sections"
Cohesion: 0.09
Nodes (20): fallbackPosts, Home(), BlogCard(), BlogCardPost, BlogCardProps, AboutDoctor(), CTA(), highlights (+12 more)

### Community 7 - "Questionnaire Validation Schemas"
Cohesion: 0.13
Nodes (20): step10Schema, step1Schema, step2Schema, step3Schema, step4Schema, step5Schema, step6Schema, step7Schema (+12 more)

### Community 8 - "MDX Migration Scripts"
Cohesion: 0.19
Nodes (20): BLOG_DIR, bodyToPortableText(), categoryId(), client, collectInlineContent(), decodeEntities(), __dirname, DRY_RUN (+12 more)

### Community 9 - "Cal.com Booking API"
Cohesion: 0.17
Nodes (15): ConfirmedPage(), GET(), buildBookingHtml(), CalAttendee, CalBookingPayload, escapeHtml(), EVENT_LABELS, formatDateTime() (+7 more)

### Community 10 - "Consult Booking UI"
Cohesion: 0.15
Nodes (9): ConsultBookingPanel(), options, PackageId, included, metadata, steps, ContactFormState, ContactPage() (+1 more)

### Community 11 - "App Layout & Navigation"
Cohesion: 0.19
Nodes (9): metadata, exploreLinks, Footer(), topicLinks, cn(), Header(), navItems, Layout() (+1 more)

### Community 12 - "Admin Editor & Posts"
Cohesion: 0.18
Nodes (7): TiptapEditorProps, categories, NewPostPage(), sanitizePreview(), categories, EditPostPage(), renderPreview()

### Community 13 - "Services Section"
Cohesion: 0.2
Nodes (7): container, item, services, ServiceData, serviceDetails, ServicesModal(), metadata

### Community 14 - "Sanity Studio Config"
Cohesion: 0.31
Nodes (3): schemaTypes, category, post

### Community 15 - "About Page"
Cohesion: 0.32
Nodes (4): metadata, About(), values, DoctorIllustration()

### Community 16 - "PayFast Payment Gateway"
Cohesion: 0.43
Nodes (6): buildPayfastFormData(), CONSULTATION_PACKAGES, generatePayfastSignature(), PAYFAST_CONFIG, createPaymentGateRecord(), POST()

### Community 17 - "Sanity Studio Schemas"
Cohesion: 0.43
Nodes (3): category, schemaTypes, post

### Community 18 - "MDX-to-Sanity Migration"
Cohesion: 0.29
Nodes (7): Deterministic ID Upsert Pattern, Approach A - Migration Script + GitHub Action, MDX to Sanity Migration Design, MDX to Sanity Migration Implementation Plan, Markdown to Portable Text Converter, Sanity Project kygybgb7, Sanity Clean Content Studio README

### Community 19 - "Consult Booking Flow"
Cohesion: 0.4
Nodes (3): BookingContent(), CalEmbed, PaymentStatus

### Community 20 - "Dev Scripts"
Cohesion: 0.4
Nodes (3): nextBin, nextDev, { spawn, spawnSync }

### Community 22 - "System README"
Cohesion: 0.6
Nodes (5): README: Aliento Next.js, Cal.com Appointment Booking System, Consult Booking Payment Flow, PayFast Payment Gateway, Cal.com Webhook Integration

### Community 23 - "Dev Proxy"
Cohesion: 0.67
Nodes (3): config, isAuthenticated(), proxy()

## Ambiguous Edges - Review These
- `Default Blog Category Image (SVG)` → `Health Topic Categories (Nutrition, Mental Health, Screening, Medical Conditions, Research, Wellness)`  [AMBIGUOUS]
  public/images/blog/default.svg · relation: conceptually_related_to

## Knowledge Gaps
- **138 isolated node(s):** `eslintConfig`, `sanityEnvSchema`, `nextConfig`, `config`, `{ spawn, spawnSync }` (+133 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Default Blog Category Image (SVG)` and `Health Topic Categories (Nutrition, Mental Health, Screening, Medical Conditions, Research, Wellness)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `FullFormData` connect `API Routes & Database` to `Questionnaire Wizard`, `Questionnaire Validation Schemas`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `sendEmail()` connect `API Routes & Database` to `Cal.com Booking API`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `Welcome to Aliento's Health Blog` (e.g. with `The Power of Preventive Care: Why Waiting Costs You` and `Understanding Personalised Medicine: The Future of Healthcare`) actually correct?**
  _`Welcome to Aliento's Health Blog` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `Chronic Care blog category` (e.g. with `Chronic Condition Management` and `Hypertension High Blood Pressure`) actually correct?**
  _`Chronic Care blog category` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `Preventive Care Healthcare Approach` (e.g. with `How to Boost Your Immune System Naturally This Winter` and `Personalised / Precision Medicine`) actually correct?**
  _`Preventive Care Healthcare Approach` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `South African Healthcare Context` (e.g. with `Coughing, Coughing, Coughing - Pneumonia` and `Pneumonia`) actually correct?**
  _`South African Healthcare Context` has 3 INFERRED edges - model-reasoned connections that need verification._