import { Server, Smartphone, Network, Check } from "lucide-react";

const pillars = [
  {
    icon: Server,
    label: "Pillar 1",
    title: "The Core ERP",
    description: "The central nervous system of your operation. The Core ERP manages all your data, workflows, and business logic in a secure, centralized database.",
    features: [
      "Multi-tenant architecture for data isolation and security",
      "Scalable infrastructure to grow with your business",
      "Robust user and role management for granular access control",
    ],
  },
  {
    icon: Smartphone,
    label: "Pillar 2",
    title: "The Mobile Front-End",
    description: "Your eyes and ears in the field. Our offline-first mobile app empowers your field staff to capture data, manage farmers, and execute transactions, even in the most remote locations.",
    features: [
      "Offline-first functionality for seamless operation without connectivity",
      "Real-time data synchronization when a connection is available",
      "Intuitive, user-friendly interface for rapid adoption",
    ],
  },
  {
    icon: Network,
    label: "Pillar 3",
    title: "The Integration Hub",
    description: "Your bridge to the digital ecosystem. The Integration Hub connects your eProd instance to a world of third-party services, from financial institutions to logistics providers.",
    features: [
      "RESTful API for custom integrations",
      "Pre-built connectors for leading financial institutions and mobile money providers",
      "Webhooks for real-time data exchange with other systems",
    ],
  },
];

const PlatformArchitecture = () => {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">Platform Architecture</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
            An End-to-End Platform to Power Your{" "}
            <span className="gradient-primary-text">Entire Value Chain</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            The eProd platform is a comprehensive, multi-layered ecosystem designed to handle the complexities of African agribusiness.
            Our architecture is built on three core pillars.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => (
            <div
              key={pillar.title}
              className="relative bg-card rounded-2xl p-8 border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="absolute top-0 left-0 right-0 h-1 gradient-primary-horizontal rounded-t-2xl" />
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center">
                  <pillar.icon size={26} className="text-primary-foreground" />
                </div>
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">{pillar.label}</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">{pillar.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">{pillar.description}</p>
              <ul className="space-y-2">
                {pillar.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <Check size={16} className="text-secondary mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformArchitecture;
