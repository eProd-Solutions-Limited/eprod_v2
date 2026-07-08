'use client'

import { useEffect, useState, useCallback } from 'react'
import { Quote } from 'lucide-react'
import { gaEvents } from '@/lib/ga-events'
import { useInView } from '@/hooks/useInView'
import { CircleBackground } from '@/components/ui/CircleBackground'
import { useI18n } from '@/lib/i18n/LanguageProvider'

interface QuoteEntry {
  id?: string | number
  quote: string
  name: string
  role: string
  tag: string
}

interface Props {
  quotes: QuoteEntry[]
}

const CARDS_PER_PAGE = 3
const INTERVAL_MS = 4000

const TestimonialsSection = ({ quotes }: Props) => {
  const { t } = useI18n()
  const [page, setPage] = useState(0)
  const [paused, setPaused] = useState(false)

  const totalPages = Math.ceil(quotes.length / CARDS_PER_PAGE)

  const advance = useCallback(() => {
    setPage((p) => (p + 1) % totalPages)
  }, [totalPages])

  useEffect(() => {
    gaEvents.viewPage('home_testimonials', 'testimonials')
  }, [])

  useEffect(() => {
    if (paused || totalPages <= 1) return
    const id = setInterval(advance, INTERVAL_MS)
    return () => clearInterval(id)
  }, [paused, advance, totalPages])

  const { ref: headingRef, inView: headingInView } = useInView({ threshold: 0.25 })
  const { ref: sectionRef, inView: sectionInView } = useInView({ threshold: 0.3 })

  useEffect(() => {
    if (sectionInView) gaEvents.sectionViewed('testimonials')
  }, [sectionInView])

  if (!quotes.length) return null

  const visible = quotes.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE)

  return (
    <section
      className="section-gray py-20 relative"
      ref={sectionRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <CircleBackground />
      <div className="container mx-auto px-4 relative z-10">
        <div ref={headingRef} className="relative mb-14">
          <div
            className={`pointer-events-none absolute left-6 top-0 h-9 w-9 rounded-full border border-primary/20 circle-reveal${headingInView ? ' is-visible' : ''}`}
            style={{ transitionDelay: '0ms' }}
            aria-hidden="true"
          />
          <div
            className={`pointer-events-none absolute left-2 -top-2 h-14 w-14 rounded-full border border-primary/15 circle-reveal${headingInView ? ' is-visible' : ''}`}
            style={{ transitionDelay: '150ms' }}
            aria-hidden="true"
          />
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground">
            {t.testimonials.headingLead} <span className="gradient-primary-text">{t.testimonials.headingHighlight}</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-10 min-h-64">
          {visible.map((q) => (
            <figure
              key={q.id ?? q.name}
              className="bg-card rounded-xl p-8 shadow-sm border border-border flex flex-col"
            >
              <Quote size={28} className="text-secondary mb-4" />
              <blockquote className="text-foreground italic leading-relaxed mb-6 flex-1">
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              <figcaption className="pt-4 border-t border-border">
                <div className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                  {q.tag}
                </div>
                <div className="font-bold text-foreground text-sm">{q.name}</div>
                <div className="text-xs text-muted-foreground">{q.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                aria-label={`Go to page ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === page ? 'w-6 bg-secondary' : 'w-2 bg-border hover:bg-muted-foreground'
                }`}
              />
            ))}
          </div>
        )}

        <div className="text-center">
          <a href="/case-studies" className="text-primary font-semibold hover:underline text-sm">
            {t.testimonials.seeMore}
          </a>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
