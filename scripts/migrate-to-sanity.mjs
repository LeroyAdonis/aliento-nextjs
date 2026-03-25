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

  // Regex: **bold**, *italic*, [text](url)
  // Order: bold before italic so ** is not eaten by *
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
      blocks.push(makeBlock('h2', line.slice(2).trim()))
    } else if (line.startsWith('> ')) {
      blocks.push(makeBlock('blockquote', line.slice(2).trim()))
    } else if (/^[-*] /.test(line)) {
      const indent = line.match(/^(\s*)/)[1].length
      blocks.push(makeBlock('normal', line.replace(/^[-*] /, '').trimStart(), 'bullet', Math.floor(indent / 2) + 1))
    } else if (/^\d+\. /.test(line)) {
      blocks.push(makeBlock('normal', line.replace(/^\d+\. /, ''), 'number', 1))
    } else if (line.startsWith('---') || line.startsWith('===')) {
      // skip horizontal rules
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
