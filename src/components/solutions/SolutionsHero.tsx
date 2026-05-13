import { ArrowRight, Layers } from "lucide-react";

const SolutionsHero = () => {
  return (
    <section className="relative overflow-hidden gradient-primary py-24 md:py-32">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-secondary blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-primary-foreground blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 mb-6">
            <Layers size={16} className="text-secondary" />
            <span className="text-sm font-medium text-primary-foreground">The eProd Platform</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-primary-foreground leading-tight mb-6">
            The Enterprise-Grade <span className="text-secondary">AgFinTech Engine</span> for Africa.
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed mb-8 max-w-3xl">
            eProd is the robust, secure, and scalable platform that powers the most ambitious agribusinesses in Africa.
            We provide the end-to-end infrastructure to digitize your supply chain, de-risk your operations, and unlock financial services.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
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
