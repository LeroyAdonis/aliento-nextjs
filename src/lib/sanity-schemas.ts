/**
 * Zod schemas for Sanity content types.
 *
 * These mirror the Sanity document schemas defined in
 *   sanity/schemas/post.ts
 *   sanity/schemas/category.ts
 *
 * They validate the *output* of GROQ queries — i.e. the shape
 * of the payload Sanity returns after dereferencing.
 */
import { z } from "zod";

// ── Sanity image asset (the { _ref: "image-…-png" } shape)
export const SanityImageRefSchema = z.object({
  _type: z.literal("image").optional(),
  asset: z.object({
    _ref: z.string(),
    _type: z.literal("reference").optional(),
  }),
});

// ── Category (after GROQ dereference: category->{ title, slug, color })
export const SanityCategorySchema = z.object({
  _id: z.string().optional(),
  _type: z.literal("category").optional(),
  title: z.string().min(1),
  slug: z.object({
    _type: z.literal("slug").optional(),
    current: z.string().min(1),
  }),
  description: z.string().nullish().default(null),
  color: z.string().nullish().default(null),
});

// ── Sanity Portable Text block (simplified — covers the fields we render)
export const SanityBlockSchema: z.ZodType = z.lazy(() =>
  z.object({
    _type: z.literal("block").optional(),
    _key: z.string().optional(),
    style: z.string().optional(),
    children: z
      .array(
        z.object({
          _key: z.string().optional(),
          _type: z.string(),
          text: z.string(),
          marks: z.array(z.string()).optional(),
        })
      )
      .optional(),
    markDefs: z
      .array(
        z.object({
          _key: z.string().optional(),
          _type: z.string(),
          href: z.string().optional(),
          reference: z.string().optional(),
        })
      )
      .optional(),
    listItem: z.string().optional(),
    level: z.number().optional(),
  })
);

// ── Sanity image with hotspot + custom fields
export const SanityImageWithFieldsSchema = SanityImageRefSchema.extend({
  hotspot: z.object({
    x: z.number(),
    y: z.number(),
    height: z.number(),
    width: z.number(),
  }).optional(),
}).extend({
  caption: z.string().nullish().default(null),
  alt: z.string().nullish().default(null),
});

// ── Post (after GROQ dereference: includes body + relatedPosts[])
export const SanityPostSchema = z.object({
  _id: z.string(),
  _type: z.literal("post").optional(),
  title: z.string().min(1),
  slug: z.object({
    _type: z.literal("slug").optional(),
    current: z.string().min(1),
  }),
  excerpt: z.string().nullish().default(null),
  coverImage: SanityImageRefSchema.optional().nullable(),
  category: SanityCategorySchema,
  tags: z.array(z.string()).default([]),
  author: z.string().default("Aliento Medical"),
  publishedAt: z.string().default(new Date().toISOString()),
  body: z.array(z.union([SanityBlockSchema, SanityImageWithFieldsSchema])).optional().default([]),
  relatedPosts: z.array(
    z.object({
      _id: z.string(),
      title: z.string(),
      slug: z.object({ current: z.string() }),
      excerpt: z.string().nullish().default(null),
      coverImage: SanityImageRefSchema.optional().nullable(),
      category: SanityCategorySchema.optional(),
      publishedAt: z.string().optional(),
    })
  ).default([]),
});

// ── Infer TypeScript types from schemas
export type SanityImageRef = z.infer<typeof SanityImageRefSchema>;
export type SanityCategory = z.infer<typeof SanityCategorySchema>;
export type SanityBlock = z.infer<typeof SanityBlockSchema>;
export type SanityImageWithFields = z.infer<typeof SanityImageWithFieldsSchema>;
export type SanityPost = z.infer<typeof SanityPostSchema>;

// ── Validation helpers
export function validatePost(data: unknown): SanityPost | null {
  const result = SanityPostSchema.safeParse(data);
  if (!result.success) {
    console.warn("[sanity] Invalid post data:", result.error.message);
    return null;
  }
  return result.data;
}

export function validateCategory(data: unknown): SanityCategory | null {
  const result = SanityCategorySchema.safeParse(data);
  if (!result.success) {
    console.warn("[sanity] Invalid category data:", result.error.message);
    return null;
  }
  return result.data;
}
