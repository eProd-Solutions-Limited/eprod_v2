import { Plus } from 'lucide-react'
import { CircleBackground } from '@/components/ui/CircleBackground'

const faqs = [
  {
    q: 'Does eProd support multi-value chain operations?',
    a: 'Yes. Manage multiple commodities within one unified system.',
  },
  {
    q: 'Can eProd handle certification audits?',
    a: 'Yes. The platform stores all required data for Organic, Fairtrade and EUDR audits.',
  },
]

const SectorsFAQ = () => (
  <section className="section-gray py-20 relative overflow-hidden" aria-labelledby="faq-heading">
    <CircleBackground />
    <div className="container mx-auto px-4 relative z-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">FAQ</p>
          <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="divide-y divide-border rounded-2xl bg-card border border-border overflow-hidden">
          {faqs.map((faq, i) => (
            <details key={i} className="group">
              <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
                <h3 className="text-base md:text-lg font-semibold text-foreground">{faq.q}</h3>
                <span
                  className="shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center group-open:rotate-45 transition-transform duration-300"
                  aria-hidden="true"
                >
                  <Plus size={16} className="text-foreground" />
                </span>
              </summary>
              <div className="px-6 pb-5 pt-1 text-muted-foreground leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  </section>
)

export default SectorsFAQ
