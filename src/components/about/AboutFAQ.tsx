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

const faqs = [
  {
    question: 'What makes eProd different from other agricultural software?',
    answer:
      'eProd combines supply chain digitization with AgFinTech capabilities, enabling both compliance and financial inclusion.',
  },
  {
    question: 'Which compliance standards does eProd support?',
    answer:
      'EUDR, Organic, Fairtrade, GlobalG.A.P., and national traceability frameworks.',
  },
  {
    question: 'Is eProd suitable for large and small agribusinesses?',
    answer: 'Yes. eProd scales from small cooperatives to multinational exporters.',
  },
]

const AboutFAQ = () => {
  useEffect(() => {
    gaEvents.viewPage('about_faq', 'faq')
  }, [])

  return (
    <section className="section-gray py-20 relative overflow-hidden">
      <CircleBackground />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-secondary mb-4 text-center">
            FAQ
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
            Frequently Asked{' '}
            <span className="gradient-primary-text">Questions</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Common questions about eProd's platform, compliance coverage, and scale.
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
