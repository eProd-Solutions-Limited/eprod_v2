'use client'

import { useEffect } from 'react'
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

const TestimonialsSection = ({ quotes }: Props) => {
  useEffect(() => {
    gaEvents.viewPage('home_testimonials', 'testimonials')
  }, [])

  if (!quotes.length) return null

  return (
    <section className="section-gray py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-14">
          Real Results from <span className="gradient-primary-text">Real Customers</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {quotes.map((q) => (
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

        <div className="text-center">
          <a href="/case-studies" className="text-primary font-semibold hover:underline text-sm">
            See more customer stories →
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
