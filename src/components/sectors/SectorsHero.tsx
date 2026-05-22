import { Globe, ArrowRight } from 'lucide-react'

const SectorsHero = () => (
  <section className="relative overflow-hidden gradient-primary py-24 md:py-32">
    <div className="absolute inset-0 opacity-10" aria-hidden="true">
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-secondary blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-primary-foreground blur-3xl" />
    </div>
    <div
      className="absolute inset-0 opacity-[0.04]"
      aria-hidden="true"
      style={{
        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    />

    <div className="container mx-auto px-4 relative">
      <div className="max-w-4xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 mb-6">
          <Globe size={16} className="text-secondary" />
          <span className="text-sm font-medium text-primary-foreground">Value Chain Coverage</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-primary-foreground leading-tight mb-6">
          Sectors We Serve —{' '}
          <span className="text-secondary">Tailored Solutions</span>{' '}
          for Every Value Chain
        </h1>

        <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed mb-8 max-w-3xl">
          From farm-level data collection to export compliance and farmer payments, eProd adapts
          to the specific requirements of each agricultural sector across Africa and beyond.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#sectors"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-7 py-3.5 text-base font-semibold text-secondary-foreground hover:brightness-110 transition shadow-lg"
          >
            Explore Sectors
            <ArrowRight size={18} />
          </a>
          <a
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary-foreground/30 bg-primary-foreground/5 backdrop-blur px-7 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition"
          >
            Talk to a Specialist
          </a>
        </div>
      </div>
    </div>
  </section>
)

export default SectorsHero
