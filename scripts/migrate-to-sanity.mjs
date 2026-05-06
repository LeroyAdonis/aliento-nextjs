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
import { parse as parseHtml } from 'node-html-parser'
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

/** Decodes common HTML entities found in the blog content. */
function decodeEntities(text) {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
}

/**
 * Recursively collects inline content (text, bold, italic, links) from a list
 * of parsed HTML nodes.  Returns { spans, markDefs } for a Portable Text block.
 *
 * @param {import('node-html-parser').Node[]} nodes
 * @param {{ _type: string; _key: string; text: string; marks: string[] }[]} spans  accumulated spans
 * @param {{ _type: string; _key: string; href: string }[]} markDefs  accumulated link defs
 * @param {string[]} inheritedMarks  marks propagated from ancestor elements
 */
function walkInline(nodes, spans, markDefs, inheritedMarks) {
  for (const node of nodes) {
    // Text node (nodeType 3)
    if (node.nodeType === 3) {
      const text = decodeEntities(node.rawText)
      if (text) {
        spans.push({ _type: 'span', _key: nextKey('s'), text, marks: [...inheritedMarks] })
      }
      continue
    }

    const tag = node.rawTagName?.toLowerCase()

    switch (tag) {
      case 'strong':
      case 'b':
        walkInline(node.childNodes, spans, markDefs, [...inheritedMarks, 'strong'])
        break
      case 'em':
      case 'i':
        walkInline(node.childNodes, spans, markDefs, [...inheritedMarks, 'em'])
        break
      case 'a': {
        const href = node.getAttribute('href') || ''
        const linkKey = nextKey('link')
        markDefs.push({ _type: 'link', _key: linkKey, href })
        walkInline(node.childNodes, spans, markDefs, [...inheritedMarks, linkKey])
        break
      }
      case 'br':
        break  // skip line-breaks
      default:
        // Any other inline or container element — recurse into its children
        if (node.childNodes?.length > 0) {
          walkInline(node.childNodes, spans, markDefs, inheritedMarks)
        }
    }
  }
}

/**
 * Collects inline content from a node list, dropping whitespace-only spans.
 * Returns { spans, markDefs } or { spans: [], markDefs: [] } if no content.
 */
function collectInlineContent(nodes) {
  const spans    = []
  const markDefs = []
  walkInline(nodes, spans, markDefs, [])
  const meaningful = spans.filter(s => s.text.trim().length > 0)
  return { spans: meaningful, markDefs }
}

/**
 * Walks block-level HTML nodes and appends Portable Text blocks to `blocks`.
 *
 * @param {import('node-html-parser').Node[]} nodes
 * @param {object[]} blocks  output array
 */
function walkBlocks(nodes, blocks) {
  for (const node of nodes) {
    if (node.nodeType === 3) continue  // bare text nodes at block level — skip

    const tag = node.rawTagName?.toLowerCase()

    switch (tag) {
      case 'p': {
        const { spans, markDefs } = collectInlineContent(node.childNodes)
        if (spans.length > 0) {
          blocks.push({ _type: 'block', _key: nextKey('b'), style: 'normal', children: spans, markDefs })
        }
        break
      }

      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4': {
        const { spans, markDefs } = collectInlineContent(node.childNodes)
        if (spans.length > 0) {
          // Map h1 → h2 since Sanity Portable Text typically has no h1 style
          blocks.push({ _type: 'block', _key: nextKey('b'), style: tag === 'h1' ? 'h2' : tag, children: spans, markDefs })
        }
        break
      }

      case 'blockquote': {
        const { spans, markDefs } = collectInlineContent(node.childNodes)
        if (spans.length > 0) {
          blocks.push({ _type: 'block', _key: nextKey('b'), style: 'blockquote', children: spans, markDefs })
        }
        break
      }

      case 'ul': {
        // Each <li> becomes one bullet block; <li> may wrap inline content in a <p>
        for (const li of node.querySelectorAll('li')) {
          const { spans, markDefs } = collectInlineContent(li.childNodes)
          if (spans.length > 0) {
            blocks.push({
              _type: 'block', _key: nextKey('b'), style: 'normal',
              listItem: 'bullet', level: 1,
              children: spans, markDefs,
            })
          }
        }
        break
      }

      case 'ol': {
        for (const li of node.querySelectorAll('li')) {
          const { spans, markDefs } = collectInlineContent(li.childNodes)
          if (spans.length > 0) {
            blocks.push({
              _type: 'block', _key: nextKey('b'), style: 'normal',
              listItem: 'number', level: 1,
              children: spans, markDefs,
            })
          }
        }
        break
      }

      case 'img': {
        const src = node.getAttribute('src') || ''
        const alt = node.getAttribute('alt') || ''
        if (src) {
          // Custom image block — the Sanity schema stores external URLs as `url`
          blocks.push({ _type: 'image', _key: nextKey('img'), url: src, alt })
        }
        break
      }

      case 'hr':
      case 'br':
        break  // skip

      default:
        // Recurse into any unrecognised container element
        if (node.childNodes?.length > 0) {
          walkBlocks(node.childNodes, blocks)
        }
    }
  }
}

