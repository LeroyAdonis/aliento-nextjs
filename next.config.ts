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
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: '1dp2ojinmz645uqk.public.blob.vercel-storage.com',
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
// The prescription offering is withdrawn (client request, 2026-11-13): the marketing page, the
// questionnaire and the confirmation step are gone, so old links — in emails already sent, in CMS
// articles, in search results — land on the consult page that can still help the person, rather than
// a 404. Temporary on purpose: it may come back.
//
// Exception: /prescription/:scriptId is the per-script patient view. It is not part of the public
// offering — it is unlisted, noindex, and requires the patient's SA ID number — but the script emails
// link to it, so it must keep resolving. Only the withdrawn marketing paths are redirected.
{
source: '/prescription',
destination: '/consult',
permanent: false,
},
{
source: '/prescription/questionnaire',
destination: '/consult',
permanent: false,
},
{
source: '/prescription/confirmed',
destination: '/consult',
permanent: false,
},
// Sanity slug cleanups (2026-08-24): old URLs had raw spaces/commas/capitals
{
source: '/health-topics/Explanation%20of%20Autoimmune%20Diseases',
destination: '/health-topics/autoimmune-diseases-explained',
permanent: true,
},
{
source: '/health-topics/Hypertension%2C%20High%20Blood%20Pressure%2C%20%20BP',
destination: '/health-topics/hypertension',
permanent: true,
},
]
},
}

export default nextConfig