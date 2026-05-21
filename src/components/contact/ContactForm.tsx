"use client"

import { useState } from "react"
import { MapPin, Phone, Mail, LinkedinIcon, XIcon, FacebookIcon, YoutubeIcon } from "lucide-react"
import { gaEvents } from "@/lib/ga-events"

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/eprod-solutions-limited/posts/?feedView=all",
    icon: LinkedinIcon,
  },
  {
    label: "Twitter",
    href: "https://twitter.com/eProdSolutions",
    icon: XIcon,
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
  phone: string
  challenge: string
  message: string
}

const ContactForm = () => {
  const [form, setForm] = useState<FormState>({
    company: "",
    email: "",
    phone: "",
    challenge: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus("idle")

    try {
      const res = await fetch("/api/send-cta-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sourceSection: "contact_page" }),
      })

      if (res.ok) {
        gaEvents.formSubmitted("contact_form", form.company)
        setStatus("success")
        setForm({ company: "", email: "", phone: "", challenge: "", message: "" })
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition disabled:opacity-50"

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-[1fr_1.6fr] gap-12 items-start">

          {/* Left — Contact info */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-8">We're here to help</h2>

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
                  <p className="text-sm font-semibold text-foreground">Phone</p>
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
                  <p className="text-sm font-semibold text-foreground">Email</p>
                  <a
                    href="mailto:info@eprod-solutions.com"
                    className="text-sm text-primary hover:underline transition-colors"
                  >
                    info@eprod-solutions.com
                  </a>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                Connect With Us
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
            <h2 className="text-2xl font-bold text-foreground mb-1">Send us a message</h2>
            <p className="text-sm text-muted-foreground mb-8">
              Fill out the form below and our team will get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
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

              <div className="grid grid-cols-2 gap-4">
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
                  rows={4}
                  placeholder="Tell us more about your supply chain needs..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground hover:brightness-110 transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Sending..." : <>Send Message <span aria-hidden>→</span></>}
              </button>

              {status === "success" && (
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm text-primary text-center">
                  Thank you! We'll be in touch within 24 hours.
                </div>
              )}
              {status === "error" && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive text-center">
                  Something went wrong. Please try again or email us directly.
                </div>
              )}

              <p className="text-xs text-muted-foreground text-center">
                By submitting this form, you agree to our{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
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
