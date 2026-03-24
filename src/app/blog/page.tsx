import { getAllPosts, getAllCategories } from '@/lib/sanity'
import BlogClient from './BlogClient'

// Static fallback posts when Sanity has no content yet
const fallbackPosts = [
  {
    _id: 'fb-1',
    title: 'How to Boost Your Immune System Naturally This Winter',
    slug: { current: 'how-to-boost-your-immune-system-naturally-this-winter' },
    excerpt: 'With flu season around the corner, supporting your immune system should be at the top of your health checklist.',
    category: { title: 'Nutrition', slug: { current: 'nutrition' } },
    tags: [],
    author: 'Aliento Medical',
    publishedAt: '2026-03-18',
  },
  {
    _id: 'fb-2',
    title: 'Mental Health Matters: Breaking the Stigma in South Africa',
    slug: { current: 'mental-health-matters-breaking-the-stigma' },
    excerpt: '1 in 4 South Africans will experience a mental health condition in their lifetime. Yet most never seek help.',
    category: { title: 'Mental Health', slug: { current: 'mental-health' } },
    tags: ['mental health', 'depression', 'anxiety', 'stigma'],
    author: 'Dr. Aliento Team',
    publishedAt: '2026-03-18',
  },
  {
    _id: 'fb-3',
    title: 'The Power of Preventive Care: Why Waiting Costs You',
    slug: { current: 'the-power-of-preventive-care' },
    excerpt: 'A 20-minute screening can save your life and save you hundreds of thousands of rands.',
    category: { title: 'Screening', slug: { current: 'screening' } },
    tags: ['preventive care', 'screenings', 'health check-ups'],
    author: 'Dr. Aliento Team',
    publishedAt: '2026-03-18',
  },
  {
    _id: 'fb-4',
    title: "Welcome to Aliento's Health Blog",
    slug: { current: 'welcome-to-aliento-health-blog' },
    excerpt: "Your health deserves more than a quick Google search. Here's what Aliento's new blog brings to the table.",
    category: { title: 'Wellness', slug: { current: 'wellness' } },
    tags: ['introduction', 'health', 'wellness'],
    author: 'Aliento Medical',
    publishedAt: '2026-03-18',
  },
  {
    _id: 'fb-5',
    title: '5 Tips for Managing Chronic Conditions',
    slug: { current: '5-tips-for-managing-chronic-conditions' },
    excerpt: 'Over 60% of South Africans live with at least one chronic condition. These five strategies help you manage yours.',
    category: { title: 'Medical Conditions', slug: { current: 'medical-conditions' } },
    tags: ['chronic conditions', 'diabetes', 'hypertension'],
    author: 'Dr. Aliento Team',
    publishedAt: '2026-03-17',
  },
  {
    _id: 'fb-6',
    title: 'Understanding Personalised Medicine: The Future of Healthcare',
    slug: { current: 'understanding-personalised-medicine' },
    excerpt: 'Two patients. Same diagnosis. Different treatments. Here\'s why personalised medicine is changing healthcare.',
    category: { title: 'Research', slug: { current: 'research' } },
    tags: ['personalised medicine', 'genetics', 'innovation'],
    author: 'Aliento Medical',
    publishedAt: '2026-03-15',
  },
  {
    _id: 'fb-7',
    title: 'When to See a Doctor: A Complete Guide',
    slug: { current: 'when-to-see-a-doctor' },
    excerpt: "That symptom you're ignoring? Here's exactly when it's time to stop Googling and book an appointment.",
    category: { title: 'Wellness', slug: { current: 'wellness' } },
    tags: ['check-ups', 'preventive care', 'symptoms'],
    author: 'Aliento Medical',
    publishedAt: '2026-03-10',
  },
]

const fallbackCategories = [
  'Nutrition',
  'Mental Health',
  'Screening',
  'Medical Conditions',
  'Research',
  'Wellness',
  'Novel Techniques',
]

export default async function BlogPage() {
  let posts
  let categories

  try {
    const [sanityPosts, sanityCategories] = await Promise.all([
      getAllPosts(),
      getAllCategories(),
    ])
    posts = sanityPosts.length > 0 ? sanityPosts : fallbackPosts
    categories = sanityCategories.length > 0
      ? sanityCategories.map((c) => c.title)
      : fallbackCategories
  } catch {
    posts = fallbackPosts
    categories = fallbackCategories
  }

  return <BlogClient posts={posts} categories={categories} />
}
