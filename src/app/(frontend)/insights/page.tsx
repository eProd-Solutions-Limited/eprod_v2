export const dynamic = 'force-dynamic'

import { Suspense, cache } from 'react'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { InsightsHero } from '@/components/insights/InsightsHero'
import { InsightsFilterBar } from '@/components/insights/InsightsFilterBar'
import { InsightsMasonryGrid } from '@/components/insights/InsightsMasonryGrid'
import { InsightsPagination } from '@/components/insights/InsightsPagination'
import type { InsightArticle } from '@/components/insights/InsightsMasonryGrid'
import type { Where } from 'payload'

const PAGE_SIZE = 12

const getCategories = cache(async () => {
  const payload = await getPayload({ config: payloadConfig })
  const result = await payload.find({ collection: 'categories', limit: 100 })
  return result.docs as { id: number; name: string; slug: string }[]
})

const getHeroArticles = cache(async () => {
  const payload = await getPayload({ config: payloadConfig })
  const result = await payload.find({
    collection: 'articles',
    sort: '-publishedAt',
    limit: 5,
    depth: 1,
  })
  return result.docs
})

function buildWhere(categoryId?: number, q?: string): Where {
  const conditions: Where[] = []
  if (categoryId) conditions.push({ category: { equals: categoryId } })
  if (q) conditions.push({ or: [{ title: { contains: q } }, { excerpt: { contains: q } }] })
  return conditions.length ? { and: conditions } : {}
}

function toArticle(doc: any): InsightArticle {
  return {
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt ?? null,
    publishedAt: doc.publishedAt ?? null,
    coverImage: doc.coverImage?.url
      ? { url: doc.coverImage.url, width: doc.coverImage.width, height: doc.coverImage.height }
      : null,
    category: doc.category?.id
      ? { id: doc.category.id, name: doc.category.name, slug: doc.category.slug }
      : null,
  }
}

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>
}) {
  const { category = '', q = '', page: pageParam = '1' } = await searchParams
  const currentPage = Math.max(1, parseInt(pageParam, 10) || 1)
  const safeQ = q.trim().slice(0, 200)

  const payload = await getPayload({ config: payloadConfig })
  const categories = await getCategories()

  const matchedCategory = category ? categories.find((c) => c.slug === category) : null
  const categoryId = matchedCategory?.id

  const where = buildWhere(categoryId, safeQ || undefined)

  const [heroDocs, gridResult] = await Promise.all([
    getHeroArticles(),
    payload.find({
      collection: 'articles',
      sort: '-publishedAt',
      where,
      limit: PAGE_SIZE,
      page: currentPage,
      depth: 1,
    }),
  ])

  const heroArticles = heroDocs.map(toArticle)
  const gridArticles = gridResult.docs.map(toArticle)
  const totalPages = gridResult.totalPages

  return (
    <main className="min-h-screen">
      <section className="bg-background py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">
              Knowledge Hub
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-5">
              Insights &{' '}
              <span className="gradient-primary-text">Expert Analysis</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Trends, deep-dives, and practical guides from the intersection of agriculture,
              finance, and technology.
            </p>
          </div>
          <InsightsHero articles={heroArticles} />
        </div>
      </section>

      <section className="section-gray py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <Suspense fallback={<div className="h-16" />}>
            <InsightsFilterBar categories={categories} />
          </Suspense>
          <InsightsMasonryGrid articles={gridArticles} />
          <InsightsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            category={category || undefined}
            q={safeQ || undefined}
          />
        </div>
      </section>
    </main>
  )
}
