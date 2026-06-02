import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload-client'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.eprod-solutions.com'

const staticRoutes: MetadataRoute.Sitemap = [
  { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
  { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  { url: `${siteUrl}/solutions`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
  { url: `${siteUrl}/sectors`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  { url: `${siteUrl}/case-studies`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${siteUrl}/insights`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${siteUrl}/events`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.6 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()

  const [articlesResult, eventsResult] = await Promise.all([
    payload.find({ collection: 'articles', limit: 1000, depth: 0 }),
    payload.find({ collection: 'events', limit: 1000, depth: 0 }),
  ])

  const articleRoutes: MetadataRoute.Sitemap = articlesResult.docs.map((article) => ({
    url: `${siteUrl}/articles/${article.slug}`,
    lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const eventRoutes: MetadataRoute.Sitemap = eventsResult.docs.map((event) => ({
    url: `${siteUrl}/events/${event.id}`,
    lastModified: event.updatedAt ? new Date(event.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...articleRoutes, ...eventRoutes]
}
