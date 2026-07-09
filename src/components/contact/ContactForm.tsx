"use client"

import { useState } from "react"
import { MapPin, Phone, Mail, LinkedinIcon, FacebookIcon, YoutubeIcon } from "lucide-react"
import { gaEvents } from "@/lib/ga-events"
import { CircleBackground } from '@/components/ui/CircleBackground'
import { useI18n } from "@/lib/i18n/LanguageProvider"
import type { Dict } from "@/lib/i18n/dictionary"

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/eprod-solutions-limited/posts/?feedView=all",
    icon: LinkedinIcon,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/eProdSolutions",
    icon: FacebookIcon,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@eprodsolutionslimited3557",
    icon: YoutubeIcon,
  },
]

type FormState = {
  company: string
  email: string
  position: string
  valueChain: string
  interests: string[]
  phone: string
  challenge: string
  message: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const ALLOWED_CHALLENGES = ["compliance", "efficiency", "scaling", "other"]
const DANGEROUS_PATTERN = /<[^>]*>|javascript\s*:|on\w+\s*=/i

function validateForm(form: FormState, msg: Dict["contact"]["form"]["errors"]): FormErrors {
  const errors: FormErrors = {}
  const company = form.company.trim()
  const email = form.email.trim()
  const phone = form.phone.trim()
  const message = form.message.trim()

  if (!company) {
    errors.company = msg.companyRequired
  } else if (company.length > 100) {
    errors.company = msg.companyLong
  } else if (DANGEROUS_PATTERN.test(company)) {
    errors.company = msg.companyInvalid
  }

  if (!email) {
    errors.email = msg.emailRequired
  } else if (email.length > 254) {
    errors.email = msg.emailLong
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = msg.emailInvalid
  } else if (DANGEROUS_PATTERN.test(email)) {
    errors.email = msg.emailBadChars
  }

  if (!phone) {
    errors.phone = msg.phoneRequired
  } else if (!/^[+\d][\d\s\-(). ]{5,19}$/.test(phone)) {
    errors.phone = msg.phoneInvalid
  }

  if (!form.challenge || !ALLOWED_CHALLENGES.includes(form.challenge)) {
    errors.challenge = msg.challengeRequired
  }

  if (!message) {
    errors.message = msg.messageRequired
  } else if (message.length > 1000) {
    errors.message = msg.messageLong
  } else if (DANGEROUS_PATTERN.test(message)) {
    errors.message = msg.messageInvalid
  }

  return errors
}

const ContactForm = () => {
  const { t } = useI18n()
  const [form, setForm] = useState<FormState>({
    company: "",
    email: "",
    position: "",
    valueChain: "",
    interests: [],
    phone: "",
    challenge: "",
    message: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const clearError = (field: keyof FormState) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }))

  const toggleInterest = (value: string) =>
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(value)
        ? prev.interests.filter((i) => i !== value)
        : [...prev.interests, value],
    }))

  const inputBase =
    "w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition disabled:opacity-50"

  const fieldCls = (hasError?: string) =>
    `${inputBase} ${hasError ? "border-destructive" : "border-border"}`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateForm(form, t.contact.form.errors)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    setLoading(true)
    setStatus("idle")

    try {
      const res = await fetch("/api/send-cta-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: form.company.trim(),
          email: form.email.trim(),
          position: form.position.trim(),
          valueChain: form.valueChain,
          interests: form.interests,
          phone: form.phone.trim(),
          challenge: form.challenge,
          message: form.message.trim(),
          sourceSection: "contact_page",
        }),
      })

      if (res.ok) {
        gaEvents.contactFormSubmitted(form.company)
        setStatus("success")
        setForm({ company: "", email: "", position: "", valueChain: "", interests: [], phone: "", challenge: "", message: "" })
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative overflow-hidden py-16 bg-background">
      <CircleBackground />
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid md:grid-cols-[1fr_1.6fr] gap-12 items-start">

          {/* Left — Contact info */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-8">{t.contact.form.infoTitle}</h2>

            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-lighter flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Nairobi, Kenya</p>
                  <p className="text-sm text-muted-foreground">Nairobi, Kenya</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-lighter flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.contact.form.phoneLabel}</p>
                  <a
                    href="tel:+254112203982"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    +254 112 203 982
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-lighter flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.contact.form.emailLabel}</p>
                  <a
                    href="mailto:info@eprod-solutions.com"
                    className="text-sm text-primary hover:underline transition-colors"
                  >
                    info@eprod-solutions.com
                  </a>
                </div>
              </div>
            </div>

            {/* Map embed */}
            <div className="rounded-xl overflow-hidden border border-border mb-10">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=36.7794%2C-1.2250%2C36.7994%2C-1.2050&layer=mapnik&marker=-1.214994%2C36.789431"
                width="100%"
                height="220"
                style={{ display: "block", border: "none" }}
                loading="lazy"
                title="eProd office location"
              />
              <div className="bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground text-right">
                <a
                  href="https://www.openstreetmap.org/?mlat=-1.214994&mlon=36.789431#map=15/-1.214994/36.789431"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {t.contact.form.viewLargerMap}
                </a>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                {t.contact.form.connectWithUs}
              </p>
              <div className="flex gap-3">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-1">{t.contact.form.formTitle}</h2>
            <p className="text-sm text-muted-foreground mb-8">
              {t.contact.form.formSubtitle}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {t.contact.form.companyLabel} <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  disabled={loading}
                  placeholder={t.contact.form.companyPlaceholder}
                  value={form.company}
                  onChange={(e) => { setForm({ ...form, company: e.target.value }); clearError("company") }}
                  className={fieldCls(errors.company)}
                  maxLength={100}
                />
                {errors.company && <p className="mt-1 text-xs text-destructive">{errors.company}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {t.contact.form.workEmailLabel} <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    disabled={loading}
                    placeholder={t.contact.form.emailPlaceholder}
                    value={form.email}
                    onChange={(e) => { setForm({ ...form, email: e.target.value }); clearError("email") }}
                    className={fieldCls(errors.email)}
                    maxLength={254}
                  />
                  {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {t.contact.form.phoneFieldLabel} <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="tel"
                    disabled={loading}
                    placeholder={t.contact.form.phonePlaceholder}
                    value={form.phone}
                    onChange={(e) => { setForm({ ...form, phone: e.target.value }); clearError("phone") }}
                    className={fieldCls(errors.phone)}
                    maxLength={20}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {t.formShared.positionLabel}
                </label>
                <input
                  type="text"
                  disabled={loading}
                  placeholder={t.formShared.positionPlaceholder}
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  className={fieldCls()}
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {t.formShared.valueChainLabel}
                </label>
                <select
                  disabled={loading}
                  value={form.valueChain}
                  onChange={(e) => setForm({ ...form, valueChain: e.target.value })}
                  className={fieldCls()}
                >
                  <option value="">{t.formShared.valueChainSelect}</option>
                  {t.formShared.valueChains.map((vc) => (
                    <option key={vc.value} value={vc.value}>{vc.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t.formShared.interestsLabel}
                </label>
                <div className="grid sm:grid-cols-2 gap-2">
                  {t.formShared.interests.map((it) => (
                    <label key={it.value} className="flex items-center gap-2.5 text-sm text-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        disabled={loading}
                        checked={form.interests.includes(it.value)}
                        onChange={() => toggleInterest(it.value)}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
                      />
                      {it.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {t.contact.form.challengeLabel} <span className="text-destructive">*</span>
                </label>
                <select
                  disabled={loading}
                  value={form.challenge}
                  onChange={(e) => { setForm({ ...form, challenge: e.target.value }); clearError("challenge") }}
                  className={fieldCls(errors.challenge)}
                >
                  <option value="">{t.contact.form.challengeSelect}</option>
                  <option value="compliance">{t.contact.form.challengeCompliance}</option>
                  <option value="efficiency">{t.contact.form.challengeEfficiency}</option>
                  <option value="scaling">{t.contact.form.challengeScaling}</option>
                  <option value="other">{t.contact.form.challengeOther}</option>
                </select>
                {errors.challenge && <p className="mt-1 text-xs text-destructive">{errors.challenge}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {t.contact.form.messageLabel} <span className="text-destructive">*</span>
                </label>
                <textarea
                  disabled={loading}
                  rows={4}
                  placeholder={t.contact.form.messagePlaceholder}
                  value={form.message}
                  onChange={(e) => { setForm({ ...form, message: e.target.value }); clearError("message") }}
                  className={`${fieldCls(errors.message)} resize-none`}
                  maxLength={1000}
                />
                {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground hover:brightness-110 transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? t.contact.form.submitting : <>{t.contact.form.submit} <span aria-hidden>→</span></>}
              </button>

              {status === "success" && (
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm text-primary text-center">
                  {t.contact.form.success}
                </div>
              )}
              {status === "error" && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive text-center">
                  {t.contact.form.error}
                </div>
              )}

              <p className="text-xs text-muted-foreground text-center">
                {t.contact.form.privacyLead}{" "}
                <a href="#" className="text-primary hover:underline">
                  {t.contact.form.privacyLink}
                </a>
                .
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactForm
