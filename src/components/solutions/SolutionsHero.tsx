'use client';

import Image from "next/image";
import { ArrowRight, Layers } from "lucide-react";
import desktopMobile from "@/assets/Desktop and Mobile.png";
import { CircleBackground } from '@/components/ui/CircleBackground';
import { useI18n } from '@/lib/i18n/LanguageProvider';

const SolutionsHero = () => {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={desktopMobile}
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        {/* Left-to-right gradient: opaque brand color on left, fades to semi-transparent on right */}
        <div className="absolute inset-0 bg-linear-to-r from-primary via-primary/92 to-primary/40" />
      </div>
      <CircleBackground variant="dark" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 z-1"
        aria-hidden="true"
        style={{ backgroundColor: 'hsl(0 0% 100%)', borderRadius: '60px 0 0 0' }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 mb-6 animate-fade-in-up"
            style={{ animationDelay: "0ms" }}
          >
            <Layers size={16} className="text-secondary" />
            <span className="text-sm font-medium text-primary-foreground">{t.solutions.hero.badge}</span>
          </div>

          <h1
            className="text-4xl md:text-6xl font-black text-primary-foreground leading-tight mb-6 animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            {t.solutions.hero.titleLead} <span className="text-secondary">{t.solutions.hero.titleHighlight}</span> {t.solutions.hero.titleTrail}
          </h1>

          <p
            className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed mb-8 animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            {t.solutions.hero.subtitle}
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 animate-fade-in-up"
            style={{ animationDelay: "320ms" }}
          >
            <a
              href="#cta"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-7 py-3.5 text-base font-semibold text-secondary-foreground hover:brightness-110 transition shadow-lg"
            >
              {t.solutions.hero.ctaPrimary}
              <ArrowRight size={18} />
            </a>
            <a
              href="#integrations"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary-foreground/30 bg-primary-foreground/5 backdrop-blur px-7 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition"
            >
              {t.solutions.hero.ctaSecondary}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionsHero;
