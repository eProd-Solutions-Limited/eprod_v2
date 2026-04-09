"use client"
import { useState } from "react";

const CTASection = () => {
  const [form, setForm] = useState({ company: "", email: "", challenge: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert("Thank you! We'll be in touch soon.");
  };

  return (
    <section id="cta" className="gradient-primary py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary-foreground mb-4">
          Ready to Simplify Your Supply Chain?
        </h2>
        <p className="text-center text-primary-foreground/70 mb-12 max-w-xl mx-auto">
          Join 500+ agribusinesses already using eProd to transform their operations.
        </p>

        <div className="max-w-lg mx-auto bg-card rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Company Name</label>
              <input
                type="text"
                required
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                placeholder="Your company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Work Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Primary Challenge</label>
              <select
                value={form.challenge}
                onChange={(e) => setForm({ ...form, challenge: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
              >
                <option value="">Select a challenge</option>
                <option value="compliance">Compliance</option>
                <option value="efficiency">Efficiency</option>
                <option value="scaling">Scaling</option>
                <option value="other">Other</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-secondary py-3 text-sm font-bold text-secondary-foreground hover:brightness-110 transition shadow-md"
            >
              Get Started
            </button>
          </form>

          <div className="flex items-center justify-center gap-4 mt-6 text-sm">
            <a href="#" className="text-primary hover:underline font-medium">Schedule a Call</a>
            <span className="text-border">|</span>
            <a href="#" className="text-primary hover:underline font-medium">Download Case Study</a>
          </div>
        </div>

        <p className="text-center text-primary-foreground/60 text-sm mt-8">
          Join 500+ agribusinesses already using eProd
        </p>
      </div>
    </section>
  );
};

export default CTASection;
