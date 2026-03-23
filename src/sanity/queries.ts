import { groq } from 'next-sanity'

// Full post (for blog post page)
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    body,
    htmlBody,
    category,
    tags,
    author,
    publishedAt,
    mainImage { ..., "url": asset->url, alt },
    seoDescription,
    relatedPosts[]-> {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      category,
      publishedAt,
      mainImage { "url": asset->url, alt }
    }
  }
`

// Listing (all posts, newest first)
export const allPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    category,
    tags,
    author,
    publishedAt,
    mainImage { "url": asset->url, alt }
  }
`

// Slugs (for static generation)
export const allPostSlugsQuery = groq`
  *[_type == "post"] { "slug": slug.current }
`

