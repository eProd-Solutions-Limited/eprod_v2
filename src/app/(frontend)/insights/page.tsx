import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload-client'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Insights',
  description:
    'Articles, reports, and analysis on agribusiness, cooperative management, agri-fintech, and smallholder farming across Africa from the eProd team.',
  openGraph: {
    title: 'eProd Insights — Agribusiness Knowledge for Africa',
    description:
      'Articles, reports, and analysis on agribusiness, cooperative management, agri-fintech, and smallholder farming across Africa from the eProd team.',
    type: 'website',
    url: '/insights',
  },
  alternates: { canonical: '/insights' },
}

import { Suspense, cache } from 'react'
import { InsightsHero } from '@/components/insights/InsightsHero'
import { InsightsHeader } from '@/components/insights/InsightsHeader'
import { InsightsFilterBar } from '@/components/insights/InsightsFilterBar'
import { InsightsMasonryGrid } from '@/components/insights/InsightsMasonryGrid'
import { InsightsPagination } from '@/components/insights/InsightsPagination'
import type { InsightArticle } from '@/components/insights/InsightsMasonryGrid'
import type { Where } from 'payload'
import { CircleBackground } from '@/components/ui/CircleBackground'
import { SectionScoop } from '@/components/ui/SectionScoop'

const PAGE_SIZE = 12

const getCategories = cache(async () => {
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: 'categories', limit: 100 })
  return result.docs as { id: number; name: string; slug: string }[]
})

const getHeroArticles = cache(async () => {
  const payload = await getPayloadClient()
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

  const payload = await getPayloadClient()
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

  const BG_WHITE = 'hsl(0 0% 100%)'
  const BG_GRAY  = 'hsl(210 20% 91%)'

  return (
    <main className="min-h-screen">
      <section className="bg-background py-20 relative overflow-hidden">
        <CircleBackground />
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <InsightsHeader />
          <InsightsHero articles={heroArticles} />
        </div>
      </section>
      <SectionScoop direction="right" fromBg={BG_WHITE} nextBg={BG_GRAY} />
      <section className="section-gray py-20 relative overflow-hidden">
        <CircleBackground />
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
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
