import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin',
          '/questionnaire',
          '/consult/book',
          '/consult/bookings',
          '/consult/reschedule',
          '/consult/cancel/',
          '/consult/confirmed/',
          '/*/questionnaire',
          '/*/confirmed',
          '/prescription/', // covers /[scriptId]
        ],
      },
      {
        // Explicit AI-crawler policy: welcome AI engines to public content
        userAgent: [
          'GPTBot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'PerplexityBot',
          'ClaudeBot',
          'anthropic-ai',
          'Google-Extended',
          'Applebot-Extended',
        ],
        allow: '/',
        disallow: ['/api/', '/admin'],
      },
    ],
    sitemap: 'https://alientomd.com/sitemap.xml',
  }
}
