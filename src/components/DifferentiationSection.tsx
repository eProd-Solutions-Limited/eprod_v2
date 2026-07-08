'use client'

import { useEffect } from 'react'
import { Globe, Smartphone, Tag, Trophy, Check, X } from "lucide-react";
import { gaEvents } from '@/lib/ga-events'
import { useInView } from '@/hooks/useInView'
import { CircleBackground } from '@/components/ui/CircleBackground'
import { useI18n } from '@/lib/i18n/LanguageProvider'

const differentiatorIcons = [Globe, Smartphone, Tag, Trophy]

// eprod / enterprise / generic support flags (language-independent)
const comparisonFlags = [
  { eprod: true, enterprise: true, generic: false },
  { eprod: true, enterprise: false, generic: true },
  { eprod: true, enterprise: false, generic: false },
  { eprod: true, enterprise: false, generic: true },
  { eprod: true, enterprise: false, generic: false },
]

const DifferentiationSection = () => {
  const { t } = useI18n()
  const differentiators = t.differentiation.items.map((d, i) => ({
    ...d,
    icon: differentiatorIcons[i],
  }))
  const comparisonRows = t.differentiation.rows.map((feature, i) => ({
    feature,
    ...comparisonFlags[i],
  }))

  useEffect(() => {
    gaEvents.viewPage('home_differentiation', 'differentiation')
  }, [])

  const { ref: headingRef, inView: headingInView } = useInView({ threshold: 0.25 })
  const { ref: sectionRef, inView: sectionInView } = useInView({ threshold: 0.3 })

  useEffect(() => {
    if (sectionInView) gaEvents.sectionViewed('differentiation')
  }, [sectionInView])

  return (
    <section className="bg-background py-20 relative overflow-hidden" ref={sectionRef}>
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
            {t.differentiation.headingLead} <span className="gradient-primary-text">{t.differentiation.headingHighlight}</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {differentiators.map((d) => (
            <div key={d.title} className="text-center p-6">
              <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                <d.icon size={24} className="text-primary-foreground" />
              </div>
              <h3 className="font-bold text-foreground mb-2 text-sm md:text-base">{d.title}</h3>
              <p className="text-sm text-muted-foreground">{d.text}</p>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="max-w-3xl mx-auto overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">{t.differentiation.tableFeature}</th>
                <th className="text-center py-3 px-4 font-bold text-primary-foreground gradient-primary rounded-t-lg">eProd</th>
                <th className="text-center py-3 px-4 font-semibold text-muted-foreground">{t.differentiation.tableEnterprise}</th>
                <th className="text-center py-3 px-4 font-semibold text-muted-foreground">{t.differentiation.tableGeneric}</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="border-b border-border">
                  <td className="py-3 px-4 font-medium text-foreground">{row.feature}</td>
                  <td className="py-3 px-4 text-center bg-primary-lighter">
                    {row.eprod ? <Check size={18} className="text-primary inline" /> : <X size={18} className="text-destructive inline" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.enterprise ? <Check size={18} className="text-primary inline" /> : <X size={18} className="text-destructive inline" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.generic ? <Check size={18} className="text-primary inline" /> : <X size={18} className="text-destructive inline" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default DifferentiationSection;
