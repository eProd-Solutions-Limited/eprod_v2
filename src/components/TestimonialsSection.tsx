'use client'

import { useEffect } from 'react'
import { gaEvents } from '@/lib/ga-events'

const testimonials = [
  {
    quote: "We scaled from 500 to 2,000 farmers in 6 months with the same team.",
    name: "Joseph Kadendula",
    title: "CEO, Swahili Honey",
    result: "Revenue grew 40%. Costs stayed flat.",
    challenge: "Scalability",
  },
];

const TestimonialsSection = () => {
  useEffect(() => {
    gaEvents.viewPage('home_testimonials', 'testimonials')
  }, [])

  return (
    <section className="section-gray py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-14">
          Real Results from <span className="gradient-primary-text">Real Customers</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-card rounded-xl p-8 shadow-sm border border-border flex flex-col">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider mb-4">{t.challenge}</span>
              <blockquote className="text-foreground italic leading-relaxed mb-6 flex-1">
                "{t.quote}"
              </blockquote>
              <div className="mb-4">
                <div className="font-bold text-foreground text-sm">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.title}</div>
              </div>
              <div className="rounded-lg bg-primary/5 border border-primary/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="text-sm font-semibold text-primary">{t.result}</span>
                </div>
              </div>
            </div>
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
