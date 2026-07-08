'use client'

import { CircleBackground } from '@/components/ui/CircleBackground'
import { Users, Building2, Globe, Clock, Banknote } from "lucide-react";
import { useI18n } from '@/lib/i18n/LanguageProvider'

const metricMeta = [
  { icon: Users, value: "1M+" },
  { icon: Building2, value: "250+" },
  { icon: Globe, value: "20+" },
  { icon: Clock, value: "15+" },
  { icon: Banknote, value: "Millions" },
];

const MarketLeadership = () => {
  const { t } = useI18n()
  const metrics = metricMeta.map((m, i) => ({ ...m, label: t.about.market.metrics[i] }))
  return (
    <section className="bg-background py-20 relative overflow-hidden">
      <CircleBackground />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.about.market.headingLead}{" "}
            <span className="gradient-primary-text">{t.about.market.headingHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-base">
            {t.about.market.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
          {metrics.map((m) => (
            <div key={m.label} className="text-center group">
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <m.icon size={24} className="text-primary-foreground" />
              </div>
              <div className="text-3xl md:text-4xl font-black text-primary">{m.value}</div>
              <div className="text-sm font-semibold text-foreground mt-1">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarketLeadership;
