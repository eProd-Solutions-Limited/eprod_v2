import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.eprod-solutions.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/analytics/', '/admin/'],
      },
      // Allow major AI crawlers explicitly
      {
        userAgent: ['GPTBot', 'Claude-Web', 'CCBot', 'Google-Extended', 'PerplexityBot'],
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/analytics/', '/admin/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
