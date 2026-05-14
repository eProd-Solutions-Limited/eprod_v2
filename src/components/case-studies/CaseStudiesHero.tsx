import { ArrowRight, Users, Globe2, Building2 } from 'lucide-react'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import type { CaseStudiesHero as CaseStudiesHeroType } from '@/payload-types'
import { CaseStudiesHeroCarousel } from './CaseStudiesHeroCarousel'

async function getHeroImages() {
  const payload = await getPayload({ config: payloadConfig })
  const result = await payload.find({
    collection: 'case-studies-hero',
    limit: 10,
    depth: 0,
  })
  return (result.docs as CaseStudiesHeroType[]).map((doc) => ({
    url: doc.url ?? '',
    alt: doc.alt,
  }))
}

export async function CaseStudiesHero() {
  const images = await getHeroImages()

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0">
        <CaseStudiesHeroCarousel images={images} />
        <div className="absolute inset-0 gradient-primary opacity-30" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 mb-6">
            <Building2 size={16} className="text-secondary" />
            <span className="text-sm font-medium text-primary-foreground">Customer Success</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-primary-foreground leading-tight mb-6">
            1 Million+ Farmers. <span className="text-secondary">250+ Clients.</span> 20+ Countries.
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed mb-10 max-w-3xl">
            Leading agribusinesses and financial institutions across Africa trust eProd's enterprise-grade
            AgFinTech platform to digitize supply chains, ensure compliance, and drive sustainable growth.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-3xl">
            {[
              { icon: Building2, label: 'Enterprise Clients', value: '250+' },
              { icon: Users, label: 'Farmers Managed', value: '1M+' },
              { icon: Globe2, label: 'Countries Active', value: '20+' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur px-4 py-3"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <stat.icon size={18} className="text-secondary" />
                </div>
                <div>
                  <div className="text-xl font-black text-primary-foreground leading-none">{stat.value}</div>
                  <div className="text-xs text-primary-foreground/70 mt-1">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          <a
            href="#impact-grid"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-7 py-3.5 text-base font-semibold text-secondary-foreground hover:brightness-110 transition shadow-lg"
          >
            Explore Success Stories
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  )
}
