# MDX → Sanity Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate 6 existing MDX articles from `public/content/blog/` into Sanity CMS, and add a GitHub Action that auto-syncs any future MDX commits on `main` into Sanity.

**Architecture:** A Node.js ESM migration script (`scripts/migrate-to-sanity.mjs`) reads MDX frontmatter + body, converts markdown to Portable Text, and upserts categories + posts into Sanity using deterministic `_id` values. A GitHub Action (`.github/workflows/sync-blog-to-sanity.yml`) runs the script on every push to `main` that touches `public/content/blog/**/*.mdx`.

**Tech Stack:** Node.js ESM script, `@sanity/client` (transitive dep from `sanity` package), `gray-matter` (new devDep), GitHub Actions YAML.

---

## Context

- MDX files live in `public/content/blog/*.mdx` (6 files)
- App reads from Sanity via GROQ in `src/lib/sanity.ts` — with hardcoded fallbacks for empty state
- Sanity project: `kygybgb7`, dataset: `production`
- `SANITY_API_TOKEN` env var is already used by the project (write token)
- Sanity schemas: `post` and `category` in `sanity/schemas/`
- No test framework is installed — use dry-run output as verification

---

## Task 1: Install gray-matter

**Files:**
- Modify: `package.json` (devDependencies)

**Step 1: Install the package**

```bash
cd C:\scratchpad\aliento-nextjs
npm install --save-dev gray-matter
```

**Step 2: Verify it appears in package.json**

Check that `gray-matter` is now in `devDependencies` in `package.json`.

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add gray-matter for MDX frontmatter parsing

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 2: Write the migration script

**Files:**
- Create: `scripts/migrate-to-sanity.mjs`

This script reads every `.mdx` file from `public/content/blog/`, parses frontmatter + markdown body, converts body to Portable Text, and upserts categories and posts into Sanity. It is idempotent — safe to run any number of times.

**Step 1: Create `scripts/migrate-to-sanity.mjs` with the full content below**

