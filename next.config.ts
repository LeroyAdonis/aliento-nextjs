import type { NextConfig } from 'next'
import { z } from 'zod'

// Validate Sanity environment variables
const sanityEnvSchema = z.object({
 NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
 NEXT_PUBLIC_SANITY_DATASET: z.string().min(1),
})

sanityEnvSchema.parse({
 NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
 NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
})

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