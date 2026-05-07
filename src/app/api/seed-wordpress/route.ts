import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import fs from 'node:fs'
import path from 'node:path'

// Maps WordPress display category names → our category slugs
const WP_CATEGORY_MAP: Record<string, string> = {
  'News & Events': 'company-news',
  'News &amp; Events': 'company-news',
  'Recent Activities': 'events',
}

if (process.env.NODE_ENV === 'production') {
  throw new Error('Seed route must not be used in production')
}

function extractCDATA(itemXml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`)
  const match = itemXml.match(regex)
  return match ? match[1].trim() : ''
}

function extractWpCategories(itemXml: string): string[] {
  const results: string[] = []
  let match
  const regex = /<category domain="category"[^>]*><!\[CDATA\[([^\]]*?)\]\]><\/category>/g
  while ((match = regex.exec(itemXml)) !== null) {
    results.push(match[1].trim())
  }
  return results
}

function mapCategorySlug(wpCategories: string[]): string {
  for (const cat of wpCategories) {
    if (WP_CATEGORY_MAP[cat]) return WP_CATEGORY_MAP[cat]
  }
  return 'articles'
}

function htmlToLexicalNodes(html: string): object[] {
  const cleaned = html.replace(/<!--[\s\S]*?-->/g, '').trim()
  const nodes: object[] = []
  let match
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/g
  while ((match = pRegex.exec(cleaned)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, '').trim()
    if (text) {
      nodes.push({
        children: [{ detail: 0, format: 0, mode: 'normal', style: '', text, type: 'text', version: 1 }],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        type: 'paragraph',
        version: 1,
      })
    }
  }
  if (nodes.length === 0) {
    const text = cleaned.replace(/<[^>]+>/g, '').trim()
    if (text) {
      nodes.push({
        children: [{ detail: 0, format: 0, mode: 'normal', style: '', text, type: 'text', version: 1 }],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        type: 'paragraph',
        version: 1,
      })
    }
  }
  return nodes
}

function buildRichText(html: string) {
  return {
    root: {
      children: htmlToLexicalNodes(html),
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}

export async function GET() {
  const payload = await getPayload({ config: payloadConfig })

  const xmlPath = path.join(process.cwd(), 'eprodsolutions.WordPress.2026-05-07 (1).xml')
  let xml: string
  try {
    xml = fs.readFileSync(xmlPath, 'utf-8')
  } catch {
    return NextResponse.json({ ok: false, error: 'WordPress XML file not found at project root' }, { status: 404 })
  }

  // Extract all <item> blocks
  const items: string[] = []
  let itemMatch
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  while ((itemMatch = itemRegex.exec(xml)) !== null) {
    items.push(itemMatch[1])
  }

  // Cache categories to avoid repeated DB queries
  const categoryCache = new Map<string, number>()

  async function getCategoryId(slug: string): Promise<number | undefined> {
    if (categoryCache.has(slug)) return categoryCache.get(slug)
    const result = await payload.find({
      collection: 'categories',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    if (result.docs.length > 0) {
      const id = result.docs[0].id as number
      categoryCache.set(slug, id)
      return id
    }
    // Create on the fly if missing
    const name = slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
    const created = await payload.create({
      collection: 'categories',
      data: { name, slug },
      overrideAccess: true,
    })
    const id = created.id as number
    categoryCache.set(slug, id)
    return id
  }

  let imported = 0
  let skipped = 0
  const errors: string[] = []

  for (const itemXml of items) {
    const postType = extractCDATA(itemXml, 'wp:post_type')
    const status = extractCDATA(itemXml, 'wp:status')
    if (postType !== 'post' || status !== 'publish') {
      skipped++
      continue
    }

    const slug = extractCDATA(itemXml, 'wp:post_name')
    if (!slug) { skipped++; continue }

    // Skip if article with this slug already exists
    const existing = await payload.find({
      collection: 'articles',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) { skipped++; continue }

    try {
      const title = extractCDATA(itemXml, 'title') || slug
      const excerpt = extractCDATA(itemXml, 'excerpt:encoded')
      const content = extractCDATA(itemXml, 'content:encoded')
      const publishedAtRaw = extractCDATA(itemXml, 'wp:post_date_gmt')
      const wpCategories = extractWpCategories(itemXml)
      const categorySlug = mapCategorySlug(wpCategories)
      const categoryId = await getCategoryId(categorySlug)

      await payload.create({
        collection: 'articles',
        data: {
          title,
          slug,
          excerpt: excerpt || undefined,
          publishedAt: publishedAtRaw ? new Date(publishedAtRaw).toISOString() : undefined,
          category: categoryId,
          content: [
            {
              blockType: 'richText',
              content: buildRichText(content),
            },
          ],
        } as any,
        overrideAccess: true,
      })
      imported++
    } catch (e: any) {
      const title = extractCDATA(itemXml, 'title') || extractCDATA(itemXml, 'wp:post_name') || 'unknown'
      errors.push(`"${title}": ${e.message}`)
    }
  }

  return NextResponse.json({ ok: true, imported, skipped, errors })
}
