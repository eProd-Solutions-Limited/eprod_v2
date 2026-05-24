import Image from "next/image";
import { ArrowRight, Layers } from "lucide-react";
import desktopMobile from "@/assets/Desktop and Mobile.png";

const SolutionsHero = () => {
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

      <div className="container mx-auto px-4 relative">
        <div className="max-w-2xl">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 mb-6 animate-fade-in-up"
            style={{ animationDelay: "0ms" }}
          >
            <Layers size={16} className="text-secondary" />
            <span className="text-sm font-medium text-primary-foreground">The eProd Platform</span>
          </div>

          <h1
            className="text-4xl md:text-6xl font-black text-primary-foreground leading-tight mb-6 animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            The Enterprise-Grade <span className="text-secondary">AgFinTech Engine</span> for Africa.
          </h1>

          <p
            className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed mb-8 animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            eProd is the robust, secure, and scalable platform that powers the most ambitious agribusinesses in Africa.
            We provide the end-to-end infrastructure to digitize your supply chain, de-risk your operations, and unlock financial services.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 animate-fade-in-up"
            style={{ animationDelay: "320ms" }}
          >
            <a
              href="#cta"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-7 py-3.5 text-base font-semibold text-secondary-foreground hover:brightness-110 transition shadow-lg"
            >
              Request a Technical Deep Dive
              <ArrowRight size={18} />
            </a>
            <a
              href="#integrations"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary-foreground/30 bg-primary-foreground/5 backdrop-blur px-7 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition"
            >
              View Integration Marketplace
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionsHero;
