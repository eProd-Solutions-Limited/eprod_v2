import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'

const DEFAULT_CATEGORIES = [
  { name: 'Articles', slug: 'articles' },
  { name: 'Company News', slug: 'company-news' },
  { name: 'Events', slug: 'events' },
  { name: 'Culture', slug: 'culture' },
]

export async function GET() {
  const payload = await getPayload({ config: payloadConfig })
  const results: string[] = []

  for (const cat of DEFAULT_CATEGORIES) {
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: cat.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      results.push(`Skipped: "${cat.name}" (already exists)`)
      continue
    }

    await payload.create({
      collection: 'categories',
      data: cat,
      overrideAccess: true,
    })

    results.push(`Created: "${cat.name}"`)
  }

  return NextResponse.json({ ok: true, results })
}
