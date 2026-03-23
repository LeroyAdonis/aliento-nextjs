import { defineField, defineType } from 'sanity'

export const BLOG_CATEGORIES = [
  'Nutrition',
  'Mental Health',
  'Screening',
  'Medical Conditions',
  'Research',
  'Wellness',
  'Novel Techniques',
] as const

export const postType = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      description: 'Short summary shown in blog listing (1–2 sentences)',
      type: 'text',
      rows: 3,
      validation: (r) => r.required().max(300),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: BLOG_CATEGORIES.map((c) => ({ title: c, value: c })),
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      initialValue: 'Aliento Health',
    }),
    defineField({
      name: 'mainImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Underline', value: 'underline' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (r) =>
                      r.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto'] }),
                  },
                  {
                    name: 'blank',
                    type: 'boolean',
                    title: 'Open in new tab',
                    initialValue: false,
                  },
                ],
              },
              {
                name: 'internalLink',
                type: 'object',
                title: 'Internal Post Link',
                icon: () => '📄',
                fields: [
                  {
                    name: 'reference',
                    type: 'reference',
                    title: 'Post',
                    to: [{ type: 'post' }],
                  },
                ],
              },
            ],
          },
        },
        { type: 'image', options: { hotspot: true } },
      ],
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Related Posts',
      description: 'Up to 3 posts to show at the bottom as "Read more"',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'post' }] }],
      validation: (r) => r.max(3),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      description: 'Overrides excerpt for search engines (optional)',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'mainImage',
      date: 'publishedAt',
    },
    prepare({ title, category, media, date }) {
      return {
        title,
        subtitle: `${category ?? 'Uncategorised'} · ${date ? new Date(date).toLocaleDateString('en-ZA') : 'Draft'}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Published Date (newest)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
})

