'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { gaEvents } from '@/lib/ga-events'
import { CircleBackground } from '@/components/ui/CircleBackground'

const faqs = [
  {
    q: 'Does eProd support multi-value chain operations?',
    a: 'Yes. Manage multiple commodities within one unified system.',
  },
  {
    q: 'Can eProd handle certification audits?',
    a: 'Yes. The platform stores all required data for Organic, Fairtrade and EUDR audits.',
  },
]

const SectorsFAQ = () => (
  <section className="section-gray py-20 relative overflow-hidden" aria-labelledby="faq-heading">
    <CircleBackground />
    <div className="container mx-auto px-4 relative z-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">FAQ</p>
          <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold text-foreground">
            Frequently Asked Questions
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

export default SectorsFAQ
