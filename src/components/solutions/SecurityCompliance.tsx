"use client";

import Image from "next/image";
import { Lock, Shield, FileSearch, BadgeCheck } from "lucide-react";
import eudrLogo from "@/assets/EUDR.png";
import gdprLogo from "@/assets/gdpr-compliant.webp";
import csdddLogo from "@/assets/CSDDD.png";
import { useInView } from "@/hooks/useInView";

const items = [
  {
    icon: Lock,
    title: "Data Encryption",
    text: "All data is encrypted at rest and in transit using industry-standard protocols.",
  },
  {
    icon: Shield,
    title: "GDPR & Data Privacy",
    text: "We are fully compliant with GDPR and other international data privacy regulations.",
  },
  {
    icon: FileSearch,
    title: "Regular Security Audits",
    text: "Our platform undergoes regular third-party security audits and penetration testing.",
  },
  {
    icon: BadgeCheck,
    title: "EUDR & CSDDD Ready",
    text: "Designed to help you meet the traceability and reporting requirements of EUDR and other supply chain due diligence regulations.",
  },
];

const SecurityCompliance = () => {
  const heading = useInView();
  const cards = useInView();
  const logos = useInView();

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div
          ref={heading.ref}
          className={`max-w-3xl mx-auto text-center mb-16 transition-all duration-700 ${
            heading.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">Security & Compliance</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
            Enterprise-Grade Security for Your{" "}
            <span className="gradient-primary-text">Most Valuable Asset</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We understand that your data is your most valuable asset. That&apos;s why we&apos;ve built the eProd platform with
            enterprise-grade security at its core.
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
            Compliance Standards
          </p>
          <div className="flex items-center gap-10 flex-wrap justify-center">
            <Image src={eudrLogo} alt="EUDR Compliant" height={72} className="object-contain opacity-90 hover:opacity-100 transition" />
            <Image src={gdprLogo} alt="GDPR Compliant" height={72} className="object-contain opacity-90 hover:opacity-100 transition" />
            <Image src={csdddLogo} alt="CSDDD Compliant" height={72} className="object-contain opacity-90 hover:opacity-100 transition" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityCompliance;
