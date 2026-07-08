'use client'

import { useEffect } from 'react'
import { ShieldCheck, Landmark, TrendingUp, Handshake } from "lucide-react";
import { LogoCell } from '@/components/LogoCell'
import type { LogoEntry } from '@/components/LogoCell'
import { gaEvents } from '@/lib/ga-events'
import { useInView } from '@/hooks/useInView'
import { CircleBackground } from '@/components/ui/CircleBackground'
import { useI18n } from '@/lib/i18n/LanguageProvider'

const benefitIcons = [ShieldCheck, Landmark, TrendingUp, Handshake]

const BankPartnershipsSection = ({ bankLogos = [] }: { bankLogos?: LogoEntry[] }) => {
  const { t } = useI18n()
  const benefits = t.bank.benefits.map((b, i) => ({ ...b, icon: benefitIcons[i] }))

  useEffect(() => {
    gaEvents.viewPage('home_bank_partnerships', 'bank_partnerships')
  }, [])

  const { ref: headingRef, inView: headingInView } = useInView({ threshold: 0.25 })
  const { ref: sectionRef, inView: sectionInView } = useInView({ threshold: 0.3 })

  useEffect(() => {
    if (sectionInView) gaEvents.sectionViewed('bank_partnerships')
  }, [sectionInView])

  return (
    <section className="section-gray py-20 relative" ref={sectionRef}>
      <CircleBackground />
      <div className="container mx-auto px-4 relative z-10">
        <div ref={headingRef} className="relative mb-4">
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
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
            {t.bank.headingLead}{" "}
            <span className="gradient-primary-text">{t.bank.headingHighlight}</span>
          </h2>
          <p className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto">
            {t.bank.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition group"
            >
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                <b.icon size={24} className="text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.text}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-muted-foreground mb-6 font-medium uppercase tracking-wider">
            {t.bank.trustedBy}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {bankLogos.map((logo) => (
              <div
                key={logo.id ?? logo.name}
                className="px-6 py-3 rounded-lg bg-card flex items-center justify-center opacity-60 hover:opacity-100 transition"
              >
                <LogoCell logo={logo} textClassName="text-sm font-semibold text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 max-w-2xl mx-auto bg-card border border-secondary/30 rounded-xl p-8 text-center">
          <p className="text-lg font-bold text-foreground mb-2">
            {t.bank.quote}
          </p>
          <p className="text-sm text-muted-foreground">
            {t.bank.quoteAuthor}
          </p>
        </div>
      </div>
    </section>
  );
};

export default BankPartnershipsSection;
