'use client'

import { useEffect } from 'react'
import { LogoCell } from '@/components/LogoCell'
import type { LogoEntry } from '@/components/LogoCell'
import { gaEvents } from '@/lib/ga-events'

const metricsRows = [
  [
    { value: "500+", label: "Companies" },
    { value: "50,000+", label: "Farmers" },
    { value: "20", label: "Countries" },
  ]
];

const ProofSection = ({ agribusinessLogos = [] }: { agribusinessLogos?: LogoEntry[] }) => {
  useEffect(() => {
    gaEvents.viewPage('home_proof', 'proof')
  }, [])

  return (
    <section className="section-gray py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-14">
          Trusted by <span className="gradient-primary-text">250+ Agribusinesses</span> Across 20 Countries
        </h2>

        <div className="space-y-8 mb-16">
          {metricsRows.map((row, ri) => (
            <div key={ri} className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto">
              {row.map((m) => (
                <div key={m.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-primary">{m.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{m.label}</div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mb-6">
          Trusted by leading agribusinesses in East Africa, West Africa, and beyond.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {agribusinessLogos.map((logo) => (
            <div
              key={logo.id ?? logo.name}
              className="px-6 py-3 rounded-lg bg-card border border-border flex items-center justify-center opacity-60 hover:opacity-100 transition"
            >
              <LogoCell logo={logo} textClassName="text-sm font-semibold text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProofSection;
