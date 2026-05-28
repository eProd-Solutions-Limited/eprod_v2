'use client'

import { useEffect } from 'react'
import { ArrowRight } from "lucide-react"
import heroImage from "@/assets/Homepage image.jpg.jpeg"
import Image from "next/image"
import { gaEvents } from '@/lib/ga-events'
import { useInView } from '@/hooks/useInView'
import { CircleBackground } from '@/components/ui/CircleBackground'

const HeroSection = () => {
  useEffect(() => {
    gaEvents.viewPage('home_hero', 'hero')
  }, [])

  const { ref: headingRef, inView: headingInView } = useInView({ threshold: 0.25 })

  return (
    <section id="home" className="bg-background relative">
      <CircleBackground />
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {/* Ring accent on heading — reveals when heading enters viewport */}
            <div ref={headingRef} className="relative">
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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-foreground">
                De-Risk Your Supply Chain.{" "}
                <span className="gradient-primary-text">Unlock Your Capital.</span>
              </h1>
            </div>
            <h2 className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              eProd helps agribusinesses manage 1,000+ farmers, ensure traceability, de-risk lending for financial partners, and reduce waste—all in one affordable platform.
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="#cta"
                className="inline-flex items-center justify-center gap-2 rounded-full gradient-primary px-8 py-3.5 text-base font-semibold text-primary-foreground hover:brightness-110 transition shadow-lg"
              >
                Request a Demo
                <ArrowRight size={18} />
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={heroImage}
                alt="African farmer using mobile technology in a green agricultural field with digital data overlays"
                className="w-full h-auto object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                placeholder="blur"
                priority
              />
            </div>
            {/* Subtle ring outline around the image */}
            <div
              className="pointer-events-none absolute -inset-2.5 rounded-3xl border border-primary/10"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
