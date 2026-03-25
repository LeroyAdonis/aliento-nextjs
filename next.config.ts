import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