```mjs
#!/usr/bin/env node
/**
 * Migrates MDX blog articles from public/content/blog/ into Sanity CMS.
 *
 * Usage:
 *   SANITY_API_TOKEN=<token> node scripts/migrate-to-sanity.mjs
 *   SANITY_API_TOKEN=<token> node scripts/migrate-to-sanity.mjs --dry-run
 *
 * Idempotent: uses deterministic _id values so re-runs do not create duplicates.
 */

import { createClient } from '@sanity/client'
import matter from 'gray-matter'
import { readFileSync, readdirSync } from 'fs'
import { join, basename, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN = process.argv.includes('--dry-run')
const BLOG_DIR = join(__dirname, '..', 'public', 'content', 'blog')

// ── Sanity client (write) ────────────────────────────────────────────────────

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kygybgb7'
const DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET    || 'production'
const TOKEN      = process.env.SANITY_API_TOKEN

if (!TOKEN && !DRY_RUN) {
  console.error('ERROR: SANITY_API_TOKEN env var is required for live migration.')
  console.error('Run with --dry-run to preview without writing.')
  process.exit(1)
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset:   DATASET,
  apiVersion: '2026-03-23',
  token:     TOKEN,
  useCdn:    false,
})

// ── Slug helpers ─────────────────────────────────────────────────────────────

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ── Portable Text converter ──────────────────────────────────────────────────

let _keyCounter = 0
function nextKey(prefix = 'k') {
  return `${prefix}${++_keyCounter}`
}

/**
 * Parses inline markdown marks (bold, italic, links) in a text string.
 * Returns { spans, markDefs } suitable for a Portable Text block.
 */
function parseInline(text, blockKey) {
  const spans    = []
  const markDefs = []
  let linkIdx    = 0

  // Regex: **bold**, *italic*, [text](url)
  // Order: bold before italic so ** isn't eaten by *
  const pattern = /(\*\*(.+?)\*\*|\*([^*]+?)\*|\[([^\]]+)\]\(([^)]+)\))/g
  let lastIndex = 0
  let match

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      spans.push({
        _type: 'span',
        _key:  nextKey(`${blockKey}-s`),
        text:  text.slice(lastIndex, match.index),
        marks: [],
      })
    }

    if (match[2] !== undefined) {
      // **bold**
      spans.push({ _type: 'span', _key: nextKey(`${blockKey}-s`), text: match[2], marks: ['strong'] })
    } else if (match[3] !== undefined) {
      // *italic*
      spans.push({ _type: 'span', _key: nextKey(`${blockKey}-s`), text: match[3], marks: ['em'] })
    } else if (match[4] !== undefined) {
      // [text](url)
      const linkKey = nextKey(`link-${blockKey}-`)
      markDefs.push({ _type: 'link', _key: linkKey, href: match[5] })
      spans.push({ _type: 'span', _key: nextKey(`${blockKey}-s`), text: match[4], marks: [linkKey] })
    }

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    spans.push({
      _type: 'span',
      _key:  nextKey(`${blockKey}-s`),
      text:  text.slice(lastIndex),
      marks: [],
    })
  }

  if (spans.length === 0) {
    spans.push({ _type: 'span', _key: nextKey(`${blockKey}-s`), text, marks: [] })
  }

  return { spans, markDefs }
}

function makeBlock(style, text, listItem, level) {
  const bKey = nextKey('b')
  const { spans, markDefs } = parseInline(text, bKey)
  const block = {
    _type:    'block',
    _key:     bKey,
    style,
    children: spans,
    markDefs,
  }
  if (listItem) {
    block.listItem = listItem
    block.level    = level || 1
  }
  return block
}

/**
 * Converts a markdown string to an array of Portable Text blocks.
 * Supports: paragraphs, h2/h3/h4, blockquotes, bullet lists, numbered lists,
 *           inline bold, italic, and links.
 */
function markdownToPortableText(markdown) {
  const blocks = []
  const lines  = markdown.split('\n')

  for (const raw of lines) {
    const line = raw.trimEnd()

    if (!line.trim()) continue  // skip blank lines

    if (line.startsWith('#### ')) {
      blocks.push(makeBlock('h4', line.slice(5).trim()))
    } else if (line.startsWith('### ')) {
      blocks.push(makeBlock('h3', line.slice(4).trim()))
    } else if (line.startsWith('## ')) {
      blocks.push(makeBlock('h2', line.slice(3).trim()))
    } else if (line.startsWith('# ')) {
      blocks.push(makeBlock('h2', line.slice(2).trim()))  // treat h1 as h2
    } else if (line.startsWith('> ')) {
      blocks.push(makeBlock('blockquote', line.slice(2).trim()))
    } else if (/^[-*] /.test(line)) {
      const indent = line.match(/^(\s*)/)[1].length
      blocks.push(makeBlock('normal', line.replace(/^[-*] /, '').trimStart(), 'bullet', Math.floor(indent / 2) + 1))
    } else if (/^\d+\. /.test(line)) {
      blocks.push(makeBlock('normal', line.replace(/^\d+\. /, ''), 'number', 1))
    } else if (line.startsWith('---') || line.startsWith('===')) {
      // HR / separator — skip
    } else {
      blocks.push(makeBlock('normal', line.trim()))
    }
  }

  return blocks
}

// ── MDX loader ───────────────────────────────────────────────────────────────

function loadMdxFiles() {
  const files = readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'))
  return files.map(filename => {
    const slug    = basename(filename, '.mdx')
    const raw     = readFileSync(join(BLOG_DIR, filename), 'utf8')
    const { data: frontmatter, content: body } = matter(raw)
    return { slug, frontmatter, body }
  })
}

// ── Sanity upsert helpers ────────────────────────────────────────────────────

function categoryId(title) {
  return `blog-category-${slugify(title)}`
}

function postId(slug) {
  return `blog-post-${slug}`
}

async function upsertCategory(title) {
  const id  = categoryId(title)
  const doc = {
    _id:   id,
    _type: 'category',
    title,
    slug:  { _type: 'slug', current: slugify(title) },
  }

  if (DRY_RUN) {
    console.log(`  [DRY-RUN] Would upsert category: ${title} (${id})`)
    return id
  }

  await client.createOrReplace(doc)
  console.log(`  [OK] Category upserted: ${title}`)
  return id
}

async function upsertPost(slug, frontmatter, body) {
  const id         = postId(slug)
  const categoryRef = categoryId(frontmatter.category || 'Wellness')
  const ptBody     = markdownToPortableText(body)

  const doc = {
    _id:         id,
    _type:       'post',
    title:       frontmatter.title        || slug,
    slug:        { _type: 'slug', current: slug },
    excerpt:     frontmatter.excerpt      || '',
    author:      frontmatter.author       || 'Aliento Medical',
    publishedAt: frontmatter.date
      ? new Date(frontmatter.date).toISOString()
      : new Date().toISOString(),
    tags:     Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    category: { _type: 'reference', _ref: categoryRef },
    body:     ptBody,
  }

  if (DRY_RUN) {
    console.log(`  [DRY-RUN] Would upsert post: "${frontmatter.title}" (${id}) — ${ptBody.length} blocks`)
    return
  }

  await client.createOrReplace(doc)
  console.log(`  [OK] Post upserted: "${frontmatter.title}"`)
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🚀 MDX → Sanity Migration${DRY_RUN ? ' (DRY RUN)' : ''}`)
  console.log(`   Project: ${PROJECT_ID}  Dataset: ${DATASET}\n`)

  const articles = loadMdxFiles()
  console.log(`📄 Found ${articles.length} MDX files\n`)

  // Phase 1: collect unique categories and upsert them
  const categories = [...new Set(articles.map(a => a.frontmatter.category).filter(Boolean))]
  console.log(`📂 Upserting ${categories.length} categories…`)
  for (const cat of categories) {
    await upsertCategory(cat)
  }

  // Phase 2: upsert posts (categories must exist first for references)
  console.log(`\n📝 Upserting ${articles.length} posts…`)
  for (const { slug, frontmatter, body } of articles) {
    await upsertPost(slug, frontmatter, body)
  }

  console.log(`\n✅ Migration complete!`)
  if (DRY_RUN) {
    console.log('   (No data was written — remove --dry-run to apply)')
  } else {
    console.log(`   Open Sanity Studio to verify: https://kygybgb7.sanity.studio/`)
  }
}

