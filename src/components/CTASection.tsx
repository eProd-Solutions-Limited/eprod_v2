"use client"
import { useState, useEffect } from "react";
import { gaEvents } from "@/lib/ga-events";
import { useInView } from "@/hooks/useInView";
import { CircleBackground } from '@/components/ui/CircleBackground'
import { useI18n } from "@/lib/i18n/LanguageProvider";
import type { Dict } from "@/lib/i18n/dictionary";

const ALLOWED_CHALLENGES = ["compliance", "efficiency", "scaling", "other"];
const DANGEROUS_PATTERN = /<[^>]*>|javascript\s*:|on\w+\s*=/i;

function validateForm(
  form: { company: string; email: string; challenge: string },
  msg: Dict["cta"]["errors"],
) {
  const errors: { company?: string; email?: string; challenge?: string } = {};
  const company = form.company.trim();
  const email = form.email.trim();

  if (!company) {
    errors.company = msg.companyRequired;
  } else if (company.length > 100) {
    errors.company = msg.companyLong;
  } else if (DANGEROUS_PATTERN.test(company)) {
    errors.company = msg.companyInvalid;
  }

  if (!email) {
    errors.email = msg.emailRequired;
  } else if (email.length > 254) {
    errors.email = msg.emailLong;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = msg.emailInvalid;
  } else if (DANGEROUS_PATTERN.test(email)) {
    errors.email = msg.emailBadChars;
  }

  if (!form.challenge || !ALLOWED_CHALLENGES.includes(form.challenge)) {
    errors.challenge = msg.challengeRequired;
  }

  return errors;
}

const CTASection = () => {
  const { t } = useI18n();
  const [form, setForm] = useState({ company: "", email: "", challenge: "" });
  const [errors, setErrors] = useState<{ company?: string; email?: string; challenge?: string }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { ref: sectionRef, inView: sectionInView } = useInView({ threshold: 0.3 })

  useEffect(() => {
    if (sectionInView) gaEvents.sectionViewed('cta')
  }, [sectionInView])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(form, t.cta.errors);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/send-cta-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: form.company.trim(),
          email: form.email.trim(),
          challenge: form.challenge,
          sourceSection: "home_cta",
        }),
      });

      if (res.ok) {
        gaEvents.formSubmitted("cta_form", form.company);
        setMessage(t.cta.success);
        setForm({ company: "", email: "", challenge: "" });
      } else {
        setMessage(t.cta.error);
      }
    } catch (error) {
      setMessage(t.cta.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="cta" className="gradient-primary py-20 relative overflow-hidden" ref={sectionRef}>
      {/* White corner scoop — sits on top of gradient so no color mismatch with FAQ above */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-16 z-1"
        aria-hidden="true"
        style={{ backgroundColor: 'hsl(0 0% 100%)', borderRadius: '0 0 0 60px' }}
      />
      <CircleBackground variant="dark" />
      {/* Static concentric rings centred in background */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="absolute h-[300px] w-[300px] rounded-full border border-white/[0.07]" />
        <div className="absolute h-[200px] w-[200px] rounded-full border border-white/[0.07]" />
        <div className="absolute h-[120px] w-[120px] rounded-full border border-white/[0.12]" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary-foreground mb-4">
          {t.cta.heading}
        </h2>
        <p className="text-center text-primary-foreground/70 mb-12 max-w-xl mx-auto">
          {t.cta.subtitle}
        </p>

        <div className="max-w-lg mx-auto bg-card rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">{t.cta.companyLabel}</label>
              <input
                type="text"
                disabled={loading}
                value={form.company}
                onChange={(e) => { setForm({ ...form, company: e.target.value }); setErrors((prev) => ({ ...prev, company: undefined })); }}
                className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition disabled:opacity-50 ${errors.company ? "border-destructive" : "border-border"}`}
                placeholder={t.cta.companyPlaceholder}
                maxLength={100}
              />
              {errors.company && <p className="mt-1 text-xs text-destructive">{errors.company}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">{t.cta.emailLabel}</label>
              <input
                type="email"
                disabled={loading}
                value={form.email}
                onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors((prev) => ({ ...prev, email: undefined })); }}
                className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition disabled:opacity-50 ${errors.email ? "border-destructive" : "border-border"}`}
                placeholder={t.cta.emailPlaceholder}
                maxLength={254}
              />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">{t.cta.challengeLabel}</label>
              <select
                disabled={loading}
                value={form.challenge}
                onChange={(e) => { setForm({ ...form, challenge: e.target.value }); setErrors((prev) => ({ ...prev, challenge: undefined })); }}
                className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition disabled:opacity-50 ${errors.challenge ? "border-destructive" : "border-border"}`}
              >
                <option value="">{t.cta.challengeSelect}</option>
                <option value="compliance">{t.cta.challengeCompliance}</option>
                <option value="efficiency">{t.cta.challengeEfficiency}</option>
                <option value="scaling">{t.cta.challengeScaling}</option>
                <option value="other">{t.cta.challengeOther}</option>
              </select>
              {errors.challenge && <p className="mt-1 text-xs text-destructive">{errors.challenge}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-secondary py-3 text-sm font-bold text-secondary-foreground hover:brightness-110 transition shadow-md disabled:opacity-50"
            >
              {loading ? t.cta.submitting : t.cta.submit}
            </button>
          </form>

          {message && (
            <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm text-primary text-center">
              {message}
            </div>
          )}

          
        </div>

        <p className="text-center text-primary-foreground/60 text-sm mt-8">
          {t.cta.footerNote}
        </p>
      </div>
    </section>
  );
};

export default CTASection;