import { Metadata } from 'next'
import BlogClient from './BlogClient'
import { getAllPostsUnified } from '@/lib/blog-unified'

export const metadata: Metadata = {
  title: 'Health Blog',
  description: 'Expert health insights, practical tips, and evidence-based articles on wellness, nutrition, mental health, screening, and more.',
}

export const revalidate = 60

export default async function BlogPage() {
  const posts = await getAllPostsUnified()
  const categories = [...new Set(posts.map((p) => p.category))].sort()
  return <BlogClient posts={posts} categories={categories} />
}
