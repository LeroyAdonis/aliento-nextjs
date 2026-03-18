import { getAllPosts, getAllCategories } from '@/lib/blog'
import BlogClient from './BlogClient'

export default function BlogPage() {
  const posts = getAllPosts()
  const categories = getAllCategories()

  return <BlogClient posts={posts} categories={categories} />
}
