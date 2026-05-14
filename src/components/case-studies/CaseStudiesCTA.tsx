import { ArrowRight, Layers } from 'lucide-react'

interface CaseStudiesCTAProps {
  heading?: string | null
  description?: string | null
  primaryButtonLabel?: string | null
  primaryButtonLink?: string | null
  secondaryButtonLabel?: string | null
  secondaryButtonLink?: string | null
}

export function CaseStudiesCTA({
  heading = "Ready to Write Your Own Success Story?",
  description = "Stop managing your supply chain in spreadsheets. Start de-risking your operations and unlocking your capital today.",
  primaryButtonLabel = "Request a Custom ROI Assessment",
  primaryButtonLink = "/#contact",
  secondaryButtonLabel = "Explore the Platform",
  secondaryButtonLink = "/solutions",
}: CaseStudiesCTAProps) {
  return (
    <section id="cta" className="relative overflow-hidden bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl gradient-primary p-10 md:p-16 max-w-6xl mx-auto">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-secondary blur-3xl" />
          </div>

          <div className="relative max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-black text-primary-foreground leading-tight mb-5">
              {heading}
            </h2>
            <p className="text-lg text-primary-foreground/90 leading-relaxed mb-10">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {primaryButtonLink && (
                <a
                  href={primaryButtonLink}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-7 py-3.5 text-base font-semibold text-secondary-foreground hover:brightness-110 transition shadow-lg"
                >
                  {primaryButtonLabel}
                  <ArrowRight size={18} />
                </a>
              )}
              {secondaryButtonLink && (
                <a
                  href={secondaryButtonLink}
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary-foreground/30 bg-primary-foreground/5 backdrop-blur px-7 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition"
                >
                  <Layers size={18} />
                  {secondaryButtonLabel}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
