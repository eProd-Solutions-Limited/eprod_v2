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

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (paused || articles.length <= 1 || prefersReducedMotion) return
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % articles.length)
    }, 5000)
    return () => clearInterval(id)
  }, [paused, articles.length, prefersReducedMotion])

  useEffect(() => {
    if (current >= articles.length) setCurrent(0)
  }, [articles.length, current])

  if (articles.length === 0) return null

  const article = articles[current]
  const coverUrl = article.coverImage?.url ?? null

  function prev() {
    setCurrent((c) => (c - 1 + articles.length) % articles.length)
  }

  function next() {
    setCurrent((c) => (c + 1) % articles.length)
  }

  return (
    <section
      className="relative w-full overflow-hidden rounded-2xl"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured insights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={
          coverUrl
            ? { backgroundImage: `url("${coverUrl.replace(/"/g, '\\"')}")`, backgroundSize: 'cover', backgroundPosition: 'center' }
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
            Read More <span aria-hidden="true">→</span>
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
                key={articles[i].id}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === current ? true : undefined}
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
