'use client'

import { useState } from 'react'
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { CircleBackground } from '@/components/ui/CircleBackground'
import { useI18n } from '@/lib/i18n/LanguageProvider'

interface QuoteEntry {
  id?: string | number
  quote: string
  name: string
  role: string
  tag: string
}

interface VoiceOfCustomerProps {
  quotes: QuoteEntry[]
}

const CARDS_PER_PAGE = 3

export function VoiceOfCustomer({ quotes }: VoiceOfCustomerProps) {
  const { t } = useI18n()
  const totalPages = Math.ceil(quotes.length / CARDS_PER_PAGE)
  const [page, setPage] = useState(0)

  const visible = quotes.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE)

  return (
    <section className="section-gray relative overflow-hidden py-20">
      <CircleBackground />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">
            {t.caseStudies.voice.eyebrow}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
            {t.caseStudies.voice.headingLead} <span className="gradient-primary-text">{t.caseStudies.voice.headingHighlight}</span>
          </h2>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 min-h-80">
            {visible.map((q) => (
              <figure
                key={q.id ?? q.name}
                className="relative bg-card rounded-2xl p-8 border border-border hover:shadow-xl transition flex flex-col"
              >
                <Quote size={32} className="text-secondary mb-4" />
                <blockquote className="text-foreground leading-relaxed mb-6 flex-1 italic">
                  &ldquo;{q.quote}&rdquo;
                </blockquote>
                <figcaption className="pt-5 border-t border-border">
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
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                aria-label="Previous page"
                className="p-2 rounded-full border border-border bg-card hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    aria-label={`Go to page ${i + 1}`}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === page ? 'bg-secondary w-6' : 'bg-border hover:bg-muted-foreground'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                aria-label="Next page"
                className="p-2 rounded-full border border-border bg-card hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
