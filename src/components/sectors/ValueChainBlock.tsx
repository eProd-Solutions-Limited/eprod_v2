'use client'

import { CircleBackground } from '@/components/ui/CircleBackground'
import { useI18n } from '@/lib/i18n/LanguageProvider'

const ValueChainBlock = () => {
  const { t } = useI18n()
  const chains = t.sectors.valueChain.chains
  return (
  <section
    className="gradient-primary py-40 relative overflow-hidden"
    aria-label="Value chains supported by eProd"
  >
    <div
      className="pointer-events-none absolute inset-x-0 top-0 h-16 z-1"
      aria-hidden="true"
      style={{ backgroundColor: 'hsl(0 0% 100%)', borderRadius: '0 0 0 60px' }}
    />
    <CircleBackground variant="dark" />
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 h-16 z-1"
      aria-hidden="true"
      style={{ backgroundColor: 'hsl(210 20% 91%)', borderRadius: '60px 0 0 0' }}
    />
    <div className="container mx-auto px-4 text-center relative z-10">
      <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-4">{t.sectors.valueChain.eyebrow}</p>
      <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
        {t.sectors.valueChain.heading}
      </h2>
      <p className="text-primary-foreground/80 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
        {t.sectors.valueChain.subtitle}
      </p>
      <div
        className="flex flex-wrap justify-center gap-3"
        role="list"
        aria-label="Supported value chains"
      >
        {chains.map((chain) => (
          <span
            key={chain}
            role="listitem"
            className="px-4 py-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground text-sm font-medium backdrop-blur"
          >
            {chain}
          </span>
        ))}
      </div>
    </div>
  </section>
  )
}

export default ValueChainBlock
