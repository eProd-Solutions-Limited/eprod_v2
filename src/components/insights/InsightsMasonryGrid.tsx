'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n/LanguageProvider'

export interface InsightArticle {
  id: number
  title: string
  slug: string
  excerpt?: string | null
  publishedAt?: string | null
  coverImage?: { url: string; width?: number; height?: number } | null
  category?: { id: number; name: string; slug: string } | null
}

function formatDate(iso: string | null | undefined, locale: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })
}

function ArticleCard({ article }: { article: InsightArticle }) {
  const { t, lang } = useI18n()
  const locale = lang === 'fr' ? 'fr-FR' : 'en-GB'
  const hasCover = !!article.coverImage?.url

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-16/10 overflow-hidden bg-primary/10">
        {hasCover ? (
          <Image
            src={article.coverImage!.url}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 gradient-primary" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-primary/60 via-transparent to-transparent" />
        {article.category && (
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-secondary text-xs font-bold text-secondary-foreground uppercase tracking-wider">
            {article.category.name}
          </span>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1 gap-3">
        <h3 className="text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed flex-1">
            {article.excerpt}
          </p>
        )}
        <div className="flex items-center mt-auto pt-2">
          {article.publishedAt && (
            <time className="text-xs text-muted-foreground">{formatDate(article.publishedAt, locale)}</time>
          )}
          <span className="inline-flex items-center gap-1 text-sm font-bold text-primary group-hover:gap-2 transition-all ml-auto">
            {t.insights.grid.readArticle} <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  )
}

interface InsightsMasonryGridProps {
  articles: InsightArticle[]
}

export function InsightsMasonryGrid({ articles }: InsightsMasonryGridProps) {
  const { t } = useI18n()
  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-muted-foreground">{t.insights.grid.noArticles}</p>
        <Link href="/insights" className="text-sm font-medium text-primary underline underline-offset-4">
          {t.insights.grid.clearFilters}
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  )
}
