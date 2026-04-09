import { Globe, Smartphone, Tag, Trophy, Check, X } from "lucide-react";

const differentiators = [
  {
    icon: Globe,
    title: "Built for Emerging Markets",
    text: "Works with low connectivity. Local support.",
  },
  {
    icon: Smartphone,
    title: "Farmer-Centric",
    text: "We empower farmers with a simple mobile app. They are partners, not data sources.",
  },
  {
    icon: Tag,
    title: "Affordable & Accessible",
    text: "Starts at a fraction of enterprise cost. Designed for SMEs.",
  },
  {
    icon: Trophy,
    title: "Proven Track Record",
    text: "20+ years, 500+ customers, 50,000+ farmers. We've solved this at scale.",
  },
];

const comparisonRows = [
  { feature: "Built for Supply Chain", eprod: true, enterprise: true, generic: false },
  { feature: "Affordable", eprod: true, enterprise: false, generic: true },
  { feature: "Emerging Markets", eprod: true, enterprise: false, generic: false },
  { feature: "Farmer-Centric", eprod: true, enterprise: false, generic: true },
  { feature: "Proven in Africa", eprod: true, enterprise: false, generic: false },
];

const DifferentiationSection = () => {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-14">
          Why eProd <span className="gradient-primary-text">Stands Out</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {differentiators.map((d) => (
            <div key={d.title} className="text-center p-6">
              <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                <d.icon size={24} className="text-primary-foreground" />
              </div>
              <h3 className="font-bold text-foreground mb-2 text-sm md:text-base">{d.title}</h3>
              <p className="text-sm text-muted-foreground">{d.text}</p>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="max-w-3xl mx-auto overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Feature</th>
                <th className="text-center py-3 px-4 font-bold text-primary-foreground gradient-primary rounded-t-lg">eProd</th>
                <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Enterprise Platform</th>
                <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Generic Farm Software</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="border-b border-border">
                  <td className="py-3 px-4 font-medium text-foreground">{row.feature}</td>
                  <td className="py-3 px-4 text-center bg-primary-lighter">
                    {row.eprod ? <Check size={18} className="text-primary inline" /> : <X size={18} className="text-destructive inline" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.enterprise ? <Check size={18} className="text-primary inline" /> : <X size={18} className="text-destructive inline" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.generic ? <Check size={18} className="text-primary inline" /> : <X size={18} className="text-destructive inline" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default DifferentiationSection;
