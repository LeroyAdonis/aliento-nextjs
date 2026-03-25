import { Metadata } from 'next'
import { getAllPosts, getAllCategories } from '@/lib/sanity'
import BlogClient from '@/app/blog/BlogClient'
import type { SanityPost } from '@/lib/sanity'

export const metadata: Metadata = {
  title: 'Health Topics',
  description:
    'Browse expert-backed articles on nutrition, mental health, screening, medical conditions, research, and wellness.',
}

const fallbackPosts: SanityPost[] = [
  {
    _id: 'fb-1',
    title: 'How to Boost Your Immune System Naturally This Winter',
    slug: { current: 'how-to-boost-your-immune-system-naturally-this-winter' },
    excerpt:
      'With flu season around the corner, supporting your immune system should be at the top of your health checklist.',
    category: { title: 'Nutrition', slug: { current: 'nutrition' } },
    tags: [],
    author: 'Dr. Aliento',
    publishedAt: '2026-03-18',
  },
  {
    _id: 'fb-2',
    title: 'Mental Health Matters: Breaking the Stigma in South Africa',
    slug: { current: 'mental-health-matters-breaking-the-stigma' },
    excerpt: '1 in 4 South Africans will experience a mental health condition in their lifetime.',
    category: { title: 'Mental Health', slug: { current: 'mental-health' } },
    tags: ['mental health', 'depression'],
    author: 'Dr. Aliento',
    publishedAt: '2026-03-18',
  },
  {
    _id: 'fb-3',
    title: 'The Power of Preventive Care: Why Waiting Costs You',
    slug: { current: 'the-power-of-preventive-care' },
    excerpt:
      'A 20-minute screening can save your life and save you hundreds of thousands of rands.',
    category: { title: 'Screening', slug: { current: 'screening' } },
    tags: ['preventive care', 'screenings'],
    author: 'Dr. Aliento',
    publishedAt: '2026-03-18',
  },
  {
    _id: 'fb-4',
    title: "Welcome to Aliento's Health Blog",
    slug: { current: 'welcome-to-aliento-health-blog' },
    excerpt: 'Your health deserves more than a quick Google search.',
    category: { title: 'Wellness', slug: { current: 'wellness' } },
    tags: ['introduction', 'wellness'],
    author: 'Dr. Aliento',
    publishedAt: '2026-03-18',
  },
  {
    _id: 'fb-5',
    title: '5 Tips for Managing Chronic Conditions',
    slug: { current: '5-tips-for-managing-chronic-conditions' },
    excerpt: 'Over 60% of South Africans live with at least one chronic condition.',
    category: { title: 'Medical Conditions', slug: { current: 'medical-conditions' } },
    tags: ['chronic conditions', 'diabetes'],
    author: 'Dr. Aliento',
    publishedAt: '2026-03-17',
  },
  {
    _id: 'fb-6',
    title: 'Understanding Personalised Medicine: The Future of Healthcare',
    slug: { current: 'understanding-personalised-medicine' },
    excerpt: 'Two patients. Same diagnosis. Different treatments.',
    category: { title: 'Research', slug: { current: 'research' } },
    tags: ['personalised medicine', 'genetics'],
    author: 'Dr. Aliento',
    publishedAt: '2026-03-15',
  },
  {
    _id: 'fb-7',
    title: 'When to See a Doctor: A Complete Guide',
    slug: { current: 'when-to-see-a-doctor' },
    excerpt:
      "That symptom you're ignoring? Here's exactly when it's time to book an appointment.",
    category: { title: 'Wellness', slug: { current: 'wellness' } },
    tags: ['check-ups', 'preventive care'],
    author: 'Dr. Aliento',
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

export default async function HealthTopicsPage() {
  let posts: SanityPost[]
  let categories: string[]

  try {
    const [sanityPosts, sanityCategories] = await Promise.all([
      getAllPosts(),
      getAllCategories(),
    ])
    posts = sanityPosts.length > 0 ? sanityPosts : fallbackPosts
    categories =
      sanityCategories.length > 0
        ? sanityCategories.map((c) => c.title)
        : fallbackCategories
  } catch {
    posts = fallbackPosts
    categories = fallbackCategories
  }

  return <BlogClient posts={posts} categories={categories} basePath="/health-topics" />
}
