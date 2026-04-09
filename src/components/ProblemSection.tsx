import { Layers, ShieldAlert, TrendingDown } from "lucide-react";

const problems = [
  {
    icon: Layers,
    title: "Fragmentation",
    text: "Managing 500+ farmers means juggling spreadsheets, WhatsApp, and notebooks. Data is scattered. Insights are hidden.",
  },
  {
    icon: ShieldAlert,
    title: "Compliance Risk",
    text: "Export requirements are tightening. One missed farmer record or quality issue can mean failed certification and lost market access.",
  },
  {
    icon: TrendingDown,
    title: "Margin Erosion",
    text: "Without visibility, waste goes undetected. Manual payments and inefficient communication with farmers cost you money every day.",
  },
];

const ProblemSection = () => {
  return (
    <section className="section-gray py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          The Challenge: Managing Agricultural Supply Chains{" "}
          <span className="gradient-primary-text">at Scale</span>
        </h2>
        <p className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto">
          Agribusinesses face growing complexity every day. Here are the three biggest pain points.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((p) => (
            <div
              key={p.title}
              className="bg-card rounded-xl p-8 shadow-sm border border-border hover:shadow-md transition group"
            >
              <div className="w-12 h-12 rounded-lg bg-secondary/15 flex items-center justify-center mb-5 group-hover:bg-secondary/25 transition">
                <p.icon size={24} className="text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{p.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
