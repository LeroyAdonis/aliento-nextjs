import type { PortableTextBlock } from '@portabletext/types'

export interface SanityPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  body?: PortableTextBlock[]
  htmlBody?: string
  category: string
  tags: string[]
  author: string
  publishedAt: string
  mainImage?: { url: string; alt?: string }
  seoDescription?: string
  relatedPosts?: SanityRelatedPost[]
}

export interface SanityRelatedPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  category: string
  publishedAt: string
  mainImage?: { url: string; alt?: string }
}

