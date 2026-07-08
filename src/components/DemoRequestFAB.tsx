"use client"

import { useState, useEffect, useCallback } from "react"
import { X, CalendarCheck } from "lucide-react"
import { gaEvents } from "@/lib/ga-events"
import { useI18n } from "@/lib/i18n/LanguageProvider"
import type { Dict } from "@/lib/i18n/dictionary"

type FormState = {
  company: string
  email: string
  phone: string
  challenge: string
  message: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const EMPTY_FORM: FormState = {
  company: "",
  email: "",
  phone: "",
  challenge: "",
  message: "",
}

const ALLOWED_CHALLENGES = ["compliance", "efficiency", "scaling", "other"]
const DANGEROUS_PATTERN = /<[^>]*>|javascript\s*:|on\w+\s*=/i

function validateForm(form: FormState, msg: Dict["fab"]["errors"]): FormErrors {
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

const inputBase =
  "w-full rounded-full bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition disabled:opacity-50 border"

const fieldCls = (hasError?: string) =>
  `${inputBase} ${hasError ? "border-destructive" : "border-border"}`

export function DemoRequestFAB() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const close = useCallback(() => {
    setOpen(false)
    setStatus("idle")
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close()
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, close])

  const clearError = (field: keyof FormState) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateForm(form, t.fab.errors)
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
          phone: form.phone.trim(),
          challenge: form.challenge,
          message: form.message.trim(),
          sourceSection: "demo_request_fab",
        }),
      })

      if (res.ok) {
        gaEvents.demoRequestSubmitted(form.company)
        setStatus("success")
        setForm(EMPTY_FORM)
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
    <>
      {/* FAB */}
      <button
        onClick={() => { gaEvents.demoRequestClicked('fab'); setOpen(true) }}
        aria-label="Request a Demo"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-secondary px-5 py-3.5 text-sm font-bold text-secondary-foreground shadow-lg hover:brightness-105 active:scale-95 transition-all duration-150"
      >
        <CalendarCheck size={18} strokeWidth={2.5} />
        <span className="hidden sm:inline">{t.fab.contactUs}</span>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          {/* Dialog */}
          <div className="relative w-full max-w-lg bg-card rounded-3xl border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-border">
              <div>
                <h2 className="text-xl font-bold text-foreground">{t.fab.contactUs}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {t.fab.dialogSubtitle}
                </p>
              </div>
              <button
                onClick={close}
                aria-label={t.fab.close}
                className="ml-4 mt-0.5 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <div className="px-6 py-5 overflow-y-auto max-h-[70vh]">
              {status === "success" ? (
                <div className="py-10 flex flex-col items-center gap-3 text-center">
                  <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center">
                    <CalendarCheck size={28} className="text-secondary-foreground" strokeWidth={2} />
                  </div>
                  <p className="font-semibold text-foreground">{t.fab.successTitle}</p>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    {t.fab.successText}
                  </p>
                  <button
                    onClick={close}
                    className="mt-2 text-sm font-medium text-primary hover:underline"
                  >
                    {t.fab.close}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t.fab.companyLabel} <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      disabled={loading}
                      placeholder={t.fab.companyPlaceholder}
                      value={form.company}
                      onChange={(e) => { setForm({ ...form, company: e.target.value }); clearError("company") }}
                      className={fieldCls(errors.company)}
                      maxLength={100}
                    />
                    {errors.company && <p className="mt-1 text-xs text-destructive">{errors.company}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        {t.fab.emailLabel} <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="email"
                        disabled={loading}
                        placeholder={t.fab.emailPlaceholder}
                        value={form.email}
                        onChange={(e) => { setForm({ ...form, email: e.target.value }); clearError("email") }}
                        className={fieldCls(errors.email)}
                        maxLength={254}
                      />
                      {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        {t.fab.phoneLabel} <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="tel"
                        disabled={loading}
                        placeholder={t.fab.phonePlaceholder}
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
                      {t.fab.challengeLabel} <span className="text-destructive">*</span>
                    </label>
                    <select
                      disabled={loading}
                      value={form.challenge}
                      onChange={(e) => { setForm({ ...form, challenge: e.target.value }); clearError("challenge") }}
                      className={fieldCls(errors.challenge)}
                    >
                      <option value="">{t.fab.challengeSelect}</option>
                      <option value="compliance">{t.fab.challengeCompliance}</option>
                      <option value="efficiency">{t.fab.challengeEfficiency}</option>
                      <option value="scaling">{t.fab.challengeScaling}</option>
                      <option value="other">{t.fab.challengeOther}</option>
                    </select>
                    {errors.challenge && <p className="mt-1 text-xs text-destructive">{errors.challenge}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t.fab.messageLabel} <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      disabled={loading}
                      rows={3}
                      placeholder={t.fab.messagePlaceholder}
                      value={form.message}
                      onChange={(e) => { setForm({ ...form, message: e.target.value }); clearError("message") }}
                      className={`${fieldCls(errors.message)} resize-none rounded-2xl!`}
                      maxLength={1000}
                    />
                    {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-secondary py-3 text-sm font-bold text-secondary-foreground hover:brightness-105 transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? t.fab.submitting : <> {t.fab.submit} <span aria-hidden>→</span></>}
                  </button>

                  {status === "error" && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive text-center">
                      {t.fab.errorBanner}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground text-center">
                    {t.fab.privacyLead}{" "}
                    <a href="/privacy" className="text-primary hover:underline">
                      {t.fab.privacyLink}
                    </a>
                    .
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
