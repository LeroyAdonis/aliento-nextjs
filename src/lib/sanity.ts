import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kygbgd7',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-03-23',
  useCdn: true,
})

const builder = createImageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// ── Types ──
export interface SanityPost {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  coverImage?: any
  category: { title: string; slug?: { current: string }; color?: string }
  tags: string[]
  author: string
  publishedAt: string
  body?: unknown[]
  relatedPosts?: SanityPost[]
}

export interface SanityCategory {
  _id: string
  title: string
  slug: { current: string }
  description?: string
  color?: string
}

// ── Queries ──
const postFields = `
  _id,
  title,
  slug,
  excerpt,
  coverImage,
  category->{title, slug, color},
  tags,
  author,
  publishedAt,
`

export async function getAllPosts(): Promise<SanityPost[]> {
  return client.fetch(
    `*[_type == "post"] | order(publishedAt desc) {
      ${postFields}
    }`
  )
}

export async function getPostBySlug(slug: string): Promise<SanityPost | null> {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      ${postFields}
      body,
      relatedPosts[]->{
        _id,
        title,
        slug,
        excerpt,
        coverImage,
        category->{title, slug, color},
        publishedAt
      }
    }`,
    { slug }
  )
}

export async function getAllCategories(): Promise<SanityCategory[]> {
  return client.fetch(
    `*[_type == "category"] | order(title asc) {
      _id,
      title,
      slug,
      description,
      color
    }`
  )
}

export async function getPostsByCategory(categorySlug: string): Promise<SanityPost[]> {
  return client.fetch(
    `*[_type == "post" && category->slug.current == $categorySlug] | order(publishedAt desc) {
      ${postFields}
    }`,
    { categorySlug }
  )
}
