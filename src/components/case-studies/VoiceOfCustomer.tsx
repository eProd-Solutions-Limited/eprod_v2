import { Quote } from 'lucide-react'

interface QuoteEntry {
  id?: string | number
  quote: string
  name: string
  role: string
  tag: string
}

interface VoiceOfCustomerProps {
  quotes: QuoteEntry[]
}

export function VoiceOfCustomer({ quotes }: VoiceOfCustomerProps) {
  return (
    <section className="bg-muted/40 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">
            The Voice of the Customer
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
            In Their <span className="gradient-primary-text">Own Words</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {quotes.map((q) => (
            <figure
              key={q.id ?? q.name}
              className="relative bg-card rounded-2xl p-8 border border-border hover:shadow-xl transition flex flex-col"
            >
              <Quote size={32} className="text-secondary mb-4" />
              <blockquote className="text-foreground leading-relaxed mb-6 flex-1 italic">
                "{q.quote}"
              </blockquote>
              <figcaption className="pt-5 border-t border-border">
                <div className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                  {q.tag}
                </div>
                <div className="font-bold text-foreground text-sm">{q.name}</div>
                <div className="text-xs text-muted-foreground">{q.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
