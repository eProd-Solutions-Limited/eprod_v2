'use client'

import { useEffect } from 'react'
import Image, { StaticImageData } from 'next/image'
import { gaEvents } from '@/lib/ga-events'
import { useInView } from '@/hooks/useInView'
import { CircleBackground } from '@/components/ui/CircleBackground'
import ledgerImg from '@/assets/Ledger.jpg'
import euMarketImg from '@/assets/EU-market.webp'
import marginErosionImg from '@/assets/margin erosin.png'

const problems: {
  title: string
  text: string
  image: StaticImageData
  imageAlt: string
  contain?: boolean
}[] = [
  {
    title: 'Fragmentation',
    text: 'Managing 500+ farmers means juggling spreadsheets, WhatsApp, and notebooks. Data is scattered. Insights are hidden.',
    image: ledgerImg,
    imageAlt: 'Fragmented ledger records representing data silos',
  },
  {
    title: 'Compliance Risk',
    text: 'Export requirements are tightening. One missed farmer record or quality issue can mean failed certification and lost market access.',
    image: euMarketImg,
    imageAlt: 'EU market representing compliance and export requirements',
  },
  {
    title: 'Margin Erosion',
    text: 'Without visibility, waste goes undetected. Manual payments and inefficient communication with farmers cost you money every day.',
    image: marginErosionImg,
    imageAlt: 'Declining margins illustrating cost inefficiencies',
    contain: false,
  },
]

const ProblemSection = () => {
  useEffect(() => {
    gaEvents.viewPage('home_problem', 'problem')
  }, [])

  const { ref: headingRef, inView: headingInView } = useInView({ threshold: 0.25 })
  const { ref: sectionRef, inView: sectionInView } = useInView({ threshold: 0.3 })

  useEffect(() => {
    if (sectionInView) gaEvents.sectionViewed('problem')
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
            The Challenge: Managing Agricultural Supply Chains{' '}
            <span className="gradient-primary-text">at Scale</span>
          </h2>
          <p className="text-center md:text-2xl text-muted-foreground mb-14 max-w-2xl mx-auto">
            Agribusinesses face growing complexity every day. Here are the three biggest pain
            points.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((p) => (
            <div
              key={p.title}
              className="relative bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition group"
            >
              {/* Small ring accent on card top-right corner */}
              <div
                className="pointer-events-none absolute -top-2.5 -right-2.5 h-7 w-7 rounded-full border border-primary/20 z-10"
                aria-hidden="true"
              />
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.imageAlt}
                  fill
                  className={`${p.contain ? 'object-contain' : 'object-cover'} group-hover:scale-105 transition-transform duration-500`}
                />
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-foreground mb-3">{p.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProblemSection
