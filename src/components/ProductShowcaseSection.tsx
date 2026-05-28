'use client'

import Image from 'next/image'
import desktopMobileImg from '@/assets/Desktop and Mobile 3.png'

const ProductShowcaseSection = () => {
  const openDemoModal = () => {
    const fab = document.querySelector('[aria-label="Request a Demo"]') as HTMLButtonElement | null
    fab?.click()
  }

  return (
    <section className="gradient-primary py-20 overflow-hidden">
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
              eProd Platform
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary-foreground leading-tight">
              eProd — Everything you need to{' '}
              <span className="text-secondary">digitalize your agri-supply chain</span>
            </h2>
            <p className="text-primary-foreground/80 text-base leading-relaxed">
              With our end-to-end platform, your farmer management, supply chain traceability, and
              compliance reporting becomes easier and more accurate than ever. Our modular setup
              provides a system perfectly tailored to your agribusiness and markets.
            </p>
            <ul className="space-y-2.5">
              {[
                'Works online and offline on any device',
                'EUDR, Organic & Fairtrade compliance built in',
                'Integrates with banks and mobile money',
                'Trusted by 250+ agribusinesses across 20 countries',
              ].map((point) => (
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
                Request a Demo
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default ProductShowcaseSection
