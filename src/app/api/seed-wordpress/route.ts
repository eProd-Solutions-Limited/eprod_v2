import { NextRequest, NextResponse } from 'next/server'
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

// ── HTML → Lexical conversion ──────────────────────────────────────────────

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

function makeTextNode(text: string, format: number): object {
  return { detail: 0, format, mode: 'normal' as const, style: '', text, type: 'text', version: 1 }
}

// Parse inline HTML into Lexical text nodes, preserving bold and italic.
// Link text is kept as plain text (link URLs are discarded — old WP CDN links).
function parseInlineNodes(html: string): object[] {
  // Normalize <br> to space before tokenising
  const src = html.replace(/<br\s*\/?>/gi, ' ')

  const nodes: object[] = []
  const tokenRe = /(<strong(?:\s[^>]*)?>|<\/strong>|<b[\s>][^>]*>|<\/b>|<em(?:\s[^>]*)?>|<\/em>|<i[\s>][^>]*>|<\/i>|<[^>]+>|[^<]+)/g

  let bold = 0
  let italic = 0

  let m: RegExpExecArray | null
  while ((m = tokenRe.exec(src)) !== null) {
    const tok = m[1]
    const low = tok.toLowerCase()

    if (/^<strong|^<b[\s>]/.test(low)) { bold++ }
    else if (/^<\/strong>|^<\/b>/.test(low)) { bold = Math.max(0, bold - 1) }
    else if (/^<em|^<i[\s>]/.test(low)) { italic++ }
    else if (/^<\/em>|^<\/i>/.test(low)) { italic = Math.max(0, italic - 1) }
    else if (!tok.startsWith('<')) {
      const text = decodeEntities(tok)
      if (text) nodes.push(makeTextNode(text, (bold > 0 ? 1 : 0) | (italic > 0 ? 2 : 0)))
    }
    // All other tags (<a>, <span>, <img>, etc.) are transparent — their text content is captured by the text branch
  }

  return nodes.filter((n: any) => n.type !== 'text' || n.text.length > 0)
}

// Parse <li> items from list HTML into Lexical listitem nodes
function parseListItems(html: string): object[] {
  const items: object[] = []
  const liRe = /<li[^>]*>([\s\S]*?)<\/li>/gi
  let m: RegExpExecArray | null
  let value = 1
  while ((m = liRe.exec(html)) !== null) {
    // Strip any nested block elements within the li (nested lists, etc.)
    const liContent = m[1].replace(/<(?:ul|ol|p|div|figure)[^>]*>[\s\S]*?<\/(?:ul|ol|p|div|figure)>/gi, '')
    const inline = parseInlineNodes(liContent)
    if (inline.length > 0) {
      items.push({
        children: inline,
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        type: 'listitem',
        version: 1,
        value: value++,
      })
    }
  }
  return items
}

// Convert WordPress post HTML to Lexical block nodes.
// Processes blocks sequentially so nested elements (e.g. <p> inside <blockquote>) are consumed by their parent.
function htmlToLexicalNodes(html: string): object[] {
  let src = html.replace(/<!--[\s\S]*?-->/g, '').replace(/\r\n|\r/g, '\n').trim()
  const nodes: object[] = []

  while (src.length > 0) {
    src = src.replace(/^[\s\n]+/, '')
    if (!src) break

    let m: RegExpMatchArray | null

    // Headings h1–h6
    m = src.match(/^<(h[1-6])(?:[^>]*)>([\s\S]*?)<\/\1>/i)
    if (m) {
      const text = decodeEntities(m[2].replace(/<[^>]+>/g, '').trim())
      if (text) {
        nodes.push({
          children: [makeTextNode(text, 0)],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          tag: m[1].toLowerCase() as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
          type: 'heading',
          version: 1,
        })
      }
      src = src.slice(m[0].length)
      continue
    }

    // Blockquote — strip inner tags, keep text
    m = src.match(/^<blockquote(?:[^>]*)>([\s\S]*?)<\/blockquote>/i)
    if (m) {
      const text = decodeEntities(m[1].replace(/<[^>]+>/g, '').trim())
      if (text) {
        nodes.push({
          children: [makeTextNode(text, 0)],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          type: 'quote',
          version: 1,
        })
      }
      src = src.slice(m[0].length)
      continue
    }

    // Unordered list
    m = src.match(/^<ul(?:[^>]*)>([\s\S]*?)<\/ul>/i)
    if (m) {
      const items = parseListItems(m[1])
      if (items.length > 0) {
        nodes.push({
          children: items,
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          listType: 'bullet',
          start: 1,
          tag: 'ul',
          type: 'list',
          version: 1,
        })
      }
      src = src.slice(m[0].length)
      continue
    }

    // Ordered list
    m = src.match(/^<ol(?:[^>]*)>([\s\S]*?)<\/ol>/i)
    if (m) {
      const items = parseListItems(m[1])
      if (items.length > 0) {
        nodes.push({
          children: items,
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          listType: 'number',
          start: 1,
          tag: 'ol',
          type: 'list',
          version: 1,
        })
      }
      src = src.slice(m[0].length)
      continue
    }

    // Paragraph
    m = src.match(/^<p(?:[^>]*)>([\s\S]*?)<\/p>/i)
    if (m) {
      const inline = parseInlineNodes(m[1])
      if (inline.length > 0) {
        nodes.push({
          children: inline,
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          type: 'paragraph',
          version: 1,
        })
      }
      src = src.slice(m[0].length)
      continue
    }

    // Skip any unrecognised tag (<figure>, <div>, etc.)
    m = src.match(/^<[^>]+>/)
    if (m) { src = src.slice(m[0].length); continue }

    // Naked text (rare in WP but handle gracefully)
    const nextTag = src.indexOf('<')
    if (nextTag === -1) {
      const text = decodeEntities(src.trim())
      if (text) {
        nodes.push({
          children: [makeTextNode(text, 0)],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          type: 'paragraph',
          version: 1,
        })
      }
      break
    }
    src = src.slice(nextTag)
  }

  // Fallback: strip all tags and wrap in a single paragraph
  if (nodes.length === 0) {
    const text = decodeEntities(html.replace(/<[^>]+>/g, '').trim())
    if (text) {
      nodes.push({
        children: [makeTextNode(text, 0)],
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

// ── Route handler ──────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }
  const payload = await getPayload({ config: payloadConfig })

  // ?reset=true deletes all existing articles before re-importing
  const reset = new URL(request.url).searchParams.get('reset') === 'true'

  if (reset) {
    let page = 1
    let hasMore = true
    while (hasMore) {
      const batch = await payload.find({ collection: 'articles', limit: 100, page, depth: 0 })
      for (const doc of batch.docs) {
        await payload.delete({ collection: 'articles', id: doc.id, overrideAccess: true })
      }
      hasMore = batch.hasNextPage
      page++
    }
  }

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
