'use client'

import { ArrowRight, Users, Globe2, Building2 } from 'lucide-react'
import { CaseStudiesHeroCarousel } from './CaseStudiesHeroCarousel'
import { CircleBackground } from '@/components/ui/CircleBackground'
import { useI18n } from '@/lib/i18n/LanguageProvider'

type HeroImage = { url: string; alt: string }

export function CaseStudiesHeroContent({ images }: { images: HeroImage[] }) {
  const { t } = useI18n()

  const stats = [
    { icon: Building2, label: t.caseStudies.hero.stats[0], value: '250+' },
    { icon: Users, label: t.caseStudies.hero.stats[1], value: '1M+' },
    { icon: Globe2, label: t.caseStudies.hero.stats[2], value: '20+' },
  ]

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0">
        <CaseStudiesHeroCarousel images={images} />
        <div className="absolute inset-0 gradient-primary opacity-30" />
      </div>
      <CircleBackground variant="dark" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 z-1"
        aria-hidden="true"
        style={{ backgroundColor: 'hsl(210 20% 91%)', borderRadius: '60px 0 0 0' }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 mb-6">
            <Building2 size={16} className="text-secondary" />
            <span className="text-sm font-medium text-primary-foreground">{t.caseStudies.hero.badge}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-primary-foreground leading-tight mb-6">
            {t.caseStudies.hero.titleLead} <span className="text-secondary">{t.caseStudies.hero.titleHighlight}</span> {t.caseStudies.hero.titleTrail}
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed mb-10 max-w-3xl">
            {t.caseStudies.hero.subtitle}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-3xl">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur px-4 py-3"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <stat.icon size={18} className="text-secondary" />
                </div>
                <div>
                  <div className="text-xl font-black text-primary-foreground leading-none">{stat.value}</div>
                  <div className="text-xs text-primary-foreground/70 mt-1">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          <a
            href="#impact-grid"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-7 py-3.5 text-base font-semibold text-secondary-foreground hover:brightness-110 transition shadow-lg"
          >
            {t.caseStudies.hero.cta}
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  )
}
