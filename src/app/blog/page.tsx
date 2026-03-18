import BlogClient from './BlogClient'

export default function BlogPage() {
  // Pass empty arrays - BlogClient will fetch from /blog-data.json
  return <BlogClient posts={[]} categories={[]} />
}
