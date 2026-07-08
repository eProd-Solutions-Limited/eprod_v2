'use client'

import type { LogoEntry } from '@/components/LogoCell'
import { LogoCell } from '@/components/LogoCell'
import { CircleBackground } from '@/components/ui/CircleBackground'
import { SectionScoop } from '@/components/ui/SectionScoop'
import { useInView } from '@/hooks/useInView'
import { gaEvents } from '@/lib/ga-events'
import { useI18n } from '@/lib/i18n/LanguageProvider'
import Image from 'next/image'
import { useEffect } from 'react'

import supplyChainImage from '@/assets/farm_to_market_digitalized_shaded.png'
import financeImage from '@/assets/Farmer- Client exchange.png'
import traceabilityImage from '@/assets/Traceability & Compliance 2.png'

const columnImages = [traceabilityImage, financeImage, supplyChainImage]
const columnAccents = ['bg-primary', 'bg-secondary', 'bg-primary'] as const
const columnEyebrowColors = ['text-primary', 'text-secondary', 'text-primary'] as const

const ProofSection = ({ agribusinessLogos = [] }: { agribusinessLogos?: LogoEntry[] }) => {
  const { t } = useI18n()
  const impactMetrics = t.proof.metrics

  useEffect(() => {
    gaEvents.viewPage('home_proof', 'proof')
  }, [])

  const { ref: headingRef, inView: headingInView } = useInView({ threshold: 0.25 })
  const { ref: sectionRef, inView: sectionInView } = useInView({ threshold: 0.3 })

  useEffect(() => {
    if (sectionInView) gaEvents.sectionViewed('proof')
  }, [sectionInView])

  return (
    <>
      {/* ── Trust & Metrics ──────────────────────────────────────────────────── */}
      <section className="section-gray py-20 relative" ref={sectionRef}>
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
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-14">
              {t.proof.headingLead}{' '}
              <span className="gradient-primary-text">{t.proof.headingHighlight}</span>{' '}
              {t.proof.headingTrail}
            </h2>
          </div>

          {/* Impact Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto mb-16">
            {impactMetrics.map((m) => (
              <div
                key={m.label}
                className="text-center bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="text-2xl md:text-3xl font-black text-primary leading-tight">
                  {m.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1.5 leading-snug">{m.label}</div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mb-6">
            {t.proof.trustedLine}
          </p>
          {agribusinessLogos.length > 0 && (
            <div
              className="overflow-hidden"
              style={{
                maskImage:
                  'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
              }}
            >
              <div
                className="flex items-center"
                style={{
                  animation: 'marquee 30s linear infinite',
                  width: 'max-content',
                }}
              >
                {[...agribusinessLogos, ...agribusinessLogos].map((logo, i) => (
                  <div
                    key={`${logo.id ?? logo.name}-${i}`}
                    className="flex items-center justify-center mx-10 opacity-60 hover:opacity-100 transition-opacity duration-300"
                  >
                    <LogoCell
                      logo={{
                        ...logo,
                        image: logo.image
                          ? {
                              ...logo.image,
                              width: (logo.image.width ?? 120) * 1.5,
                              height: (logo.image.height ?? 60) * 1.5,
                            }
                          : undefined,
                      }}
                      textClassName="text-base font-bold text-muted-foreground"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      {/* gray → white internal transition */}
      <SectionScoop direction="left" fromBg="hsl(210 20% 91%)" nextBg="hsl(0 0% 100%)" />

      {/* ── Value Proposition — Layout E (minimal type-first) ───────────────── */}
      <section className="bg-background py-20 relative">
        <CircleBackground />
        <div className="container mx-auto px-4 relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t.proof.valuePropHeadingLead}{' '}
              <span className="gradient-primary-text">{t.proof.valuePropHeadingHighlight}</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-base">
              {t.proof.valuePropSubtitle}
            </p>
          </div>

          {/* 3-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
            {t.proof.columns.map((col, i) => (
              <div key={col.title} className="flex flex-col">
                <p
                  className={`text-xs font-bold uppercase tracking-widest ${columnEyebrowColors[i]} mb-4`}
                >
                  {col.eyebrow}
                </p>
                <h3 className="text-xl font-extrabold text-foreground leading-snug mb-3">
                  {col.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{col.text}</p>
                <ul className="space-y-2.5 mb-6">
                  {col.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${columnAccents[i]} flex-shrink-0`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="border-t border-border pt-6 mt-auto">
                  <div className="relative aspect-[3/2] rounded-xl overflow-hidden border border-border">
                    <Image
                      src={columnImages[i]}
                      alt={col.eyebrow}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default ProofSection
