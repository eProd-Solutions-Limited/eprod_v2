"use client";

import Image from "next/image";
import { Lock, Shield, FileSearch, BadgeCheck, Download } from "lucide-react";
import eudrLogo from "@/assets/EUDR.png";
import gdprLogo from "@/assets/gdpr-compliant.webp";
import csdddLogo from "@/assets/CSDDD.png";
import { useInView } from "@/hooks/useInView";
import { CircleBackground } from '@/components/ui/CircleBackground';
import { useI18n } from '@/lib/i18n/LanguageProvider';

const itemIcons = [Lock, Shield, FileSearch, BadgeCheck];

const SecurityCompliance = () => {
  const { t } = useI18n();
  const items = t.solutions.security.items.map((item, i) => ({ ...item, icon: itemIcons[i] }));
  const heading = useInView();
  const cards = useInView();
  const logos = useInView();

  return (
    <section className="bg-background py-20 relative overflow-hidden">
      <CircleBackground />
      <div className="container mx-auto px-4 relative z-10">
        <div
          ref={heading.ref}
          className={`max-w-3xl mx-auto text-center mb-16 transition-all duration-700 ${
            heading.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">{t.solutions.security.eyebrow}</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
            {t.solutions.security.headingLead}{" "}
            <span className="gradient-primary-text">{t.solutions.security.headingHighlight}</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t.solutions.security.subtitle}
          </p>
        </div>

        <div ref={cards.ref} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {items.map((item, i) => (
            <div
              key={item.title}
              className={`relative bg-card rounded-2xl p-7 border border-border hover:border-secondary hover:shadow-lg transition-all duration-500 group ${
                cards.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: cards.inView ? `${i * 120}ms` : "0ms" }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary-lighter flex items-center justify-center mb-5 group-hover:gradient-primary transition">
                <item.icon size={26} className="text-primary group-hover:text-primary-foreground transition" />
              </div>
              <h3 className="font-bold text-foreground mb-2 text-lg">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        <div
          ref={logos.ref}
          className={`mt-14 flex flex-wrap items-center justify-center gap-10 transition-all duration-700 ${
            logos.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider w-full text-center mb-2">
            {t.solutions.security.standardsLabel}
          </p>
          <div className="flex items-center gap-10 flex-wrap justify-center">
            <Image src={eudrLogo} alt="EUDR Compliant" height={72} className="object-contain opacity-90 hover:opacity-100 transition" />
            <Image src={gdprLogo} alt="GDPR Compliant" height={72} className="object-contain opacity-90 hover:opacity-100 transition" />
            <Image src={csdddLogo} alt="CSDDD Compliant" height={72} className="object-contain opacity-90 hover:opacity-100 transition" />
          </div>

          {/* EUDR Checklist Download */}
          <div className="w-full flex justify-center mt-10">
            <a
              href="/assets/EUDR_Implementation_Checklist.pdf"
              download="EUDR_Implementation_Checklist_eProd.pdf"
              className="inline-flex items-center gap-3 rounded-full gradient-primary px-8 py-4 text-sm font-bold text-primary-foreground hover:brightness-110 active:scale-95 transition-all duration-150 shadow-lg group"
            >
              <Download size={18} className="group-hover:animate-bounce" />
              {t.solutions.security.download}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityCompliance;
