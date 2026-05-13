import { ArrowRight, Code2, Puzzle } from "lucide-react";

const SolutionsCTA = () => {
  return (
    <section id="cta" className="gradient-primary py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-secondary blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-5 leading-tight">
            Ready to Build Your <span className="text-secondary">AgFinTech Ecosystem?</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div className="bg-card rounded-2xl p-8 shadow-2xl">
            <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-5">
              <Code2 size={26} className="text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Request a Technical Deep Dive</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Schedule a call with our solutions architects to discuss your specific technical requirements and see the eProd platform in action.
            </p>
            <a
              href="/#cta"
              className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground hover:brightness-110 transition"
            >
              Request a Deep Dive
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="bg-primary-foreground/5 backdrop-blur border border-primary-foreground/20 rounded-2xl p-8">
            <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-5">
              <Puzzle size={26} className="text-secondary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-primary-foreground mb-3">Explore Our Integration Marketplace</h3>
            <p className="text-primary-foreground/80 leading-relaxed mb-6">
              Browse our growing list of pre-built integrations and discover how you can connect eProd to the services you already use.
            </p>
            <a
              href="#integrations"
              className="inline-flex items-center gap-2 rounded-full border-2 border-primary-foreground/40 px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition"
            >
              Explore Integrations
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionsCTA;
