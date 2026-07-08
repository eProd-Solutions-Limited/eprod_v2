'use client'

import { useEffect } from 'react'
import { gaEvents } from '@/lib/ga-events'
import { CircleBackground } from '@/components/ui/CircleBackground'
import { useI18n } from '@/lib/i18n/LanguageProvider'

const AboutHero = () => {
  const { t } = useI18n()

  useEffect(() => {
    gaEvents.viewPage('about_hero', 'hero')
  }, [])

  return (
    <section className="bg-background relative overflow-hidden">
      <CircleBackground />
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-secondary">
            {t.about.hero.eyebrow}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-foreground">
            {t.about.hero.titleLead}{" "}
            <span className="gradient-primary-text">{t.about.hero.titleHighlight}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            {t.about.hero.subtitle}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
