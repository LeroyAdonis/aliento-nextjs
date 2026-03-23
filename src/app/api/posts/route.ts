import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/client'
import { client } from '@/sanity/client'
import { groq } from 'next-sanity'

// ── helpers ────────────────────────────────────────────────────────────────────

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function findPostBySlug(slug: string): Promise<{ _id: string } | null> {
  return client.fetch<{ _id: string } | null>(
    groq`*[_type == "post" && slug.current == $slug][0]{ _id }`,
    { slug },
    { cache: 'no-store' }
  )
}

// ── GET — list all posts ───────────────────────────────────────────────────────

export async function GET() {
  try {
    const posts = await client.fetch<Array<{
      _id: string
      title: string
      slug: string
      excerpt?: string
      category?: string
      author?: string
      publishedAt?: string
    }>>(
      groq`*[_type == "post"] | order(publishedAt desc) {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        category,
        author,
        publishedAt
      }`,
      {},
      { cache: 'no-store' }
    )
    // Shape to match what the admin list page expects
    const shaped = (posts ?? []).map((p) => ({
      _id: p._id,
      slug: p.slug,
      name: `${p.slug}.mdx`,
      title: p.title,
      date: p.publishedAt ?? '',
      excerpt: p.excerpt ?? '',
      category: p.category ?? '',
      author: p.author ?? '',
    }))
    return NextResponse.json({ posts: shaped })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// ── POST — create or update a post ────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const { title, excerpt, content, category, tags, author, slug: providedSlug } =
      await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    const slug = providedSlug || slugify(title)
    const existing = await findPostBySlug(slug)

    const doc = {
      title,
      slug: { _type: 'slug', current: slug },
      excerpt: excerpt || title,
      htmlBody: content,
      category: category || 'Wellness',
      tags: tags || [],
      author: author || 'Aliento Health',
      publishedAt: new Date().toISOString(),
    }

    if (existing) {
      // Update — preserve publishedAt if already set
      const updated = await writeClient.patch(existing._id).set(doc).commit()
      return NextResponse.json({ success: true, slug, _id: updated._id })
    } else {
      // Create
      const created = await writeClient.create({ _type: 'post', ...doc })
      return NextResponse.json({ success: true, slug, _id: created._id })
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error saving post to Sanity:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

