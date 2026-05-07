import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'

const DEFAULT_CATEGORIES = [
  { name: 'Articles', slug: 'articles' },
  { name: 'Company News', slug: 'company-news' },
  { name: 'Events', slug: 'events' },
  { name: 'Culture', slug: 'culture' },
]

if (process.env.NODE_ENV === 'production') {
  throw new Error('Seed route must not be used in production')
}

export async function GET() {
  const payload = await getPayload({ config: payloadConfig })
  const results: string[] = []
  const errors: string[] = []

  for (const cat of DEFAULT_CATEGORIES) {
    try {
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
    } catch (e: any) {
      errors.push(`Failed: "${cat.name}" — ${e.message}`)
    }
  }

  return NextResponse.json({ ok: true, results, errors })
}
