import { ShieldCheck, Landmark, TrendingUp, Handshake } from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Verified Farmer Data",
    text: "Every farmer profile, transaction, and harvest is digitally recorded—giving lenders confidence in borrower credibility.",
  },
  {
    icon: Landmark,
    title: "Bank-Ready Reporting",
    text: "eProd generates audit-grade reports that meet financial institution requirements for agricultural lending.",
  },
  {
    icon: TrendingUp,
    title: "Reduced Default Risk",
    text: "Real-time supply chain visibility helps banks assess risk accurately, leading to better loan terms for agribusinesses.",
  },
  {
    icon: Handshake,
    title: "Partnership Ecosystem",
    text: "We work with leading banks and microfinance institutions across Africa to unlock capital for smallholder supply chains.",
  },
];

const partners = [
  "KCB Bank",
  "Equity Bank",
  "Stanbic Bank",
  "NCBA",
  "Cooperative Bank",
  "I&M Bank",
];

const BankPartnershipsSection = () => {
  return (
    <section className="section-gray py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          De-Risk Lending.{" "}
          <span className="gradient-primary-text">Unlock Capital.</span>
        </h2>
        <p className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto">
          eProd bridges the gap between agribusinesses and financial institutions by providing verified, real-time supply chain data that de-risks agricultural loans.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition group"
            >
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                <b.icon size={24} className="text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.text}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-muted-foreground mb-6 font-medium uppercase tracking-wider">
            Trusted by Leading Financial Institutions
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {partners.map((name) => (
              <div
                key={name}
                className="px-6 py-3 rounded-lg bg-card border border-border text-sm font-semibold text-muted-foreground opacity-60 hover:opacity-100 transition"
              >
                {name}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 max-w-2xl mx-auto bg-card border border-secondary/30 rounded-xl p-8 text-center">
          <p className="text-lg font-bold text-foreground mb-2">
            "eProd's data platform gave us the confidence to extend credit to 200+ agribusinesses we previously considered too risky."
          </p>
          <p className="text-sm text-muted-foreground">
            — Agricultural Lending Director, Leading East African Bank
          </p>
        </div>
      </div>
    </section>
  );
};

export default BankPartnershipsSection;
