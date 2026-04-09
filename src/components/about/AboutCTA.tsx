import { ArrowRight } from "lucide-react";

const AboutCTA = () => {
  return (
    <section className="gradient-primary py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
          Join Us in Building the Future of African Agriculture
        </h2>
        <p className="text-primary-foreground/70 text-base max-w-2xl mx-auto mb-8">
          We are more than a software company. We are a strategic partner, a market leader, and a team of dedicated experts committed to your success. Whether you are an agribusiness, a financial institution, or a development partner—we invite you to join us.
        </p>
        <a
          href="#cta"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-8 py-3.5 text-base font-bold text-secondary-foreground hover:brightness-110 transition shadow-lg"
        >
          Schedule a Strategic Consultation
          <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
};

export default AboutCTA;
