import { Settings, Users, Link, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Settings,
    title: "Setup",
    time: "Week 1",
    text: "We configure eProd for your specific supply chain.",
  },
  {
    icon: Users,
    title: "Onboard",
    time: "Week 2-3",
    text: "Your team and farmers get trained on the platform.",
  },
  {
    icon: Link,
    title: "Integrate",
    time: "Week 3-4",
    text: "Connect existing systems. eProd becomes your central hub.",
  },
  {
    icon: TrendingUp,
    title: "Optimize",
    time: "Ongoing",
    text: "Monitor metrics and optimize operations with our support.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-14">
          Get Started in <span className="gradient-primary-text">4 Simple Steps</span>
        </h2>

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Progress line */}
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-border z-0">
            <div className="absolute inset-0 gradient-primary-horizontal rounded-full" style={{ opacity: 0.3 }} />
          </div>

          {steps.map((step, i) => (
            <div key={step.title} className="relative z-10 text-center">
              <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
                <step.icon size={32} className="text-primary-foreground" />
              </div>
              <span className="inline-block text-xs font-bold rounded-full bg-secondary/20 text-secondary px-3 py-1 mb-2">
                {step.time}
              </span>
              <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="inline-block rounded-full bg-secondary/15 px-6 py-3 text-secondary font-semibold text-sm">
            ⚡ Most customers see results within 30 days of launch.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
