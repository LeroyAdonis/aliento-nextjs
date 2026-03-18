import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

const execAsync = promisify(exec)

const BLOG_DIR = path.join(process.cwd(), 'content/blog')
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''
const REPO_URL = 'https://github.com/LeroyAdonis/aliento-nextjs'

export async function POST(request: NextRequest) {
  try {
    const { title, excerpt, content, category, tags, author, slug } = await request.json()

    if (!title || !content || !slug) {
      return NextResponse.json({ error: 'Title, content, and slug are required' }, { status: 400 })
    }

    // Create MDX frontmatter
    const frontmatter = `---
title: "${title}"
date: "${new Date().toISOString().split('T')[0]}"
excerpt: "${excerpt || title}"
category: "${category || 'Wellness'}"
tags: [${(tags || []).map((t: string) => `"${t}"`).join(', ')}]
author: "${author || 'Aliento Medical'}"
---

${content}
`

    // Write the MDX file
    const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
    fs.writeFileSync(filePath, frontmatter)

    // Git commit and push
    const remoteUrl = `https://${GITHUB_TOKEN}@github.com/LeroyAdonis/aliento-nextjs.git`
    
    await execAsync(`cd ${process.cwd()} && git config user.email "admin@alientomedical.com"`)
    await execAsync(`cd ${process.cwd()} && git config user.name "Aliento Admin"`)
    await execAsync(`cd ${process.cwd()} && git add content/blog/${slug}.mdx`)
    await execAsync(`cd ${process.cwd()} && git commit -m "feat(blog): add ${slug}"`)
    await execAsync(`cd ${process.cwd()} && git remote set-url origin ${remoteUrl}`)
    await execAsync(`cd ${process.cwd()} && git push origin main`)

    // Trigger Vercel rebuild via webhook (optional)
    // This happens automatically on push if GitHub integration is connected

    return NextResponse.json({ 
      success: true, 
      slug,
      message: 'Post saved and pushed to GitHub'
    })
  } catch (error: any) {
    console.error('Error saving post:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Get all posts
export async function GET() {
  try {
    const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'))
    const posts = files.map(filename => {
      const slug = filename.replace('.mdx', '')
      const content = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8')
      const match = content.match(/---\n([\s\S]*?)\n---/)
      const frontmatter = match ? match[1] : ''
      
      const titleMatch = frontmatter.match(/title:\s*"?([^"\n]+)"?/)
      const dateMatch = frontmatter.match(/date:\s*"?([^"\n]+)"?/)
      const categoryMatch = frontmatter.match(/category:\s*"?([^"\n]+)"?/)
      
      return {
        slug,
        title: titleMatch ? titleMatch[1] : slug,
        date: dateMatch ? dateMatch[1] : '',
        category: categoryMatch ? categoryMatch[1] : 'General'
      }
    })
    
    return NextResponse.json({ posts })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
