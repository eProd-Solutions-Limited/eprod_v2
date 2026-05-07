# Insights Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public `/insights` page that imports WordPress posts into Payload CMS and displays them in a hero carousel + magazine masonry grid with search, category filtering, and pagination.

**Architecture:** URL-based server rendering — `category`, `q`, and `page` search params drive Payload queries server-side. Four focused client components (hero carousel, filter bar) and server components (masonry grid, pagination) compose the page. A one-time seeder API route imports WordPress XML into the existing Articles collection.

**Tech Stack:** Next.js 15 App Router, Payload CMS 3.x (SQLite), shadcn/ui, Tailwind CSS v4, TypeScript

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Create | `src/collections/Categories.ts` | Payload collection — user-managed categories with name + slug |
| Modify | `src/collections/Articles.ts` | Add `coverImage` upload + `category` relationship fields |
| Modify | `src/payload.config.ts` | Register Categories collection |
| Create | `src/app/api/seed-categories/route.ts` | GET — seeds 4 default categories, idempotent |
| Create | `src/app/api/seed-wordpress/route.ts` | GET — parses WordPress XML, imports published posts into Articles |
| Create | `src/components/insights/InsightsMasonryGrid.tsx` | Server component — renders magazine masonry layout from article props |
| Create | `src/components/insights/InsightsPagination.tsx` | Server component — prev/next + page number links preserving active filters |
| Create | `src/components/insights/InsightsFilterBar.tsx` | Client component — search input (debounced) + category pill buttons |
| Create | `src/components/insights/InsightsHero.tsx` | Client component — auto-advancing full-width carousel of 5 latest posts |
| Create | `src/app/(frontend)/insights/page.tsx` | Server page — reads search params, runs Payload queries, composes page |

**Note:** `src/components/Navbar.tsx` already includes `{ href: "/insights", label: "Insights" }` — no change needed.

---

## Task 1: Categories collection

**Files:**
- Create: `src/collections/Categories.ts`
- Modify: `src/payload.config.ts`

- [ ] **Step 1: Create the Categories collection**

```typescript
// src/collections/Categories.ts
import { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Used in URL filter params. Auto-fill from name, then adjust if needed.',
      },
    },
  ],
}
```

- [ ] **Step 2: Register Categories in payload.config.ts**

Open `src/payload.config.ts`. Add the import and add `Categories` to the collections array:

```typescript
// Add this import after the existing collection imports:
import { Categories } from './collections/Categories'

// Change the collections line from:
collections: [Users, Media, Articles, CaseStudies, TeamPages, Team, CTAConfig, Popups],
// To:
collections: [Users, Media, Articles, CaseStudies, TeamPages, Team, CTAConfig, Popups, Categories],
```

- [ ] **Step 3: Regenerate Payload types**

```bash
npx payload generate:types
```

Expected: updates `src/payload-types.ts` with `Category` type included. If the command isn't in your PATH, run `npm run generate:types` — check `package.json` scripts for the exact alias.

- [ ] **Step 4: Commit**

```bash
git add src/collections/Categories.ts src/payload.config.ts src/payload-types.ts
git commit -m "feat: add Categories collection to Payload"
```

---

## Task 2: Update Articles collection — add coverImage + category fields

**Files:**
- Modify: `src/collections/Articles.ts`

- [ ] **Step 1: Add coverImage and category fields to Articles**

Open `src/collections/Articles.ts`. Add two new fields inside the `fields` array, after the existing `author` field and before the `content` field:

```typescript
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
    },
```

The full `fields` array should now read (blocks omitted for brevity):

```typescript
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true, required: true },
    { name: 'excerpt', type: 'textarea' },
    { name: 'publishedAt', type: 'date' },
    { name: 'author', type: 'relationship', relationTo: 'users' },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'category', type: 'relationship', relationTo: 'categories' },
    {
      name: 'content',
      type: 'blocks',
      blocks: [richTextBlock, imageBlock, videoBlock, gifBlock, quoteBlock],
      required: true,
      localized: true,
    },
  ],
```

- [ ] **Step 2: Regenerate Payload types**

```bash
npx payload generate:types
```

