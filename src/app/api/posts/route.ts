import { NextRequest, NextResponse } from 'next/server'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''
const REPO_OWNER = 'LeroyAdonis'
const REPO_NAME = 'aliento-nextjs'
const BLOG_PATH = 'content/blog'

async function commitToGitHub(slug: string, content: string) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${BLOG_PATH}/${slug}.mdx`
  
  // Check if file exists (to get SHA for update)
  let sha: string | undefined
  try {
    const existing = await fetch(url, {
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, 'User-Agent': 'Aliento-CMS' }
    })
    if (existing.ok) {
      const data = await existing.json()
      sha = data.sha
    }
  } catch {}

  // Create or update file
  const body: any = {
    message: `feat(blog): ${sha ? 'update' : 'add'} ${slug}`,
    content: Buffer.from(content).toString('base64'),
    branch: 'main'
  }
  if (sha) body.sha = sha

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'User-Agent': 'Aliento-CMS',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || 'GitHub API error')
  }

  return res.json()
}

export async function POST(request: NextRequest) {
  try {
    const { title, excerpt, content, category, tags, author, slug } = await request.json()

    if (!title || !content || !slug) {
      return NextResponse.json({ error: 'Title, content, and slug are required' }, { status: 400 })
    }

    const mdxContent = `---
title: "${title}"
date: "${new Date().toISOString().split('T')[0]}"
excerpt: "${excerpt || title}"
category: "${category || 'Wellness'}"
tags: [${(tags || []).map((t: string) => `"${t}"`).join(', ')}]
author: "${author || 'Aliento Medical'}"
---

${content}
`

    await commitToGitHub(slug, mdxContent)

    return NextResponse.json({ 
      success: true, 
      slug,
      message: 'Post saved to GitHub! Vercel will rebuild automatically.'
    })
  } catch (error: any) {
    console.error('Error saving post:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Get posts list (read-only, no filesystem needed on Vercel)
export async function GET() {
  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${BLOG_PATH}`
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, 'User-Agent': 'Aliento-CMS' }
    })
    
    if (!res.ok) throw new Error('Failed to fetch from GitHub')
    
    const files = await res.json()
    const posts = files
      .filter((f: any) => f.name.endsWith('.mdx'))
      .map((f: any) => ({
        slug: f.name.replace('.mdx', ''),
        name: f.name
      }))
    
    return NextResponse.json({ posts })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
