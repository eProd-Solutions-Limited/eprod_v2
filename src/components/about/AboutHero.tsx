const AboutHero = () => {
  return (
    <section className="bg-background">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-secondary">
            About eProd
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-foreground">
            We Are The Financial Bridge{" "}
            <span className="gradient-primary-text">for African Agribusiness</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            We integrate end-to-end supply chain traceability with leading financial institutions to de-risk loans, unlock working capital, and power the growth of Africa's most ambitious agribusinesses.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
