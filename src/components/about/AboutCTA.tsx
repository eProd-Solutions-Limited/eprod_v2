'use client'

import { useEffect } from 'react'
import { ArrowRight } from "lucide-react";
import { gaEvents } from '@/lib/ga-events'
import { CircleBackground } from '@/components/ui/CircleBackground'
import { useI18n } from '@/lib/i18n/LanguageProvider'

const AboutCTA = () => {
  const { t } = useI18n()

  useEffect(() => {
    gaEvents.viewPage('about_cta', 'call_to_action')
  }, [])

  return (
    <section className="gradient-primary py-20 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-16 z-1"
        aria-hidden="true"
        style={{ backgroundColor: 'hsl(210 20% 91%)', borderRadius: '0 0 0 60px' }}
      />
      <CircleBackground variant="dark" />
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
          {t.about.cta.heading}
        </h2>
        <p className="text-primary-foreground/70 text-base max-w-2xl mx-auto mb-8">
          {t.about.cta.subtitle}
        </p>
        <a
          href="#cta"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-8 py-3.5 text-base font-bold text-secondary-foreground hover:brightness-110 transition shadow-lg"
        >
          {t.about.cta.button}
          <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
};

export default AboutCTA;
