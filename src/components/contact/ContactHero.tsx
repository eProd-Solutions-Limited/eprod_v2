const ContactHero = () => {
  return (
    <section className="bg-primary-lighter py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <nav className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <span className="text-border">›</span>
          <span className="text-foreground font-medium">Contact</span>
        </nav>
        <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">
          Contact Us
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Get in touch with our team to learn how eProd can transform your supply chain, ensure compliance, and unlock capital.
        </p>
      </div>
    </section>
  );
};

export default ContactHero;
