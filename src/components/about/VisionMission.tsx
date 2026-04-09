import { Eye, Target } from "lucide-react";

const VisionMission = () => {
  return (
    <section className="section-gray py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-card rounded-xl p-8 border border-border shadow-sm">
            <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-5">
              <Eye size={24} className="text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              To digitize and finance the arteries of African agriculture. We see a future where every agricultural transaction in Africa is transparent, traceable, and bankable—creating a single, interconnected ecosystem that empowers millions of smallholder farmers and fuels sustainable economic growth across the continent.
            </p>
          </div>

          <div className="bg-card rounded-xl p-8 border border-border shadow-sm">
            <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-5">
              <Target size={24} className="text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              To make every agricultural supply chain bankable. We transform supply chains from high-risk, opaque operations into low-risk, data-driven assets by providing a comprehensive AgFinTech platform that ensures compliance with standards like EUDR and GlobalGAP—and converts that compliance data into a verifiable credit score, unlocking unprecedented access to finance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
