import { Database, ClipboardCheck, BarChart3 } from "lucide-react";

const solutions = [
  {
    icon: Database,
    title: "Unified Data Management",
    text: "One platform for farmer profiles, communication, and operations. All your data in one place. Always accessible.",
    outcome: "No more spreadsheets. No more lost information.",
  },
  {
    icon: ClipboardCheck,
    title: "Built-In Compliance",
    text: "Designed for export certification and traceability. Track every farmer, every transaction, every quality metric.",
    outcome: "Meet regulations confidently. Prove compliance instantly.",
  },
  {
    icon: BarChart3,
    title: "Operational Efficiency",
    text: "Automate farmer payments, quality-based incentives, and communication. Reduce manual work.",
    outcome: "Aim for 30% waste reduction. Improve margins.",
  },
];

const SolutionSection = () => {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          Introducing eProd: The{" "}
          <span className="gradient-primary-text">System of Record</span> for Your Supply Chain
        </h2>
        <p className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto">
          A purpose-built platform that turns chaos into clarity.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {solutions.map((s, i) => (
            <div
              key={s.title}
              className="relative bg-card rounded-xl p-8 shadow-sm border border-border hover:shadow-md transition group overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 gradient-primary-horizontal opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-5">
                <s.icon size={24} className="text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{s.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">{s.text}</p>
              <p className="text-sm font-semibold text-primary">{s.outcome}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
