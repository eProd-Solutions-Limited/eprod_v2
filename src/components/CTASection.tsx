"use client"
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { gaEvents } from "@/lib/ga-events";
import { useInView } from "@/hooks/useInView";
import { CircleBackground } from '@/components/ui/CircleBackground'
import { useI18n } from "@/lib/i18n/LanguageProvider";
import type { Dict } from "@/lib/i18n/dictionary";

const ALLOWED_CHALLENGES = ["compliance", "efficiency", "scaling", "other"];
const DANGEROUS_PATTERN = /<[^>]*>|javascript\s*:|on\w+\s*=/i;

type FormState = {
  company: string;
  email: string;
  contactName: string;
  position: string;
  numberOfFarmers: string;
  valueChain: string;
  requestFor: string;
  requestForOther: string;
  phone: string;
  challenge: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMPTY_FORM: FormState = {
  company: "",
  email: "",
  contactName: "",
  position: "",
  numberOfFarmers: "",
  valueChain: "",
  requestFor: "",
  requestForOther: "",
  phone: "",
  challenge: "",
  message: "",
};

function validateForm(form: FormState, msg: Dict["cta"]["errors"]): FormErrors {
  const errors: FormErrors = {};
  const company = form.company.trim();
  const email = form.email.trim();
  const phone = form.phone.trim();
  const message = form.message.trim();

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

  if (!phone) {
    errors.phone = msg.phoneRequired;
  } else if (!/^[+\d][\d\s\-(). ]{5,19}$/.test(phone)) {
    errors.phone = msg.phoneInvalid;
  }

  if (!form.challenge || !ALLOWED_CHALLENGES.includes(form.challenge)) {
    errors.challenge = msg.challengeRequired;
  }

  if (!message) {
    errors.message = msg.messageRequired;
  } else if (message.length > 1000) {
    errors.message = msg.messageLong;
  } else if (DANGEROUS_PATTERN.test(message)) {
    errors.message = msg.messageInvalid;
  }

  return errors;
}

const CTASection = () => {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { ref: sectionRef, inView: sectionInView } = useInView({ threshold: 0.3 })

  useEffect(() => {
    if (sectionInView) gaEvents.sectionViewed('cta')
  }, [sectionInView])

  // Auto-open when someone arrives via a "Request a Demo" link (href="#cta").
  useEffect(() => {
    const openIfTargeted = () => {
      if (window.location.hash === '#cta') setExpanded(true)
    }
    openIfTargeted()
    window.addEventListener('hashchange', openIfTargeted)
    return () => window.removeEventListener('hashchange', openIfTargeted)
  }, [])

  const clearError = (field: keyof FormState) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

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
          contactName: form.contactName.trim(),
          position: form.position.trim(),
          numberOfFarmers: form.numberOfFarmers,
          valueChain: form.valueChain,
          requestFor: form.requestFor,
          requestForOther: form.requestForOther.trim(),
          phone: form.phone.trim(),
          challenge: form.challenge,
          message: form.message.trim(),
          sourceSection: "home_cta",
        }),
      });

      if (res.ok) {
        gaEvents.formSubmitted("cta_form", form.company);
        setMessage(t.cta.success);
        setForm(EMPTY_FORM);
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

        <div className="max-w-lg mx-auto">
          {!expanded && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setExpanded(true)}
                aria-expanded={expanded}
                className="group relative inline-flex items-center justify-center rounded-full bg-secondary px-8 py-4 text-base font-bold text-secondary-foreground shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                <span className="absolute inset-0 rounded-full bg-secondary opacity-40 animate-ping motion-reduce:animate-none" aria-hidden="true" />
                <span className="relative flex items-center gap-3">
                  {t.cta.expandPrompt}
                  <ChevronDown size={20} className="animate-bounce motion-reduce:animate-none" />
                </span>
              </button>
              <p className="text-primary-foreground/60 text-xs mt-3">{t.cta.expandHint}</p>
            </div>
          )}

          <div
            className={`grid transition-all duration-500 ease-out ${
              expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden" inert={!expanded}>
              <div className="bg-card rounded-2xl p-8 shadow-2xl">
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
              <label className="block text-sm font-medium text-foreground mb-1">{t.formShared.contactNameLabel}</label>
              <input
                type="text"
                disabled={loading}
                value={form.contactName}
                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition disabled:opacity-50"
                placeholder={t.formShared.contactNamePlaceholder}
                maxLength={100}
              />
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
              <label className="block text-sm font-medium text-foreground mb-1">{t.formShared.positionLabel}</label>
              <input
                type="text"
                disabled={loading}
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition disabled:opacity-50"
                placeholder={t.formShared.positionPlaceholder}
                maxLength={100}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">{t.formShared.farmersLabel}</label>
              <select
                disabled={loading}
                value={form.numberOfFarmers}
                onChange={(e) => setForm({ ...form, numberOfFarmers: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition disabled:opacity-50"
              >
                <option value="">{t.formShared.farmersSelect}</option>
                {t.formShared.farmers.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">{t.formShared.valueChainLabel}</label>
              <select
                disabled={loading}
                value={form.valueChain}
                onChange={(e) => setForm({ ...form, valueChain: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition disabled:opacity-50"
              >
                <option value="">{t.formShared.valueChainSelect}</option>
                {t.formShared.valueChains.map((vc) => (
                  <option key={vc.value} value={vc.value}>{vc.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">{t.cta.phoneLabel}</label>
              <input
                type="tel"
                disabled={loading}
                value={form.phone}
                onChange={(e) => { setForm({ ...form, phone: e.target.value }); clearError("phone") }}
                className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition disabled:opacity-50 ${errors.phone ? "border-destructive" : "border-border"}`}
                placeholder={t.cta.phonePlaceholder}
                maxLength={20}
              />
              {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">{t.formShared.requestForLabel}</label>
              <select
                disabled={loading}
                value={form.requestFor}
                onChange={(e) => setForm({ ...form, requestFor: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition disabled:opacity-50"
              >
                <option value="">{t.formShared.requestForSelect}</option>
                {t.formShared.requestForOptions.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              {form.requestFor === "other" && (
                <input
                  type="text"
                  disabled={loading}
                  value={form.requestForOther}
                  onChange={(e) => setForm({ ...form, requestForOther: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition disabled:opacity-50"
                  placeholder={t.formShared.requestForOtherPlaceholder}
                  maxLength={200}
                  aria-label={t.formShared.requestForOtherLabel}
                />
              )}
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
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">{t.cta.messageLabel}</label>
              <textarea
                disabled={loading}
                rows={3}
                value={form.message}
                onChange={(e) => { setForm({ ...form, message: e.target.value }); clearError("message") }}
                className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition disabled:opacity-50 resize-none ${errors.message ? "border-destructive" : "border-border"}`}
                placeholder={t.cta.messagePlaceholder}
                maxLength={1000}
              />
              {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
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
            </div>
          </div>
        </div>

        <p className="text-center text-primary-foreground/60 text-sm mt-8">
          {t.cta.footerNote}
        </p>
      </div>
    </section>
  );
};

export default CTASection;