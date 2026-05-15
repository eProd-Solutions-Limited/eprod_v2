import { ShieldCheck, TrendingUp, Database } from 'lucide-react'

const items = [
  {
    icon: Database,
    title: 'Verifiable Data Layer',
    text: 'Every transaction timestamped, geo-tagged, and audit-ready — the foundation of trust.',
  },
  {
    icon: ShieldCheck,
    title: 'Regulator-Ready',
    text: "Built for EUDR, CSDDD, and GlobalGAP out of the box. Compliance isn't an add-on.",
  },
  {
    icon: TrendingUp,
    title: 'Capital Unlocked',
    text: 'Compliance data flows directly to partner banks — turning operations into credit scores.',
  },
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
            Unlike generic agricultural software, eProd is built as an enterprise-grade AgFinTech engine.
            Our platform is uniquely designed to transform operational data into the rigorous, verifiable
            intelligence required by financial institutions and global regulators.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {items.map((item) => (
            <div
              key={item.title}
              className="bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 rounded-2xl p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-4">
                <item.icon size={22} className="text-secondary" />
              </div>
              <h3 className="text-lg font-bold text-primary-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-primary-foreground/80 leading-relaxed">{item.text}</p>
              
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