- [ ] **Step 3: Start the dev server and verify the schema change**

```bash
npm run dev
```

Open `http://localhost:3000/admin` → Articles → click any article. Confirm you see "Cover Image" and "Category" fields in the edit form. The database migration runs automatically on startup with Payload's SQLite adapter.

- [ ] **Step 4: Commit**

```bash
git add src/collections/Articles.ts src/payload-types.ts
git commit -m "feat: add coverImage and category fields to Articles collection"
```

---

## Task 3: Seed default categories

**Files:**
- Create: `src/app/api/seed-categories/route.ts`

- [ ] **Step 1: Create the seeder route**

```typescript
// src/app/api/seed-categories/route.ts
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
```

- [ ] **Step 2: Run the seeder**

With the dev server running, visit: `http://localhost:3000/api/seed-categories`

Expected response:
```json
{
  "ok": true,
  "results": [
    "Created: \"Articles\"",
    "Created: \"Company News\"",
    "Created: \"Events\"",
    "Created: \"Culture\""
  ]
}
```

- [ ] **Step 3: Verify in Payload admin**

Open `http://localhost:3000/admin` → Categories. Confirm all 4 appear.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/seed-categories/route.ts
git commit -m "feat: add seed-categories API route with 4 default categories"
```

---

## Task 4: WordPress XML seeder

**Files:**
- Create: `src/app/api/seed-wordpress/route.ts`

- [ ] **Step 1: Create the seeder route**

```typescript
// src/app/api/seed-wordpress/route.ts
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
  const xml = fs.readFileSync(xmlPath, 'utf-8')

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

    const title = extractCDATA(itemXml, 'title') || slug
    const excerpt = extractCDATA(itemXml, 'excerpt:encoded')
    const content = extractCDATA(itemXml, 'content:encoded')
    const publishedAtRaw = extractCDATA(itemXml, 'wp:post_date_gmt')
    const wpCategories = extractWpCategories(itemXml)
    const categorySlug = mapCategorySlug(wpCategories)
    const categoryId = await getCategoryId(categorySlug)

    try {
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
      errors.push(`"${title}": ${e.message}`)
    }
  }

  return NextResponse.json({ ok: true, imported, skipped, errors })
}
```

- [ ] **Step 2: Run the seeder**

With the dev server running, visit: `http://localhost:3000/api/seed-wordpress`

This will take 30–120 seconds depending on the number of posts. Expected response shape:
```json
{ "ok": true, "imported": 45, "skipped": 120, "errors": [] }
```

`skipped` will be high — it includes pages, attachments, and non-published posts from the XML, which is expected.

- [ ] **Step 3: Verify in Payload admin**

Open `http://localhost:3000/admin` → Articles. Confirm imported posts appear with correct categories. Spot-check a few to confirm category mapping (posts with "News & Events" should show "Company News").

- [ ] **Step 4: Commit**

```bash
git add src/app/api/seed-wordpress/route.ts
git commit -m "feat: add WordPress XML seeder API route"
```

---

## Task 5: InsightsMasonryGrid + InsightsPagination

**Files:**
- Create: `src/components/insights/InsightsMasonryGrid.tsx`
- Create: `src/components/insights/InsightsPagination.tsx`

- [ ] **Step 1: Create the shared article type**

This interface is used by both components. Define it at the top of `InsightsMasonryGrid.tsx` and re-export it so `InsightsHero` and the page can import it from one place.