main().catch(err => {
  console.error('\n❌ Migration failed:', err.message)
  process.exit(1)
})
```

**Step 2: Run dry-run to verify the script parses correctly (no writes)**

```bash
cd C:\scratchpad\aliento-nextjs
node scripts/migrate-to-sanity.mjs --dry-run
```

Expected output (no errors, shows all 6 posts and 5 categories):

```
🚀 MDX → Sanity Migration (DRY RUN)
   Project: kygybgb7  Dataset: production

📄 Found 6 MDX files

📂 Upserting 5 categories…
  [DRY-RUN] Would upsert category: Chronic Care (blog-category-chronic-care)
  [DRY-RUN] Would upsert category: Mental Health (blog-category-mental-health)
  [DRY-RUN] Would upsert category: Wellness (blog-category-wellness)
  [DRY-RUN] Would upsert category: Medical Insights (blog-category-medical-insights)
  [DRY-RUN] Would upsert category: Tips & Guides (blog-category-tips-guides)

📝 Upserting 6 posts…
  [DRY-RUN] Would upsert post: "5 Tips for Managing Chronic Conditions" ...
  [DRY-RUN] Would upsert post: "Mental Health Matters: Breaking the Stigma in South Africa" ...
  ... (all 6 posts listed)

✅ Migration complete!
   (No data was written — remove --dry-run to apply)
```

If there are errors, fix them before proceeding. Common issues:
- `Cannot find module 'gray-matter'` → run `npm install --save-dev gray-matter` first
- `Cannot find module '@sanity/client'` → run `npm install --save-dev @sanity/client`

**Step 3: Commit the script**

```bash
git add scripts/migrate-to-sanity.mjs
git commit -m "feat: add MDX to Sanity migration script

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 3: Run the live migration

**Files:** No code changes — this task runs the script against Sanity.

**Step 1: Run the live migration**

