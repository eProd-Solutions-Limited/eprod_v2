"use client";

import { MapPin, Cpu, Building2, ArrowRight } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { CircleBackground } from '@/components/ui/CircleBackground';
import { useI18n } from '@/lib/i18n/LanguageProvider';

const stepIcons = [MapPin, Cpu, Building2];

const DataFlow = () => {
  const { t } = useI18n();
  const steps = t.solutions.dataFlow.steps.map((s, i) => ({ ...s, icon: stepIcons[i] }));
  const heading = useInView();
  const cards = useInView();

  return (
    <section className="section-gray py-20 relative overflow-hidden">
      <CircleBackground />
      <div className="container mx-auto px-4 relative z-10">
        <div
          ref={heading.ref}
          className={`max-w-3xl mx-auto text-center mb-16 transition-all duration-700 ${
            heading.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">{t.solutions.dataFlow.eyebrow}</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
            {t.solutions.dataFlow.headingLead}{" "}
            <span className="gradient-primary-text">{t.solutions.dataFlow.headingHighlight}</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t.solutions.dataFlow.subtitle}
          </p>
        </div>

        <div ref={cards.ref} className="relative">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-4 relative">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className={`relative transition-all duration-500 ${
                  cards.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: cards.inView ? `${i * 150}ms` : "0ms" }}
              >
                <div className="bg-card rounded-2xl p-7 border border-border h-full shadow-sm hover:shadow-lg transition">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                      <s.icon size={22} className="text-primary-foreground" />
                    </div>
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider">{s.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-1">{s.title}</h3>
                  <p className="text-sm font-semibold text-primary mb-4">{s.location}</p>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-semibold text-foreground mb-1">{t.solutions.dataFlow.actionLabel}</p>
                      <p className="text-muted-foreground leading-relaxed">{s.action}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">{t.solutions.dataFlow.dataPointsLabel}</p>
                      <p className="text-muted-foreground leading-relaxed">{s.dataPoints}</p>
                    </div>
                    <div className="pt-3 border-t border-border">
                      <p className="font-semibold text-secondary">{s.value}</p>
                    </div>
                  </div>
                </div>

                {i < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-secondary items-center justify-center shadow-lg">
                    <ArrowRight size={16} className="text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataFlow;
