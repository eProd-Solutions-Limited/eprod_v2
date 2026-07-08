'use client'

import { useEffect } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { gaEvents } from '@/lib/ga-events'
import { CircleBackground } from '@/components/ui/CircleBackground'
import { useI18n } from '@/lib/i18n/LanguageProvider'

const AboutFAQ = () => {
  const { t } = useI18n()
  const faqs = t.about.faq.items

  useEffect(() => {
    gaEvents.viewPage('about_faq', 'faq')
  }, [])

  return (
    <section className="section-gray py-20 relative overflow-hidden">
      <CircleBackground />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-secondary mb-4 text-center">
            {t.about.faq.eyebrow}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
            {t.about.faq.headingLead}{' '}
            <span className="gradient-primary-text">{t.about.faq.headingHighlight}</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            {t.about.faq.subtitle}
          </p>

          <Accordion
            type="single"
            collapsible
            className="w-full"
            onValueChange={(value) => {
              if (!value) return
              const idx = parseInt(value.replace('about-faq-', ''), 10)
              const faq = faqs[idx]
              if (faq) gaEvents.faqOpened(faq.question, 'about')
            }}
          >
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`about-faq-${index}`}>
                <AccordionTrigger className="text-left text-foreground font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

export default AboutFAQ
