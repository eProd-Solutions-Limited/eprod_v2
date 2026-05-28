import { Banknote, Calculator, Truck, BarChart3 } from "lucide-react";
import Image from "next/image";
import { CircleBackground } from '@/components/ui/CircleBackground';

type Partner = { name: string; logo: string }

const categories: { icon: React.ElementType; title: string; text: string; partners: Partner[] }[] = [
  {
    icon: Banknote,
    title: "Financial Services",
    text: "Connect to leading banks, mobile money providers, and insurance companies to unlock financial services for your farmers and your business.",
    partners: [
      { name: "I&M Bank",      logo: "/logos/integrations/im-bank.png" },
      { name: "KCB",          logo: "/logos/integrations/kcb.png" },
      { name: "V bank",          logo: "/logos/integrations/V-Bank.jpg" },
      { name: "Equity Bank",   logo: "/logos/integrations/equity-bank.png" },
      { name: "M-Pesa",        logo: "/logos/integrations/m-pesa.png" },
      { name: "Airtel Money",  logo: "/logos/integrations/airtel-money.png" },
    ],
  },
  {
    icon: Calculator,
    title: "ERP & Accounting",
    text: "Integrate with your existing ERP and accounting systems for seamless financial management.",
    partners: [
      { name: "SAP",        logo: "/logos/integrations/sap.png" },
      { name: "Oracle",     logo: "/logos/integrations/oracle.png" },
      { name: "QuickBooks", logo: "/logos/integrations/quickbooks.svg" },
      { name: "Xero",       logo: "/logos/integrations/xero.svg" },
      { name: "Sage",       logo: "/logos/integrations/sage.svg" },
      { name: "Tally",      logo: "/logos/integrations/tally.png" },
    ],
  },
  {
    icon: Truck,
    title: "Logistics and Supply Chain",
    text: "Connect to logistics platforms and comply with international standards to optimize your supply chain.",
    partners: [
      { name: "DFTG",          logo: "/logos/integrations/itc.svg" },
      { name: "WHISP",         logo: "/logos/integrations/whisp.png" },
      { name: "Cargo Ledger",  logo: "/logos/integrations/cargo-ledger.png" },
      { name: "Agrocares",  logo: "/logos/integrations/agrocares.jpeg" },
      { name: "Riceadvice",  logo: "/logos/integrations/riceadvice.jpeg" },
      { name: "WRI",  logo: "/logos/integrations/wri.jpeg" },

    ],
  },
  {
    icon: BarChart3,
    title: "Business Intelligence & Analytics",
    text: "Export your data to leading BI and analytics tools for advanced reporting and visualization.",
    partners: [
      { name: "Power BI",  logo: "/logos/integrations/power-bi.png" },
      { name: "Metabase",  logo: "/logos/integrations/metabase.png" },
    ],
  },
];

const Integrations = () => {
  return (
    <section id="integrations" className="section-gray py-20 relative overflow-hidden">
      <CircleBackground />
      <div className="container mx-auto px-4 relative z-10">
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

              <div className="flex flex-wrap gap-3 pt-4 border-t border-border mt-4">
                {cat.partners.map((partner) => (
                  <div
                    key={partner.name}
                    className="flex items-center justify-center px-3 py-2 h-14 w-32"
                    title={partner.name}
                  >
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={112}
                      height={40}
                      style={{ width: 'auto', height: '40px' }}
                      className="object-contain"
                    />
                  </div>
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
