'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { gaEvents } from '@/lib/ga-events'
import { CircleBackground } from '@/components/ui/CircleBackground'
import { useI18n } from '@/lib/i18n/LanguageProvider'

const SectorsFAQ = () => {
  const { t } = useI18n()
  const faqs = t.sectors.faq.items
  return (
  <section className="section-gray py-20 relative overflow-hidden" aria-labelledby="faq-heading">
    <CircleBackground />
    <div className="container mx-auto px-4 relative z-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">{t.sectors.faq.eyebrow}</p>
          <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold text-foreground">
            {t.sectors.faq.heading}
          </h2>
        </div>

        <Accordion
          type="single"
          collapsible
          className="w-full"
          onValueChange={(value) => {
            if (!value) return
            const idx = parseInt(value.replace('sectors-faq-', ''), 10)
            const faq = faqs[idx]
            if (faq) gaEvents.faqOpened(faq.q, 'sectors')
          }}
        >
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`sectors-faq-${i}`}>
              <AccordionTrigger className="text-left text-foreground font-semibold">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </section>
  )
}

export default SectorsFAQ
