'use client'

import { useI18n } from '@/lib/i18n/LanguageProvider'

export function InsightsHeader() {
  const { t } = useI18n()
  return (
    <div className="max-w-3xl mx-auto text-center mb-12">
      <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">
        {t.insights.header.eyebrow}
      </p>
      <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-5">
        {t.insights.header.headingLead}{' '}
        <span className="gradient-primary-text">{t.insights.header.headingHighlight}</span>
      </h1>
      <p className="text-lg text-muted-foreground">{t.insights.header.subtitle}</p>
    </div>
  )
}
