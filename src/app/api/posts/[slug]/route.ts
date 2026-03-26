/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''
const REPO_OWNER = 'LeroyAdonis'
const REPO_NAME = 'aliento-nextjs'
const BLOG_PATH = 'content/blog'

const ghHeaders = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  'User-Agent': 'Aliento-CMS',
  Accept: 'application/vnd.github.v3+json'
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${BLOG_PATH}/${slug}.mdx`
    
    const res = await fetch(url, {
      headers: ghHeaders,
      cache: 'no-store'
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Post not found' }, { status: res.status })
    }

    const file = await res.json()
    const rawContent = Buffer.from(file.content, 'base64').toString('utf-8')

    // Parse frontmatter and content
    const frontmatterMatch = rawContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    
    if (!frontmatterMatch) {
      return NextResponse.json({ 
        slug,
        title: slug.replace(/-/g, ' '),
        content: rawContent,
        excerpt: '',
        category: 'Wellness',
        tags: [],
        author: 'Aliento Medical',
        sha: file.sha
      })
    }

    const [, frontmatter, content] = frontmatterMatch
    
    // Parse frontmatter fields
    const getField = (field: string) => {
      const match = frontmatter.match(new RegExp(`${field}:\\s*"?([^"\\n]+)"?`))
      return match ? match[1].trim() : ''
    }

    const getTags = () => {
      const match = frontmatter.match(/tags:\s*\[(.*?)\]/)
      if (!match) return []
      return match[1].split(',').map(t => t.trim().replace(/"/g, '')).filter(Boolean)
    }

    return NextResponse.json({
      slug,
      title: getField('title'),
      date: getField('date'),
      excerpt: getField('excerpt'),
      category: getField('category'),
      tags: getTags(),
      author: getField('author'),
      content: content.trim(),
      sha: file.sha
    })
  } catch (error: any) {
    console.error('Error fetching post:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${BLOG_PATH}/${slug}.mdx`

    // Get file SHA (required for delete)
    const getRes = await fetch(url, {
      headers: ghHeaders,
      cache: 'no-store'
    })

    if (!getRes.ok) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const file = await getRes.json()

    // Delete the file
    const deleteRes = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...ghHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `chore(blog): delete ${slug}`,
        sha: file.sha,
        branch: 'main'
      })
    })

    if (!deleteRes.ok) {
      const err = await deleteRes.json()
      return NextResponse.json({ error: err.message || 'Failed to delete' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Post deleted! Vercel will rebuild automatically.'
    })
  } catch (error: any) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
