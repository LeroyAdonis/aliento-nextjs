import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'
import { apiVersion, dataset, projectId } from './env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

// Write client — requires SANITY_API_TOKEN (server-side only, never expose in browser)
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

const builder = createImageUrlBuilder(client)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source)
}