```typescript
// src/components/insights/InsightsMasonryGrid.tsx
import Link from 'next/link'

export interface InsightArticle {
  id: number
  title: string
  slug: string
  excerpt?: string | null
  publishedAt?: string | null
  coverImage?: { url: string; width?: number; height?: number } | null
  category?: { id: number; name: string; slug: string } | null
}

function formatDate(iso?: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function ArticleCard({ article, large }: { article: InsightArticle; large?: boolean }) {
  const hasCover = !!article.coverImage?.url

  return (
    <Link
      href={`/articles/${article.slug}`}
      className={`group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition hover:shadow-md ${large ? 'row-span-2' : ''}`}
    >
      {/* Cover image or gradient placeholder */}
      <div
        className={`w-full flex-shrink-0 ${large ? 'h-52' : 'h-28'}`}
        style={
          hasCover
            ? { backgroundImage: `url(${article.coverImage!.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { background: 'linear-gradient(135deg, hsl(183 97% 18%), hsl(183 97% 30%))' }
        }
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        {article.category && (
          <span className="w-fit rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
            {article.category.name}
          </span>
        )}
        <h3 className={`font-bold leading-snug text-foreground group-hover:text-primary transition-colors ${large ? 'text-lg' : 'text-sm'}`}>
          {article.title}
        </h3>
        {large && article.excerpt && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
        )}
        {article.publishedAt && (
          <time className="mt-auto text-xs text-muted-foreground">{formatDate(article.publishedAt)}</time>
        )}
      </div>
    </Link>
  )
}

interface InsightsMasonryGridProps {
  articles: InsightArticle[]
}

export function InsightsMasonryGrid({ articles }: InsightsMasonryGridProps) {
  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-muted-foreground">No articles found.</p>
        <Link href="/insights" className="text-sm font-medium text-primary underline underline-offset-4">
          Clear filters
        </Link>
      </div>
    )
  }

  // Group into sets of 3: [large, small, small]
  const groups: InsightArticle[][] = []
  for (let i = 0; i < articles.length; i += 3) {
    groups.push(articles.slice(i, i + 3))
  }

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group, gi) => (
        <div key={gi} className="grid grid-cols-1 gap-4 md:grid-cols-[1.5fr_1fr]">
          {/* Large card — always first in group */}
          <ArticleCard article={group[0]} large />
          {/* Small cards stacked on the right */}
          <div className="flex flex-col gap-4">
            {group.slice(1).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create InsightsPagination**

```typescript
// src/components/insights/InsightsPagination.tsx
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function buildUrl(page: number, category?: string, q?: string): string {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (q) params.set('q', q)
  params.set('page', String(page))
  return `/insights?${params.toString()}`
}

interface InsightsPaginationProps {
  currentPage: number
  totalPages: number
  category?: string
  q?: string
}

export function InsightsPagination({ currentPage, totalPages, category, q }: InsightsPaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
    // Show pages centred around currentPage
    const half = 2
    let start = Math.max(1, currentPage - half)
    const end = Math.min(totalPages, start + 4)
    start = Math.max(1, end - 4)
    return start + i
  }).filter((p) => p >= 1 && p <= totalPages)

  return (
    <nav className="flex items-center justify-center gap-1 pt-8" aria-label="Pagination">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={buildUrl(currentPage - 1, category, q)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted transition"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </Link>
      ) : (
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground/40 cursor-not-allowed">
          <ChevronLeft size={16} />
        </span>
      )}

      {/* Page numbers */}
      {pages.map((page) => (
        <Link
          key={page}
          href={buildUrl(page, category, q)}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition ${
            page === currentPage
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border text-foreground hover:bg-muted'
          }`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </Link>
      ))}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildUrl(currentPage + 1, category, q)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted transition"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground/40 cursor-not-allowed">
          <ChevronRight size={16} />
        </span>
      )}
    </nav>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/insights/InsightsMasonryGrid.tsx src/components/insights/InsightsPagination.tsx
git commit -m "feat: add InsightsMasonryGrid and InsightsPagination components"
```

---

## Task 6: InsightsFilterBar (client component)

**Files:**
- Create: `src/components/insights/InsightsFilterBar.tsx`

- [ ] **Step 1: Create the component**

```typescript
// src/components/insights/InsightsFilterBar.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'

interface Category {
  id: number
  name: string
  slug: string
}

interface InsightsFilterBarProps {
  categories: Category[]
}

