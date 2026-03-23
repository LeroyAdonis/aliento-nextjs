import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/client'
import { client } from '@/sanity/client'
import { groq } from 'next-sanity'

// ── GET — fetch a single post by slug ─────────────────────────────────────────

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params
    const post = await client.fetch<{
      _id: string
      title: string
      slug: string
      excerpt?: string
      category?: string
      tags?: string[]
      author?: string
      publishedAt?: string
      htmlBody?: string
    } | null>(
      groq`*[_type == "post" && slug.current == $slug][0] {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        category,
        tags,
        author,
        publishedAt,
        htmlBody
      }`,
      { slug },
      { cache: 'no-store' }
    )

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({
      _id: post._id,
      slug: post.slug,
      title: post.title,
      date: post.publishedAt ?? '',
      excerpt: post.excerpt ?? '',
      category: post.category ?? 'Wellness',
      tags: post.tags ?? [],
      author: post.author ?? 'Aliento Health',
      content: post.htmlBody ?? '',
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error fetching post from Sanity:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// ── DELETE — remove a post by slug ────────────────────────────────────────────

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params
    const post = await client.fetch<{ _id: string } | null>(
      groq`*[_type == "post" && slug.current == $slug][0]{ _id }`,
      { slug },
      { cache: 'no-store' }
    )

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    await writeClient.delete(post._id)

    return NextResponse.json({ success: true, message: 'Post deleted from Sanity.' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error deleting post from Sanity:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

