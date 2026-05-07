import { Suspense, cache } from 'react'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { InsightsHero } from '@/components/insights/InsightsHero'
import { InsightsFilterBar } from '@/components/insights/InsightsFilterBar'
import { InsightsMasonryGrid } from '@/components/insights/InsightsMasonryGrid'
import { InsightsPagination } from '@/components/insights/InsightsPagination'
import type { InsightArticle } from '@/components/insights/InsightsMasonryGrid'

const PAGE_SIZE = 12

const getCategories = cache(async () => {
  const payload = await getPayload({ config: payloadConfig })
  const result = await payload.find({ collection: 'categories', limit: 100 })
  return result.docs as { id: number; name: string; slug: string }[]
})

function buildWhere(categoryId?: number, q?: string) {
  const conditions: object[] = []
  if (categoryId) conditions.push({ category: { equals: categoryId } })
  if (q) conditions.push({ or: [{ title: { like: q } }, { excerpt: { like: q } }] })
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

  const payload = await getPayload({ config: payloadConfig })
  const categories = await getCategories()

  const matchedCategory = category ? categories.find((c) => c.slug === category) : null
  const categoryId = matchedCategory?.id

  const where = buildWhere(categoryId, q || undefined)

  const [heroResult, gridResult] = await Promise.all([
    payload.find({
      collection: 'articles',
      sort: '-publishedAt',
      limit: 5,
      depth: 1,
    }),
    payload.find({
      collection: 'articles',
      sort: '-publishedAt',
      where,
      limit: PAGE_SIZE,
      page: currentPage,
      depth: 1,
    }),
  ])

  const heroArticles = heroResult.docs.map(toArticle)
  const gridArticles = gridResult.docs.map(toArticle)
  const totalPages = gridResult.totalPages

  return (
    <main className="container mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-black text-foreground">Insights</h1>

      <InsightsHero articles={heroArticles} />

      <Suspense fallback={<div className="h-16" />}>
        <InsightsFilterBar categories={categories} />
      </Suspense>

      <InsightsMasonryGrid articles={gridArticles} />

      <InsightsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        category={category || undefined}
        q={q || undefined}
      />
    </main>
  )
}