export function InsightsFilterBar({ categories }: InsightsFilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('category') ?? ''
  const activeQ = searchParams.get('q') ?? ''

  const [inputValue, setInputValue] = useState(activeQ)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keep input in sync if browser back/forward changes params
  useEffect(() => {
    setInputValue(activeQ)
  }, [activeQ])

  function pushParams(category: string, q: string) {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (q) params.set('q', q)
    params.set('page', '1')
    router.push(`/insights?${params.toString()}`)
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setInputValue(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      pushParams(activeCategory, value)
    }, 300)
  }

  function handleCategoryClick(slug: string) {
    const next = slug === activeCategory ? '' : slug
    pushParams(next, inputValue)
  }

  return (
    <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
      {/* Search input */}
      <div className="relative w-full sm:max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={inputValue}
          onChange={handleSearchChange}
          placeholder="Search articles..."
          className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryClick('')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            activeCategory === ''
              ? 'bg-primary text-primary-foreground'
              : 'border border-border text-muted-foreground hover:border-primary hover:text-primary'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.slug)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeCategory === cat.slug
                ? 'bg-primary text-primary-foreground'
                : 'border border-border text-muted-foreground hover:border-primary hover:text-primary'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/insights/InsightsFilterBar.tsx
git commit -m "feat: add InsightsFilterBar client component with debounced search"
```

---

## Task 7: InsightsHero (client component)

**Files:**
- Create: `src/components/insights/InsightsHero.tsx`

- [ ] **Step 1: Create the component**

```typescript
// src/components/insights/InsightsHero.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { InsightArticle } from './InsightsMasonryGrid'

function estimateReadTime(excerpt?: string | null): number {
  if (!excerpt) return 3
  return Math.max(1, Math.ceil(excerpt.split(/\s+/).length / 200))
}

