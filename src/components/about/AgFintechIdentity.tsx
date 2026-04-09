import { CheckCircle, XCircle } from "lucide-react";

const comparisons = [
  {
    eprod: "Data as a Financial Asset: We turn compliance data into a bankable credit score.",
    traditional: "Data as an Operational Record: Data is used for reporting and traceability only.",
  },
  {
    eprod: "Unlocking Capital: Our platform de-risks lending, enabling banks to finance aggregators.",
    traditional: "Managing Operations: The focus is on efficiency and cost savings.",
  },
  {
    eprod: "Ecosystem Integration: We connect farmers, aggregators, and banks in a single, seamless loop.",
    traditional: "Siloed Systems: Finance and operations remain separate and disconnected.",
  },
  {
    eprod: "Strategic Partnership: We are a partner in our clients' financial growth and strategic positioning.",
    traditional: "Vendor Relationship: We are a supplier of operational software.",
  },
];

const AgFintechIdentity = () => {
  return (
    <section className="section-gray py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            We Are an AgFinTech Platform,{" "}
            <span className="gradient-primary-text">Not Just a SaaS Company</span>
          </h2>
          <p className="text-muted-foreground text-base">
            While others provide software, we provide a new business model. This is the fundamental distinction that defines our value and our partnership with clients.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="gradient-primary rounded-t-xl md:rounded-tl-xl md:rounded-tr-none px-6 py-3">
              <p className="text-sm font-bold text-primary-foreground uppercase tracking-wider">Our Model: The Financial Bridge</p>
            </div>
            <div className="bg-muted rounded-tr-xl px-6 py-3 hidden md:block">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Traditional Model: The Operational Tool</p>
            </div>
          </div>

          <div className="space-y-3">
            {comparisons.map((row, i) => (
              <div key={i} className="grid md:grid-cols-2 gap-3">
                <div className="bg-card border border-primary/20 rounded-xl p-5 flex items-start gap-3">
                  <CheckCircle size={20} className="text-secondary mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground leading-relaxed">{row.eprod}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-5 flex items-start gap-3">
                  <XCircle size={20} className="text-muted-foreground/40 mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{row.traditional}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-base font-semibold text-foreground">
              This distinction is our core competitive advantage. It is why we are the chosen partner for businesses looking not just to operate, but to{" "}
              <span className="gradient-primary-text font-bold">scale</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgFintechIdentity;
