import { Users, Building2, Globe, Layers, ShieldCheck } from "lucide-react";

const metrics = [
  { icon: Users, value: "1,000,000+", label: "Farmers Managed", description: "on our platform" },
  { icon: Building2, value: "250+", label: "Clients", description: "agribusinesses & cooperatives" },
  { icon: Globe, value: "20+", label: "Countries", description: "across Africa" },
  { icon: Layers, value: "30+", label: "Sectors", description: "served" },
  { icon: ShieldCheck, value: "95%+", label: "Retention Rate", description: "deep product-market fit" },
];

const MarketLeadership = () => {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Market Leadership{" "}
            <span className="gradient-primary-text">by the Numbers</span>
          </h2>
          <p className="text-muted-foreground text-base">
            We are the clear market leader in supply chain management for smallholder agriculture in Sub-Saharan Africa. Our leadership is not a claim; it is a fact.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
          {metrics.map((m) => (
            <div key={m.label} className="text-center group">
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <m.icon size={24} className="text-primary-foreground" />
              </div>
              <div className="text-3xl md:text-4xl font-black text-primary">{m.value}</div>
              <div className="text-sm font-semibold text-foreground mt-1">{m.label}</div>
              <div className="text-xs text-muted-foreground">{m.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarketLeadership;