function formatDate(iso?: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

interface InsightsHeroProps {
  articles: InsightArticle[]
}

export function InsightsHero({ articles }: InsightsHeroProps) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || articles.length <= 1) return
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % articles.length)
    }, 5000)
    return () => clearInterval(id)
  }, [paused, articles.length])

  if (articles.length === 0) return null

  const article = articles[current]
  const hasCover = !!article.coverImage?.url

  function prev() {
    setCurrent((c) => (c - 1 + articles.length) % articles.length)
  }

  function next() {
    setCurrent((c) => (c + 1) % articles.length)
  }

  return (
    <section
      className="relative w-full overflow-hidden rounded-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Featured insights"
    >
      {/* Background */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={
          hasCover
            ? { backgroundImage: `url(${article.coverImage!.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { background: 'linear-gradient(135deg, hsl(183 97% 14%), hsl(183 97% 25%))' }
        }
      />
      {/* Gradient overlay — ensures text is readable over both image and gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex min-h-[360px] flex-col justify-end gap-4 p-8 md:p-12">
        {article.category && (
          <span className="w-fit rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wide text-secondary-foreground">
            {article.category.name}
          </span>
        )}
        <h2 className="max-w-2xl text-2xl font-black leading-tight text-white md:text-4xl">
          {article.title}
        </h2>
        {article.excerpt && (
          <p className="max-w-xl line-clamp-2 text-sm text-white/75">{article.excerpt}</p>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-xs text-white/60">
            {formatDate(article.publishedAt)}
            {article.excerpt && ` · ${estimateReadTime(article.excerpt)} min read`}
          </span>
          <Link
            href={`/articles/${article.slug}`}
            className="rounded-full bg-secondary px-5 py-2 text-sm font-semibold text-secondary-foreground transition hover:brightness-110"
          >
            Read More →
          </Link>
        </div>
      </div>

      {/* Prev / Next arrows */}
      {articles.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous article"
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition hover:bg-black/50"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            aria-label="Next article"
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition hover:bg-black/50"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {articles.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === current ? 'w-6 bg-secondary' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/insights/InsightsHero.tsx
git commit -m "feat: add InsightsHero carousel component"
```

---

## Task 8: Insights page — wire everything together

**Files:**
- Create: `src/app/(frontend)/insights/page.tsx`

- [ ] **Step 1: Create the page**

```typescript
// src/app/(frontend)/insights/page.tsx
import { cache } from 'react'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { InsightsHero } from '@/components/insights/InsightsHero'
import { InsightsFilterBar } from '@/components/insights/InsightsFilterBar'
import { InsightsMasonryGrid } from '@/components/insights/InsightsMasonryGrid'
import { InsightsPagination } from '@/components/insights/InsightsPagination'
import type { InsightArticle } from '@/components/insights/InsightsMasonryGrid'
import { Suspense } from 'react'

const POSTS_PER_PAGE = 9

function buildWhere(categoryId: number | undefined, q: string | undefined): any {
  const conditions: any[] = []
  if (categoryId) conditions.push({ category: { equals: categoryId } })
  if (q) conditions.push({ or: [{ title: { like: q } }, { excerpt: { like: q } }] })
  if (conditions.length === 0) return {}
  if (conditions.length === 1) return conditions[0]
  return { and: conditions }
}

const getCategories = cache(async () => {
  const payload = await getPayload({ config: payloadConfig })
  const result = await payload.find({ collection: 'categories', limit: 100, sort: 'name' })
  return result.docs as Array<{ id: number; name: string; slug: string }>
})

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>
}) {
  const { category, q, page } = await searchParams
  const currentPage = Math.max(1, parseInt(page ?? '1', 10))

  const payload = await getPayload({ config: payloadConfig })
  const categories = await getCategories()

  // Resolve category slug → ID
  const activeCategory = category ? categories.find((c) => c.slug === category) : undefined
  const categoryId = activeCategory?.id

  const articlesWhere = buildWhere(categoryId, q)

  const [articlesResult, heroResult] = await Promise.all([
    payload.find({
      collection: 'articles',
      limit: POSTS_PER_PAGE,
      page: currentPage,
      sort: '-publishedAt',
      depth: 1,
      where: articlesWhere,
    }),
    payload.find({
      collection: 'articles',
      limit: 5,
      sort: '-publishedAt',
      depth: 1,
    }),
  ])

  const articles = articlesResult.docs as unknown as InsightArticle[]
  const heroArticles = heroResult.docs as unknown as InsightArticle[]
  const totalPages = articlesResult.totalPages ?? 1

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-10">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tight text-foreground">Insights</h1>
          <p className="mt-2 text-muted-foreground">
            Thoughts, updates, and stories from the eProd team.
          </p>
        </div>

        {/* Hero carousel */}
        <InsightsHero articles={heroArticles} />

        {/* Search + filter bar — wrapped in Suspense for useSearchParams */}
        <Suspense fallback={<div className="h-20" />}>
          <InsightsFilterBar categories={categories} />
        </Suspense>

        {/* Masonry grid */}
        <InsightsMasonryGrid articles={articles} />

        {/* Pagination */}
        <InsightsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          category={category}
          q={q}
        />
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Start the dev server and verify the page end-to-end**

```bash
npm run dev
```

Open `http://localhost:3000/insights` and verify:

1. Hero carousel renders and auto-advances every 5 seconds
2. Dot indicators and arrows work
3. Category filter pills are visible with the 4 default categories
4. Clicking a category pill updates the URL (`?category=company-news`) and filters the grid
5. Typing in the search box updates the URL (`?q=finance`) after 300 ms and filters the grid
6. Both filters work together (`?category=articles&q=finance`)
7. Pagination appears if there are more than 9 posts; page links work and preserve active filters
8. Clicking an article card navigates to `/articles/[slug]`
9. Empty state renders with "No articles found" + "Clear filters" link when no results match

- [ ] **Step 3: Commit**

```bash
git add src/app/(frontend)/insights/page.tsx
git commit -m "feat: add Insights page — hero, filter bar, masonry grid, pagination"
```

---

## Self-Review Notes

- **Spec coverage:** Categories ✓, WordPress seeder ✓, hero carousel ✓, filter bar ✓, masonry grid ✓, pagination ✓, Navbar link (pre-existing) ✓, article detail (pre-existing) ✓
- **Type consistency:** `InsightArticle` defined once in `InsightsMasonryGrid.tsx` and imported by `InsightsHero` and the page — no duplicate definitions
- **Seeder idempotency:** both seeders (`seed-categories`, `seed-wordpress`) skip existing slugs — safe to re-run
- **Suspense boundary:** `InsightsFilterBar` uses `useSearchParams()` which requires a Suspense boundary in Next.js App Router — added in the page
- **`localized: true` on content:** Payload handles locale automatically at the API level; seeder passes content as-is with `overrideAccess: true` which bypasses locale requirements