The `SANITY_API_TOKEN` must be set. Retrieve it from the Sanity project settings
(https://www.sanity.io/manage → project `kygybgb7` → API → Tokens → create an "Editor" token if none exists).

```bash
cd C:\scratchpad\aliento-nextjs
$env:SANITY_API_TOKEN="<your-token-here>"
node scripts/migrate-to-sanity.mjs
```

Expected output: all 5 categories and 6 posts show `[OK]` status.

**Step 2: Verify in Sanity Studio**

Open the Sanity Studio (either locally with `cd studio-aliento && npx sanity dev`, or via the hosted URL).

Confirm:
- 5 category documents exist with correct titles and slugs
- 6 post documents exist with correct titles, dates, excerpts, tags, and body content
- Each post has the correct category reference

**Step 3: Verify app reads the posts (no fallback)**

```bash
cd C:\scratchpad\aliento-nextjs
npm run build
```

The build should succeed. After deploying, the `/health-topics` page should show all 6 articles from Sanity (not the hardcoded fallback posts in `src/lib/health-topics-fallbacks.ts`).

---

## Task 4: Add GitHub Action for future sync

**Files:**
- Create: `.github/workflows/sync-blog-to-sanity.yml`

This action runs `migrate-to-sanity.mjs` automatically whenever MDX files change on `main`. It uses the same idempotent upsert logic, so only changed/new posts are effectively updated.

**Step 1: Ensure `.github/workflows/` directory exists**

```bash
New-Item -ItemType Directory -Force .github/workflows
```

**Step 2: Create `.github/workflows/sync-blog-to-sanity.yml`**

```yaml
name: Sync Blog MDX to Sanity

on:
  push:
    branches: [main]
    paths:
      - 'public/content/blog/**/*.mdx'
  workflow_dispatch:
    inputs:
      dry_run:
        description: 'Dry run (no writes)'
        required: false
        default: 'false'
        type: choice
        options: ['false', 'true']

jobs:
  sync:
    name: Migrate MDX → Sanity
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci --ignore-scripts

      - name: Run migration (dry run)
        if: ${{ github.event.inputs.dry_run == 'true' }}
        run: node scripts/migrate-to-sanity.mjs --dry-run
        env:
          NEXT_PUBLIC_SANITY_PROJECT_ID: ${{ vars.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kygybgb7' }}
          NEXT_PUBLIC_SANITY_DATASET: ${{ vars.NEXT_PUBLIC_SANITY_DATASET || 'production' }}
          SANITY_API_TOKEN: ${{ secrets.SANITY_API_TOKEN }}

      - name: Run migration (live)
        if: ${{ github.event.inputs.dry_run != 'true' }}
        run: node scripts/migrate-to-sanity.mjs
        env:
          NEXT_PUBLIC_SANITY_PROJECT_ID: ${{ vars.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kygybgb7' }}
          NEXT_PUBLIC_SANITY_DATASET: ${{ vars.NEXT_PUBLIC_SANITY_DATASET || 'production' }}
          SANITY_API_TOKEN: ${{ secrets.SANITY_API_TOKEN }}
```

**Step 3: Add the `SANITY_API_TOKEN` secret to GitHub**

In the GitHub repository settings:
1. Go to **Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Name: `SANITY_API_TOKEN`
4. Value: the same write token used in Task 3

This step must be done manually by a human with repository admin access.

**Step 4: Commit the workflow**

```bash
git add .github/workflows/sync-blog-to-sanity.yml
git commit -m "ci: add GitHub Action to sync MDX blog posts to Sanity

Triggers on push to main when public/content/blog/**/*.mdx changes.
Also supports manual workflow_dispatch with optional dry-run mode.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 5: End-to-end verification

**Step 1: Test idempotency — run migration again**

```bash
node scripts/migrate-to-sanity.mjs
```

All posts should show `[OK]` with no duplicates created in Sanity Studio.

**Step 2: Test future-article flow**

Create a test MDX file in `public/content/blog/`:

```bash
# Create a test article
@"
---
title: "Test Article"
date: "2026-03-25"
excerpt: "A test article to verify the sync pipeline."
category: "Wellness"
tags: ["test"]
author: "Aliento Medical"
---

## Test heading

This is a test paragraph to verify the migration pipeline works end-to-end.
"@ | Out-File -FilePath "public/content/blog/test-sync-article.mdx" -Encoding utf8
```

Run the migration again:

```bash
node scripts/migrate-to-sanity.mjs
```

Verify the test article appears in Sanity Studio. Then clean up:

```bash
Remove-Item "public/content/blog/test-sync-article.mdx"
```

And in Sanity Studio, delete the test post (or leave it; re-running migration won't duplicate it).

**Step 3: Lint check**

```bash
npm run lint
```

Expected: no errors from the new files (the `.mjs` script is excluded from ESLint by default).

**Step 4: Build check**

```bash
npm run build
```

Expected: build succeeds.

**Step 5: Final commit (if any cleanup needed)**

```bash
git add -A
git commit -m "chore: verify MDX to Sanity migration pipeline

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Summary of Files Created/Modified

| File | Action | Purpose |
|---|---|---|
| `package.json` | Modified | Add `gray-matter` devDep |
| `package-lock.json` | Modified | Lock file update |
| `scripts/migrate-to-sanity.mjs` | Created | MDX → Sanity migration script |
| `.github/workflows/sync-blog-to-sanity.yml` | Created | GitHub Action for auto-sync |

## Sanity Setup Required (manual steps)

| Step | Where |
|---|---|
| Get/create write API token | https://www.sanity.io/manage → project kygybgb7 → API → Tokens |
| Add `SANITY_API_TOKEN` GitHub secret | GitHub repo → Settings → Secrets → Actions |

---

## Notes & Caveats

- **Images**: MDX articles have no `coverImage` — posts will be created without one. Images can be added manually in Sanity Studio later.
- **Body content**: The Portable Text converter handles the markdown subset used in all 6 existing articles. If future articles use features like code blocks or tables, the converter can be extended.
- **`relatedPosts`**: Not set during migration — can be linked manually in Studio.
- **MDX files are kept**: `public/content/blog/` acts as a version-controlled backup. The app reads from Sanity; the MDX files are the source for the migration pipeline.
- **Token security**: `SANITY_API_TOKEN` must never be committed. The script exits with an error if it's missing and `--dry-run` is not set.
