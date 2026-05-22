"use client";

import Image, { StaticImageData } from "next/image";
import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import desktopMobile from "@/assets/Desktop and Mobile.jpeg";
import phone from "@/assets/Phone.png";
import dftgIntergation from "@/assets/DFTG-intergration.png";

const pillars: {
  number: string;
  label: string;
  subtitle: string;
  title: string;
  description: string;
  features: string[];
  image: StaticImageData;
  imageClass: string;
  imageBg: string;
}[] = [
  {
    number: "01",
    label: "Core ERP",
    subtitle: "Central database & logic",
    title: "The Central Nervous System of Your Operation",
    description: "All your data, workflows, and business logic live in one secure, centralized database — giving you a single source of truth across your entire value chain.",
    features: [
      "Multi-tenant architecture for complete data isolation",
      "Scalable infrastructure that grows with your business",
      "Granular role-based access control",
    ],
    image: desktopMobile,
    imageClass: "object-cover object-top",
    imageBg: "bg-gray-100",
  },
  {
    number: "02",
    label: "Mobile App",
    subtitle: "Field staff tool",
    title: "Your Eyes and Ears in the Field",
    description: "Offline-first mobile app that empowers field staff to register farmers, record transactions, and conduct surveys — even in the most remote, zero-connectivity locations.",
    features: [
      "Offline-first, works without any internet connection",
      "Real-time sync when connectivity returns",
      "Intuitive UI built for rapid field adoption",
    ],
    image: phone,
    imageClass: "object-contain",
    imageBg: "bg-gray-50",
  },
  {
    number: "03",
    label: "Integration Hub",
    subtitle: "Financial bridge",
    title: "Your Bridge to the Financial Ecosystem",
    description: "Connects your eProd instance to banks, mobile money providers, and logistics partners through pre-built connectors and a flexible API — turning your data into financial access.",
    features: [
      "RESTful API for custom integrations",
      "Pre-built connectors for leading financial institutions",
      "Webhooks for real-time data exchange",
    ],
    image: dftgIntergation,
    imageClass: "object-contain p-6",
    imageBg: "bg-white",
  },
];

const PlatformArchitecture = () => {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const heading = useInView();
  const body = useInView();

  const handleSelect = (i: number) => {
    if (i === active) return;
    setFading(true);
    setTimeout(() => {
      setActive(i);
      setFading(false);
    }, 180);
  };

  const pillar = pillars[active];

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div
          ref={heading.ref}
          className={`max-w-3xl mx-auto text-center mb-16 transition-all duration-700 ${
            heading.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">Platform Architecture</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
            An End-to-End Platform to Power Your{" "}
            <span className="gradient-primary-text">Entire Value Chain</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Three integrated layers — each built for the realities of African agribusiness.
          </p>
        </div>

        <div
          ref={body.ref}
          className={`max-w-6xl mx-auto flex flex-col md:flex-row gap-6 lg:gap-10 transition-all duration-700 ${
            body.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Left sticky nav */}
          <div className="md:w-56 lg:w-64 shrink-0 md:sticky md:top-24 md:self-start flex flex-row md:flex-col gap-2">
            {pillars.map((p, i) => (
              <button
                key={p.label}
                onClick={() => handleSelect(i)}
                className={`w-full text-left px-4 py-4 rounded-xl transition-all duration-200 cursor-pointer focus:outline-none ${
                  i === active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-primary-lighter text-foreground"
                }`}
              >
                <span className={`block text-xs font-bold uppercase tracking-widest mb-1 ${i === active ? "text-secondary" : "text-muted-foreground"}`}>
                  {p.number}
                </span>
                <span className="block text-sm font-bold">{p.label}</span>
                <span className={`block text-xs mt-0.5 ${i === active ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {p.subtitle}
                </span>
              </button>
            ))}
          </div>

          {/* Right content */}
          <div className="flex-1 min-w-0">
            {/* Image */}
            <div
              className={`relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8 border border-border transition-opacity duration-180 ${pillar.imageBg} ${fading ? "opacity-0" : "opacity-100"}`}
            >
              <Image
                key={active}
                src={pillar.image}
                alt={pillar.title}
                fill
                className={pillar.imageClass}
                priority
              />
            </div>

            {/* Text */}
            <div className={`transition-opacity duration-180 ${fading ? "opacity-0" : "opacity-100"}`}>
              <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-3">{pillar.label}</p>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">{pillar.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">{pillar.description}</p>
              <ul className="space-y-3">
                {pillar.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-foreground">
                    <span className="mt-2 w-4 h-px bg-secondary shrink-0 inline-block" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformArchitecture;
