import { Database, ShieldCheck, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import { CircleBackground } from '@/components/ui/CircleBackground'

const regulatorLogos = [
  { src: '/logos/fairtrade.jpeg', alt: 'Fairtrade', width: 140, height: 70 },
  { src: '/logos/global gap.jpeg', alt: 'GlobalGAP', width: 140, height: 70 },
  { src: '/logos/USDA.jpeg', alt: 'USDA', width: 140, height: 70 },
]

export function DifferentiatorBanner() {
  return (
    <section className="relative overflow-hidden gradient-primary py-32">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-16 z-1"
        aria-hidden="true"
        style={{ backgroundColor: 'hsl(0 0% 100%)', borderRadius: '0 0 60px 0' }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 z-1"
        aria-hidden="true"
        style={{ backgroundColor: 'hsl(210 20% 91%)', borderRadius: '0 60px 0 0' }}
      />
      <CircleBackground variant="dark" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">
            The eProd Difference
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-primary-foreground leading-tight mb-5">
            We Don't Just Manage Supply Chains.
            <br />
            <span className="text-secondary">We Make Them Bankable.</span>
          </h2>
          <p className="text-lg text-primary-foreground/90 leading-relaxed">
            Unlike generic agricultural software, eProd is built as an enterprise-grade AgFinTech
            engine. Our platform is uniquely designed to transform operational data into the
            rigorous, verifiable intelligence required by financial institutions and global
            regulators.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Verifiable Data Layer */}
          <div className="bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 rounded-2xl p-6 flex flex-col">
            <div className="mt-auto rounded-xl overflow-hidden">
              <Image
                src="/logos/farm_geo.jpeg"
                alt="Verifiable Data Layer"
                width={400}
                height={200}
                className="w-full h-36 object-cover"
              />
            </div>
            <h3 className="text-lg font-bold text-primary-foreground mb-2">
              Verifiable Data Layer
            </h3>
            <p className="text-sm text-primary-foreground/80 leading-relaxed mb-4">
              Every transaction timestamped, geo-tagged, and audit-ready — the foundation of trust.
            </p>
          </div>

          {/* Regulator-Ready */}
          <div className="bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 rounded-2xl p-6 flex flex-col">
           <div className="my-auto flex items-center justify-around gap-4 py-4">
              {regulatorLogos.map((logo) => (
                <Image
                  key={logo.alt}
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className="max-h-16 w-auto object-contain"
                />
              ))}
            </div>
            <h3 className="text-lg font-bold text-primary-foreground mb-2">Regulator-Ready</h3>
            <p className="text-sm text-primary-foreground/80 leading-relaxed mb-4">
              Built for EUDR, CSDDD, and GlobalGAP out of the box. Compliance isn't an add-on.
            </p>
          </div>

          {/* Capital Unlocked */}
          <div className="bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 rounded-2xl p-6 flex flex-col">
            <div className="mt-auto rounded-xl overflow-hidden">
              <Image
                src="/logos/capital_unlocked.jpeg"
                alt="Capital Unlocked"
                width={400}
                height={400}
                className="w-full object-cover"
              />
            </div>
            <h3 className="text-lg font-bold text-primary-foreground mb-2">Capital Unlocked</h3>
            <p className="text-sm text-primary-foreground/80 leading-relaxed mb-4">
              Compliance data flows directly to partner banks — turning operations into credit
              scores.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
