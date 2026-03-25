# MDX → Sanity Migration Design

**Date:** 2026-03-25  
**Status:** Approved  

---

## Problem

Six MDX articles live in `public/content/blog/` but are not connected to Sanity. The app already reads from Sanity (`src/lib/sanity.ts`) with hardcoded fallbacks when Sanity is empty — meaning the articles are never displayed from their actual content. Additionally, future MDX files committed to `main` need to be automatically synced to Sanity so that nothing is ever missed.

---

## Goals

1. Migrate all 6 existing MDX articles into Sanity (categories + posts).
2. Auto-sync any future MDX file pushed to `public/content/blog/` on `main` into Sanity.
3. Keep migrations **idempotent** — safe to run multiple times, no duplicates.
4. Keep MDX files in the repo as a source-of-truth backup.

---

## Recommended Approach: Script + GitHub Action

Three options were considered:

| Approach | Description | Verdict |
|---|---|---|
| **A (Recommended)** | Migration script + GitHub Action for auto-sync | Best: automated end-to-end |
| B | Script only, manual re-runs for future articles | Too fragile — human error risk |
| C | Extend `/api/posts` to also write to Sanity | Doesn't handle manually-committed MDX |

**Approach A** is chosen because it fully solves both requirements: migrate now and auto-sync forever, with no manual steps required for future articles.

---

## Architecture

```
public/content/blog/*.mdx
          │
          ▼
scripts/migrate-to-sanity.js   ◄── run once + via GitHub Action
          │
          ├─► Sanity category docs (upsert by deterministic ID)
          └─► Sanity post docs    (upsert by deterministic ID)
                    │
                    ▼
         src/lib/sanity.ts queries
                    │
                    ▼
         src/app/blog/  &  src/app/health-topics/
```

### GitHub Action auto-sync flow

```
git push to main
  └─► path filter: public/content/blog/**/*.mdx
        └─► runs: node scripts/migrate-to-sanity.js
              └─► upserts all MDX → Sanity (idempotent)
```

---

## Migration Script: `scripts/migrate-to-sanity.js`

### Runtime

CommonJS Node.js script (no TypeScript compilation required). Run with:

```bash
# Dry run — preview only, no writes
SANITY_API_TOKEN=... node scripts/migrate-to-sanity.js --dry-run

# Live migration
SANITY_API_TOKEN=... node scripts/migrate-to-sanity.js
```

### Dependencies to install (devDependencies)

| Package | Purpose |
|---|---|
| `gray-matter` | Parse MDX YAML frontmatter |

`@sanity/client` is available through the existing `sanity` package (v5.17.1).

### Algorithm

1. **Discover** all `.mdx` files in `public/content/blog/`
2. **Parse** each file — split frontmatter (via `gray-matter`) from markdown body
3. **Convert** markdown body to Portable Text (custom converter, no extra deps)
4. **Upsert categories** — for each unique category in the files:
   - Deterministic `_id`: `blog-category-{slug}`
   - Fields: `title`, `slug.current`, `_type: "category"`
   - Use `createOrReplace` so re-runs are safe
5. **Upsert posts** — for each MDX file:
   - Deterministic `_id`: `blog-post-{slug}` (slug = filename without `.mdx`)
   - Fields: all frontmatter fields + `body` (Portable Text) + category reference
   - Use `createOrReplace` so re-runs are safe
6. **Report** — log each operation: `[CREATE]`, `[UPDATE]`, `[DRY-RUN]`

### Data Mapping

| MDX frontmatter | Sanity field | Notes |
|---|---|---|
| `title` | `title` | string |
| `date` | `publishedAt` | converted to ISO datetime |
| `excerpt` | `excerpt` | string |
| `category` | `category` | reference to category doc |
| `tags` | `tags` | array of strings |
| `author` | `author` | string |
| body content | `body` | Portable Text array |

### Markdown → Portable Text

A custom converter handles the subset of markdown present in the existing articles:

| Markdown | Portable Text block style |
|---|---|
| `## Heading` | `h2` |
| `### Heading` | `h3` |
| `#### Heading` | `h4` |
| `> quote` | `blockquote` |
| `- item` / `* item` | bullet list item |
| `1. item` | numbered list item |
| `**bold**` | `strong` mark |
| `*italic*` | `em` mark |
| `[text](url)` | `link` annotation |
| plain paragraph | `normal` block |

No additional packages are needed for the converter.

### Deterministic IDs (safety)

Using deterministic `_id` values ensures `createOrReplace` is a true upsert:

```js
category._id = `blog-category-${slugify(category.title)}`
post._id     = `blog-post-${filename-without-extension}`
```

This prevents duplicates even when the script is run repeatedly (including on every push via the GitHub Action).

---

## GitHub Action: `.github/workflows/sync-blog-to-sanity.yml`

### Triggers

- `push` to `main` — only when files matching `public/content/blog/**/*.mdx` change
- `workflow_dispatch` — manual trigger for admin use

### Steps

1. Checkout repo
2. Setup Node.js (version 20)
3. `npm ci --ignore-scripts`
4. `node scripts/migrate-to-sanity.js`

### Secrets required

| Secret | Value |
|---|---|
| `SANITY_API_TOKEN` | Sanity write token (add in GitHub repo settings → Secrets) |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `kygybgb7` (can be var, not secret) |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` (can be var, not secret) |

The `SANITY_API_TOKEN` must have **Editor** or **Write** permissions in the Sanity project.

---

## Safety Measures

| Risk | Mitigation |
|---|---|
| Running migration twice creates duplicates | Deterministic `_id` + `createOrReplace` prevents this |
| Categories created with wrong title | Script uses exact frontmatter `category` string |
| Token exposed in source code | Token read from env var only, never hardcoded |
| Sanity dataset accidentally wiped | `createOrReplace` on specific IDs only; no bulk delete |
| Future article causes a build error | GitHub Action runs after push; app still works with existing data |
| Action fails silently | GitHub Action status visible in repo Actions tab |

---

## What Does NOT Change

- `src/lib/sanity.ts` — all GROQ queries remain unchanged
- `src/app/blog/` and `src/app/health-topics/` pages — no changes
- `/api/posts` route — still writes MDX to GitHub; GH Action picks it up and syncs to Sanity
- MDX files in `public/content/blog/` — kept as backup/source of truth
- Sanity schemas (`sanity/schemas/`) — no changes needed

---

## Existing Articles to Migrate

| File | Title | Category |
|---|---|---|
| `5-tips-for-managing-chronic-conditions.mdx` | 5 Tips for Managing Chronic Conditions | Chronic Care |
| `mental-health-matters-breaking-the-stigma.mdx` | Mental Health Matters: Breaking the Stigma | Mental Health |
| `the-power-of-preventive-care.mdx` | The Power of Preventive Care: Why Waiting Costs You | Wellness |
| `understanding-personalised-medicine.mdx` | Understanding Personalised Medicine: The Future of Healthcare | Medical Insights |
| `welcome-to-aliento-health-blog.mdx` | Welcome to Aliento's Health Blog | Wellness |
| `when-to-see-a-doctor.mdx` | When to See a Doctor: A Complete Guide | Tips & Guides |

**4 unique categories** will be created: Chronic Care, Mental Health, Wellness, Medical Insights, Tips & Guides (5 actually).

---

## Success Criteria

- [ ] All 6 articles appear in Sanity Studio under Blog Posts
- [ ] All categories created correctly with slugs
- [ ] `npm run build` passes with articles from Sanity (no fallback needed)
- [ ] GitHub Action runs successfully on push to main with an MDX change
- [ ] Re-running the migration script produces no duplicates
