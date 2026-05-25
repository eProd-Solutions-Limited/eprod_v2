"use client"

import { useState, useEffect, useCallback } from "react"
import { X, CalendarCheck } from "lucide-react"
import { gaEvents } from "@/lib/ga-events"

type FormState = {
  company: string
  email: string
  phone: string
  challenge: string
  message: string
}

const EMPTY_FORM: FormState = {
  company: "",
  email: "",
  phone: "",
  challenge: "",
  message: "",
}

const inputClass =
  "w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition disabled:opacity-50"

export function DemoRequestFAB() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus("idle")

    try {
      const res = await fetch("/api/send-cta-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sourceSection: "demo_request_fab" }),
      })

      if (res.ok) {
        gaEvents.formSubmitted("demo_request_fab", form.company)
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
        onClick={() => setOpen(true)}
        aria-label="Request a Demo"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-secondary px-5 py-3.5 text-sm font-bold text-secondary-foreground shadow-lg hover:brightness-105 active:scale-95 transition-all duration-150"
      >
        <CalendarCheck size={18} strokeWidth={2.5} />
        <span className="hidden sm:inline">Contact Us</span>
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
                <h2 className="text-xl font-bold text-foreground">Contact Us</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Have questions or want to learn more? Reach out to our team.
                </p>
              </div>
              <button
                onClick={close}
                aria-label="Close"
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
                  <p className="font-semibold text-foreground">You&apos;re on the list!</p>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Thanks! Our team will reach out within 24 hours to schedule your demo.
                  </p>
                  <button
                    onClick={close}
                    className="mt-2 text-sm font-medium text-primary hover:underline"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Company Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      disabled={loading}
                      placeholder="e.g. Acme AgriCorp"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Work Email <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        disabled={loading}
                        placeholder="name@company.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Phone <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        disabled={loading}
                        placeholder="+254 700 000 000"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Primary Challenge <span className="text-destructive">*</span>
                    </label>
                    <select
                      required
                      disabled={loading}
                      value={form.challenge}
                      onChange={(e) => setForm({ ...form, challenge: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">Select an option</option>
                      <option value="compliance">Compliance</option>
                      <option value="efficiency">Efficiency</option>
                      <option value="scaling">Scaling</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Message <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      required
                      disabled={loading}
                      rows={3}
                      placeholder="Tell us about your supply chain needs..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className={`${inputClass} resize-none rounded-2xl!`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-secondary py-3 text-sm font-bold text-secondary-foreground hover:brightness-105 transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? "Submitting..." : <> Contact Us <span aria-hidden>→</span></>}
                  </button>

                  {status === "error" && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive text-center">
                      Something went wrong. Please try again or email us directly.
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground text-center">
                    By submitting, you agree to our{" "}
                    <a href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
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