/**
 * Converts an HTML string (the body of an MDX file) into an array of Sanity
 * Portable Text blocks.  HTML tags are never stored as literal text.
 *
 * To re-run the live migration after adding SANITY_API_TOKEN to .env.local:
 *   npx dotenv -e .env.local -- node scripts/migrate-to-sanity.mjs
 */
function htmlToPortableText(html) {
  _keyCounter = 0
  const root   = parseHtml(html)
  const blocks = []
  walkBlocks(root.childNodes, blocks)
  return blocks
}

// ── Markdown fallback converter ───────────────────────────────────────────────
// Used for MDX files whose body is plain Markdown (not HTML).

function makeMarkdownBlock(style, text, listItem, level) {
  const bKey     = nextKey('b')
  const spanKey  = nextKey(`${bKey}-s`)
  const block = {
    _type:    'block',
    _key:     bKey,
    style,
    children: [{ _type: 'span', _key: spanKey, text: text.trim(), marks: [] }],
    markDefs: [],
  }
  if (listItem) {
    block.listItem = listItem
    block.level    = level || 1
  }
  return block
}

function markdownToPortableText(markdown) {
  _keyCounter = 0
  const blocks = []
  for (const raw of markdown.split('\n')) {
    const line = raw.trimEnd()
    if (!line.trim()) continue
    if (line.startsWith('#### '))      blocks.push(makeMarkdownBlock('h4',        line.slice(5).trim()))
    else if (line.startsWith('### ')) blocks.push(makeMarkdownBlock('h3',        line.slice(4).trim()))
    else if (line.startsWith('## '))  blocks.push(makeMarkdownBlock('h2',        line.slice(3).trim()))
    else if (line.startsWith('# '))   blocks.push(makeMarkdownBlock('h2',        line.slice(2).trim()))
    else if (line.startsWith('> '))   blocks.push(makeMarkdownBlock('blockquote',line.slice(2).trim()))
    else if (/^[-*] /.test(line)) {
      const indent = line.match(/^(\s*)/)[1].length
      blocks.push(makeMarkdownBlock('normal', line.replace(/^[-*] /, '').trimStart(), 'bullet', Math.floor(indent / 2) + 1))
    } else if (/^\d+\. /.test(line)) {
      blocks.push(makeMarkdownBlock('normal', line.replace(/^\d+\. /, ''), 'number', 1))
    } else if (!line.startsWith('---') && !line.startsWith('===')) {
      blocks.push(makeMarkdownBlock('normal', line.trim()))
    }
  }
  return blocks
}

/**
 * Detects whether the body content is HTML or Markdown and converts accordingly.
 * HTML files start with a tag character `<`; all others are treated as Markdown.
 */
function bodyToPortableText(body) {
  return body.trimStart().startsWith('<')
    ? htmlToPortableText(body)
    : markdownToPortableText(body)
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
  const ptBody     = bodyToPortableText(body)

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
