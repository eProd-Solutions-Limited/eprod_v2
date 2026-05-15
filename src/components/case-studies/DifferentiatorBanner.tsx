import { Database, ShieldCheck, TrendingUp } from 'lucide-react'
import Image from 'next/image'

const regulatorLogos = [
  { src: '/logos/fairtrade.jpeg', alt: 'Fairtrade', width: 80, height: 40 },
  { src: '/logos/global gap.jpeg', alt: 'GlobalGAP', width: 80, height: 40 },
  { src: '/logos/usda.jpeg', alt: 'USDA', width: 80, height: 40 },
]

export function DifferentiatorBanner() {
  return (
    <section className="relative overflow-hidden gradient-primary py-20">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-secondary blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-primary-foreground blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
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
            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-4">
              <Database size={22} className="text-secondary" />
            </div>
            <h3 className="text-lg font-bold text-primary-foreground mb-2">
              Verifiable Data Layer
            </h3>
            <p className="text-sm text-primary-foreground/80 leading-relaxed mb-4">
              Every transaction timestamped, geo-tagged, and audit-ready — the foundation of trust.
            </p>
            <div className="mt-auto rounded-xl overflow-hidden">
              <Image
                src="/logos/farm_geo.jpeg"
                alt="Verifiable Data Layer"
                width={400}
                height={200}
                className="w-full h-36 object-cover"
              />
            </div>
          </div>

          {/* Regulator-Ready */}
          <div className="bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 rounded-2xl p-6 flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-4">
              <ShieldCheck size={22} className="text-secondary" />
            </div>
            <h3 className="text-lg font-bold text-primary-foreground mb-2">Regulator-Ready</h3>
            <p className="text-sm text-primary-foreground/80 leading-relaxed mb-4">
              Built for EUDR, CSDDD, and GlobalGAP out of the box. Compliance isn't an add-on.
            </p>
            <div className="mt-auto grid grid-cols-2 gap-3">
              {regulatorLogos.map((logo) => (
                <div
                  key={logo.alt}
                  className="bg-primary-foreground/90 rounded-lg p-2 flex items-center justify-center"
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.width}
                    height={logo.height}
                    className="max-h-8 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Capital Unlocked */}
          <div className="bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 rounded-2xl p-6 flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-4">
              <TrendingUp size={22} className="text-secondary" />
            </div>
            <h3 className="text-lg font-bold text-primary-foreground mb-2">Capital Unlocked</h3>
            <p className="text-sm text-primary-foreground/80 leading-relaxed mb-4">
              Compliance data flows directly to partner banks — turning operations into credit
              scores.
            </p>
            <div className="mt-auto rounded-xl overflow-hidden">
              <Image
                src="/logos/capital_unlocked.jpeg"
                alt="Capital Unlocked"
                width={400}
                height={300}
                className="w-full h-36 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
