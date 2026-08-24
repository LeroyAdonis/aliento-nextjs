import { getAllPosts, type SanityPost } from '@/lib/sanity'
import { Hero } from '@/components/sections/Hero'
import { StreamServices } from '@/components/sections/StreamServices'
import { FeaturedArticle } from '@/components/sections/FeaturedArticle'
import { HealthTopicCategories } from '@/components/sections/HealthTopicCategories'
import { ForgottenMiddle } from '@/components/sections/ForgottenMiddle'
import { AboutDoctor } from '@/components/sections/AboutDoctor'
import { RecentArticles } from '@/components/sections/RecentArticles'
import { CTA } from '@/components/sections/CTA'

const fallbackPosts: SanityPost[] = [
  {
    _id: 'fb-3',
    title: 'The Power of Preventive Care: Why Waiting Costs You',
    slug: { current: 'the-power-of-preventive-care' },
    excerpt:
      "A 20-minute screening can save your life and save you hundreds of thousands of rands. Here's why preventive care is the smartest health investment you'll ever make.",
    category: { title: 'Screening' },
    tags: [],
    author: 'Dr. Aliento',
    publishedAt: '2026-03-18',
  },
  {
    _id: 'fb-2',
    title: 'Mental Health Matters: Breaking the Stigma in South Africa',
    slug: { current: 'mental-health-matters-breaking-the-stigma' },
    excerpt:
      '1 in 4 South Africans will experience a mental health condition in their lifetime. Yet most never seek help.',
    category: { title: 'Mental Health' },
    tags: [],
    author: 'Dr. Aliento',
    publishedAt: '2026-03-18',
  },
  {
    _id: 'fb-1',
    title: 'How to Boost Your Immune System Naturally This Winter',
    slug: { current: 'how-to-boost-your-immune-system-naturally-this-winter' },
    excerpt:
      'With flu season around the corner, supporting your immune system should be at the top of your health checklist.',
    category: { title: 'Nutrition' },
    tags: [],
    author: 'Dr. Aliento',
    publishedAt: '2026-03-18',
  },
]

export default async function Home() {
  let posts: SanityPost[] = fallbackPosts
  try {
    const sanityPosts = await getAllPosts()
    if (sanityPosts.length > 0) posts = sanityPosts
  } catch {
    // fallback to static posts
  }

  const featuredPost = posts[0]

  const orgPhysicianJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalOrganization',
        '@id': 'https://alientomd.com/#org',
        name: 'Aliento Health',
        url: 'https://alientomd.com',
        email: 'info@alientomd.com',
        logo: 'https://alientomd.com/logo-icon.svg',
        areaServed: 'ZA',
        priceRange: 'R250',
      },
      {
        '@type': 'Physician',
        '@id': 'https://alientomd.com/#dr-adonis',
        name: 'Dr Leegale Franscesca Adonis',
        honorificSuffix: 'MBBCh, MBA, FCPHM (SA), MMed Community Health, PhD',
        worksFor: { '@id': 'https://alientomd.com/#org' },
        url: 'https://alientomd.com/about',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Johannesburg',
          addressCountry: 'ZA',
        },
        medicalSpecialty: ['PublicHealth', 'GeneralPractice'],
        knowsAbout: [
          'Preventive care',
          'Screening',
          'Chronic disease management',
          'Health promotion',
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgPhysicianJsonLd) }}
      />
      <Hero />
      <StreamServices />
      {featuredPost && <FeaturedArticle post={featuredPost} />}
      <HealthTopicCategories />
      <ForgottenMiddle />
      <AboutDoctor />
      <RecentArticles posts={posts} />
      <CTA />
    </>
  )
}
