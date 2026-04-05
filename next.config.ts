import type { NextConfig } from 'next'
import { z } from 'zod'

// Validate Sanity environment variables — gracefully degrade if missing.
// The Sanity configs (sanity.config.ts, sanity.cli.ts) have hardcoded
// fallbacks so the app still works without env vars.
const sanityEnvSchema = z.object({
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_SANITY_DATASET: z.string().min(1).optional(),
})

const sanityEnv = sanityEnvSchema.parse({
  NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
})

if (!sanityEnv.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.warn(
    '[Aliento] NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Sanity client will fall back to hardcoded default.',
  )
}

const nextConfig: NextConfig = {
 turbopack: {
 root: '/root/.openclaw/workspace/aliento-nextjs',
 },
 images: {
 remotePatterns: [
 {
 protocol: 'https',
 hostname: 'cdn.sanity.io',
 },
 ],
 },
 async redirects() {
 return [
 {
 source: '/blog',
 destination: '/health-topics',
 permanent: true,
 },
 {
 source: '/blog/:slug',
 destination: '/health-topics/:slug',
 permanent: true,
 },
 {
 source: '/services',
 destination: '/',
 permanent: false,
 },
 ]
 },
}

export default nextConfig