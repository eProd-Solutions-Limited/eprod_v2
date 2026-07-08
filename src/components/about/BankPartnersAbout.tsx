'use client'

import { Landmark } from "lucide-react";
import { CircleBackground } from '@/components/ui/CircleBackground'
import { LogoCell } from "@/components/LogoCell";
import type { LogoEntry } from "@/components/LogoCell";
import { useI18n } from '@/lib/i18n/LanguageProvider'

interface BankPartnersAboutProps {
  bankLogos: LogoEntry[];
}

const BankPartnersAbout = ({ bankLogos }: BankPartnersAboutProps) => {
  const { t } = useI18n()
  return (
    <section className="section-gray py-20 relative overflow-hidden">
      <CircleBackground />
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center mx-auto mb-5">
          <Landmark size={28} className="text-primary-foreground" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {t.about.bankPartners.headingLead}{" "}
          <span className="gradient-primary-text">{t.about.bankPartners.headingHighlight}</span>
        </h2>
        <p className="text-muted-foreground text-base max-w-2xl mx-auto mb-12">
          {t.about.bankPartners.subtitle}
        </p>

        <div className="flex flex-row flex-nowrap items-center justify-center gap-8 max-w-4xl mx-auto">
          {bankLogos.map((logo) => (
            <div
              key={logo.id ?? logo.name}
              className="flex items-center justify-center"
            >
              <LogoCell logo={logo} textClassName="text-lg font-bold text-primary" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BankPartnersAbout;
