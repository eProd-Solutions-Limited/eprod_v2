'use client'

import { LogoCell } from '@/components/LogoCell'
import type { LogoEntry } from '@/components/LogoCell'
import { CircleBackground } from '@/components/ui/CircleBackground'
import { useI18n } from '@/lib/i18n/LanguageProvider'

interface LogoWallProps {
  agribusinessLogos: LogoEntry[]
  bankLogos: LogoEntry[]
}

export function LogoWall({ agribusinessLogos, bankLogos }: LogoWallProps) {
  const { t } = useI18n()
  return (
    <section className="section-gray relative overflow-hidden py-20">
      <CircleBackground />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">
            {t.caseStudies.logoWall.eyebrow}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
            {t.caseStudies.logoWall.headingLead}{' '}
            <span className="gradient-primary-text">{t.caseStudies.logoWall.headingHighlight}</span>{' '}
            {t.caseStudies.logoWall.headingTrail}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <div className="bg-card rounded-2xl p-8 border border-border">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-foreground mt-2 mb-1">{t.caseStudies.logoWall.agriTitle}</h3>
              <p className="text-sm text-muted-foreground">
                {t.caseStudies.logoWall.agriText}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {agribusinessLogos.map((logo) => (
                <div
                  key={logo.id ?? logo.name}
                  className="h-20 flex items-center justify-center px-3 text-center"
                >
                  <LogoCell logo={logo} textClassName="text-xs font-bold text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl p-8 border border-border">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-foreground mt-2 mb-1">{t.caseStudies.logoWall.bankTitle}</h3>
              <p className="text-sm text-muted-foreground">
                {t.caseStudies.logoWall.bankText}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {bankLogos.map((logo) => (
                <div
                  key={logo.id ?? logo.name}
                  className="h-20 flex items-center justify-center px-3 text-center"
                >
                  <LogoCell logo={logo} textClassName="text-xs font-bold text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
