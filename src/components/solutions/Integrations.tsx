import { Banknote, Calculator, Truck, BarChart3 } from "lucide-react";

const categories = [
  {
    icon: Banknote,
    title: "Financial Services",
    text: "Connect to leading banks, mobile money providers, and insurance companies to unlock financial services for your farmers and your business.",
    examples: ["I&M Bank", "NCBA", "Equity Bank", "M-Pesa", "Airtel Money"],
  },
  {
    icon: Calculator,
    title: "ERP & Accounting",
    text: "Integrate with your existing ERP and accounting systems for seamless financial management.",
    examples: ["SAP", "Oracle", "QuickBooks", "Xero", "Sage"],
  },
  {
    icon: Truck,
    title: "Logistics & Warehousing",
    text: "Connect to logistics platforms and warehouse management systems to optimize your supply chain.",
    examples: ["Lori Systems", "Sendy", "Twiga", "WMS Providers"],
  },
  {
    icon: BarChart3,
    title: "Business Intelligence & Analytics",
    text: "Export your data to leading BI and analytics tools for advanced reporting and visualization.",
    examples: ["Power BI", "Tableau", "Looker", "Google Data Studio"],
  },
];

const Integrations = () => {
  return (
    <section id="integrations" className="section-gray py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">Integrations</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
            Seamlessly Connect to the Services{" "}
            <span className="gradient-primary-text">that Power Your Business</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            The eProd platform is the central hub of your digital ecosystem. Connect to a wide range of third-party services
            for a single, unified view of your operation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl transition group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                  <cat.icon size={22} className="text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{cat.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{cat.text}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-border mt-4">
                {cat.examples.map((ex) => (
                  <span
                    key={ex}
                    className="px-3 py-1 rounded-full bg-primary-lighter text-primary text-xs font-semibold"
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Integrations;
