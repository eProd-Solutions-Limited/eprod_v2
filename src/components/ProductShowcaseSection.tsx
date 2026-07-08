'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { gaEvents } from '@/lib/ga-events'
import { useInView } from '@/hooks/useInView'
import { useI18n } from '@/lib/i18n/LanguageProvider'
import desktopMobileImg from '@/assets/Desktop and Mobile 3.png'

const ProductShowcaseSection = () => {
  const { t } = useI18n()
  const { ref: sectionRef, inView: sectionInView } = useInView({ threshold: 0.3 })

  useEffect(() => {
    if (sectionInView) gaEvents.sectionViewed('product_showcase')
  }, [sectionInView])

  const openDemoModal = () => {
    const fab = document.querySelector('[aria-label="Request a Demo"]') as HTMLButtonElement | null
    fab?.click()
  }

  return (
    <section className="gradient-primary py-20 overflow-hidden relative" ref={sectionRef}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-16 z-1"
        aria-hidden="true"
        style={{ backgroundColor: 'hsl(0 0% 100%)', borderRadius: '0 0 60px 0' }}
      />
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left — product image */}
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-lg">
              <Image
                src={desktopMobileImg}
                alt="eProd platform on desktop and mobile"
                width={600}
                height={420}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>

          {/* Right — text content */}
          <div className="flex flex-col gap-6">
            <p className="text-sm font-bold uppercase tracking-widest text-primary-foreground/60">
              {t.productShowcase.eyebrow}
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary-foreground leading-tight">
              {t.productShowcase.headingLead}{' '}
              <span className="text-secondary">{t.productShowcase.headingHighlight}</span>
            </h2>
            <p className="text-primary-foreground/80 text-base leading-relaxed">
              {t.productShowcase.text}
            </p>
            <ul className="space-y-2.5">
              {t.productShowcase.points.map((point) => (
                <li key={point} className="flex items-center gap-3 text-sm text-primary-foreground/90">
                  <span className="w-2 h-2 rounded-full bg-secondary flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
            <div>
              <button
                onClick={openDemoModal}
                className="rounded-full bg-secondary px-8 py-3.5 text-sm font-bold text-secondary-foreground hover:brightness-110 active:scale-95 transition-all duration-150 shadow-lg"
              >
                {t.productShowcase.requestDemo}
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default ProductShowcaseSection
