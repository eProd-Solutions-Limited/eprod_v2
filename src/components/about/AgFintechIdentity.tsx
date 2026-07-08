'use client'

import { CheckCircle, XCircle } from "lucide-react";
import { CircleBackground } from '@/components/ui/CircleBackground'
import { useI18n } from '@/lib/i18n/LanguageProvider'

const AgFintechIdentity = () => {
  const { t } = useI18n()
  const comparisons = t.about.agfintech.rows
  return (
    <section className="section-gray py-20 relative overflow-hidden">
      <CircleBackground />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.about.agfintech.headingLead}{" "}
            <span className="gradient-primary-text">{t.about.agfintech.headingHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-base">
            {t.about.agfintech.subtitle}
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="gradient-primary rounded-t-xl md:rounded-tl-xl md:rounded-tr-none px-6 py-3">
              <p className="text-sm font-bold text-primary-foreground uppercase tracking-wider">{t.about.agfintech.ourModelLabel}</p>
            </div>
            <div className="bg-muted rounded-tr-xl px-6 py-3 hidden md:block">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t.about.agfintech.traditionalLabel}</p>
            </div>
          </div>

          <div className="space-y-3">
            {comparisons.map((row, i) => (
              <div key={i} className="grid md:grid-cols-2 gap-3">
                <div className="bg-card border border-primary/20 rounded-xl p-5 flex items-start gap-3">
                  <CheckCircle size={20} className="text-secondary mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground leading-relaxed">{row.eprod}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-5 flex items-start gap-3">
                  <XCircle size={20} className="text-muted-foreground/40 mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{row.traditional}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-base font-semibold text-foreground">
              {t.about.agfintech.footerLead}{" "}
              <span className="gradient-primary-text font-bold">{t.about.agfintech.footerHighlight}</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgFintechIdentity;
