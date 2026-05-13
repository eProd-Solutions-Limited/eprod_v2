import { MapPin, Cpu, Building2, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: MapPin,
    step: "Step 1",
    title: "Data Capture",
    location: "The Field",
    action: "Your field staff use the eProd mobile app to register farmers, map fields, record transactions, and conduct surveys.",
    dataPoints: "Farmer profiles, GPS coordinates, planting data, procurement records, loan repayments.",
    value: "Creates a rich, granular dataset at the source of the supply chain.",
  },
  {
    icon: Cpu,
    step: "Step 2",
    title: "Data Processing",
    location: "The Core ERP",
    action: "The data is synchronized with the Core ERP, where it is cleaned, validated, and aggregated.",
    dataPoints: "Farmer performance history, supply chain analytics, inventory levels, financial reports.",
    value: "Transforms raw data into actionable business intelligence.",
  },
  {
    icon: Building2,
    step: "Step 3",
    title: "Data Sharing",
    location: "The Integration Hub",
    action: "The processed data is securely shared with third-party systems via the Integration Hub.",
    dataPoints: "Bank-ready reports, credit scoring data, compliance documentation.",
    value: "Unlocks financial services, enables seamless partnerships, and ensures regulatory compliance.",
  },
];

const DataFlow = () => {
  return (
    <section className="section-gray py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">Data Flow</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
            Transforming Raw Data into{" "}
            <span className="gradient-primary-text">Bankable Insights</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            At the heart of the eProd platform is a powerful data engine that captures, processes, and transforms raw field data
            into the structured, verifiable insights that financial institutions require.
          </p>
        </div>

        <div className="relative">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-4 relative">
            {steps.map((s, i) => (
              <div key={s.title} className="relative">
                <div className="bg-card rounded-2xl p-7 border border-border h-full shadow-sm hover:shadow-lg transition">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                      <s.icon size={22} className="text-primary-foreground" />
                    </div>
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider">{s.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-1">{s.title}</h3>
                  <p className="text-sm font-semibold text-primary mb-4">{s.location}</p>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-semibold text-foreground mb-1">Action</p>
                      <p className="text-muted-foreground leading-relaxed">{s.action}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">Data Points</p>
                      <p className="text-muted-foreground leading-relaxed">{s.dataPoints}</p>
                    </div>
                    <div className="pt-3 border-t border-border">
                      <p className="font-semibold text-secondary">{s.value}</p>
                    </div>
                  </div>
                </div>

                {i < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-secondary items-center justify-center shadow-lg">
                    <ArrowRight size={16} className="text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataFlow;
