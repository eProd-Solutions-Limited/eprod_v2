'use client'

import { useEffect } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { gaEvents } from '@/lib/ga-events'

const faqs = [
  {
    question: 'What makes eProd different from other agricultural software?',
    answer:
      'eProd combines supply chain digitization with AgFinTech capabilities, enabling both compliance and financial inclusion.',
  },
  {
    question: 'Which compliance standards does eProd support?',
    answer:
      'EUDR, Organic, Fairtrade, Rainforest Alliance, GlobalG.A.P., and national traceability frameworks.',
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
    <section className="section-gray py-20">
      <div className="container mx-auto px-4">
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

          <Accordion type="single" collapsible className="w-full">
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
