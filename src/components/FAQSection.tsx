'use client'

import { useEffect } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { gaEvents } from '@/lib/ga-events'
import { useInView } from '@/hooks/useInView'
import { CircleBackground } from '@/components/ui/CircleBackground'
import { faqs } from '@/data/faqs'

const FAQSection = () => {
  useEffect(() => {
    gaEvents.viewPage('home_faq', 'faq')
  }, [])

  const { ref: headingRef, inView: headingInView } = useInView({ threshold: 0.25 })
  const { ref: sectionRef, inView: sectionInView } = useInView({ threshold: 0.3 })

  useEffect(() => {
    if (sectionInView) gaEvents.sectionViewed('faq')
  }, [sectionInView])

  return (
    <section className="bg-background py-20 relative" ref={sectionRef}>
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
            Frequently Asked{" "}
            <span className="gradient-primary-text">Questions</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Everything you need to know about eProd and how it transforms agricultural supply chains.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            onValueChange={(value) => {
              if (!value) return
              const idx = parseInt(value.replace('faq-', ''), 10)
              const faq = faqs[idx]
              if (faq) gaEvents.faqOpened(faq.question, 'home')
            }}
          >
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
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
  );
};

export default FAQSection;
