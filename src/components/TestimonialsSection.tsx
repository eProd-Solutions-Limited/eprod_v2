'use client'

import { useEffect, useState, useCallback } from 'react'
import { Quote } from 'lucide-react'
import { gaEvents } from '@/lib/ga-events'

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

  if (!quotes.length) return null

  const visible = quotes.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE)

  return (
    <section
      className="section-gray py-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-14">
          Real Results from <span className="gradient-primary-text">Real Customers</span>
        </h2>

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
            See more customer stories →
          </a>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
