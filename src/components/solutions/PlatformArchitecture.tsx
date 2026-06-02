"use client";

import Image, { StaticImageData } from "next/image";
import { useInView } from "@/hooks/useInView";
import desktopMobile from "@/assets/Desktop and Mobile.png";
import phone from "@/assets/Phone.png";
import dftgIntergation from "@/assets/Intergrations.png";
import { CircleBackground } from '@/components/ui/CircleBackground';

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
  imagePadding: string;
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
    imageClass: "object-contain",
    imageBg: "bg-gray-100",
    imagePadding: "p-4",
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
    imagePadding: "p-6",
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
    imageClass: "object-contain",
    imageBg: "bg-white",
    imagePadding: "p-4",
  },
];

const PlatformArchitecture = () => {
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
