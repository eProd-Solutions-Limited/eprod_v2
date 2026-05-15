import Image from "next/image";

const VisionMission = () => {
  return (
    <section className="section-gray py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-8 max-w-5xl mx-auto">
          <div className="relative w-full h-72 rounded-xl overflow-hidden">
            <Image
              src="/logos/integrations/about-mission.jpeg"
              alt="eProd vision and mission"
              fill
              className="object-cover"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl p-8 border border-border shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                To digitize and finance the arteries of African agriculture. We see a future where every agricultural transaction in Africa is transparent, traceable, and bankable—creating a single, interconnected ecosystem that empowers millions of smallholder farmers and fuels sustainable economic growth across the continent.
              </p>
            </div>

            <div className="bg-card rounded-xl p-8 border border-border shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                To make every agricultural supply chain bankable. We transform supply chains from high-risk, opaque operations into low-risk, data-driven assets by providing a comprehensive AgFinTech platform that ensures compliance with standards like EUDR and GlobalGAP—and converts that compliance data into a verifiable credit score, unlocking unprecedented access to finance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
