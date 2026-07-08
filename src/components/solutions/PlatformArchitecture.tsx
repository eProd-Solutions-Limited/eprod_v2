"use client";

import Image, { StaticImageData } from "next/image";
import { useInView } from "@/hooks/useInView";
import desktopMobile from "@/assets/Desktop and Mobile.png";
import phone from "@/assets/Phone.png";
import dftgIntergation from "@/assets/Intergrations.png";
import { CircleBackground } from '@/components/ui/CircleBackground';
import { useI18n } from '@/lib/i18n/LanguageProvider';

const pillarVisuals: {
  number: string;
  image: StaticImageData;
  imageClass: string;
  imageBg: string;
  imagePadding: string;
}[] = [
  { number: "01", image: desktopMobile, imageClass: "object-contain", imageBg: "bg-gray-100", imagePadding: "p-4" },
  { number: "02", image: phone, imageClass: "object-contain", imageBg: "bg-gray-50", imagePadding: "p-6" },
  { number: "03", image: dftgIntergation, imageClass: "object-contain", imageBg: "bg-white", imagePadding: "p-4" },
];

const PlatformArchitecture = () => {
  const { t } = useI18n();
  const pillars = t.solutions.architecture.pillars.map((p, i) => ({ ...p, ...pillarVisuals[i] }));
  const heading = useInView();
  const body = useInView();

  return (
    <section id="platform-architecture" className="bg-background py-20 relative overflow-hidden">
      <CircleBackground />
      <div className="container mx-auto px-4 relative z-10">
        <div
          ref={heading.ref}
          className={`max-w-3xl mx-auto text-center mb-16 transition-all duration-700 ${
            heading.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">{t.solutions.architecture.eyebrow}</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
            {t.solutions.architecture.headingLead}{" "}
            <span className="gradient-primary-text">{t.solutions.architecture.headingHighlight}</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t.solutions.architecture.subtitle}
          </p>
        </div>

        <div
          ref={body.ref}
          className={`max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 ${
            body.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {pillars.map((pillar) => (
            <div
              key={pillar.label}
              className="flex flex-col rounded-2xl border border-border bg-card overflow-hidden"
            >
              {/* Image */}
              <div className={`relative w-full h-72 ${pillar.imageBg} ${pillar.imagePadding}`}>
                <Image
                  src={pillar.image}
                  alt={pillar.title}
                  fill
                  className={pillar.imageClass}
                />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-secondary uppercase tracking-widest">{pillar.number}</span>
                  <span className="text-xs text-muted-foreground">{pillar.subtitle}</span>
                </div>
                <span className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">{pillar.label}</span>
                <h3 className="text-lg font-bold text-foreground mb-3 leading-snug">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{pillar.description}</p>
                <ul className="space-y-2 mt-auto">
                  {pillar.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-foreground">
                      <span className="mt-2 w-4 h-px bg-secondary shrink-0 inline-block" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformArchitecture;
