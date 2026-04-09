import { Landmark } from "lucide-react";

const partners = ["I&M Bank", "NCBA", "Equity Bank"];

const BankPartnersAbout = () => {
  return (
    <section className="section-gray py-20">
      <div className="container mx-auto px-4 text-center">
        <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center mx-auto mb-5">
          <Landmark size={28} className="text-primary-foreground" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Trusted by Africa's{" "}
          <span className="gradient-primary-text">Leading Financial Institutions</span>
        </h2>
        <p className="text-muted-foreground text-base max-w-2xl mx-auto mb-12">
          Our AgFinTech model is not theoretical; it is operational and proven. We have active, integrated partnerships with some of East Africa's most respected commercial banks. They trust our data to de-risk their agricultural lending portfolios.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 max-w-2xl mx-auto">
          {partners.map((name) => (
            <div
              key={name}
              className="px-8 py-4 rounded-xl bg-card border border-border text-lg font-bold text-primary hover:shadow-md transition"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BankPartnersAbout;
