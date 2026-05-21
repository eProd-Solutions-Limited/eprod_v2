import type { Metadata } from "next"
import ContactHero from "@/components/contact/ContactHero"
import ContactForm from "@/components/contact/ContactForm"

export const metadata: Metadata = {
  title: "Contact Us | eProd Solutions",
  description:
    "Get in touch with the eProd team. Reach us in Nairobi, Kenya or fill out the form and we'll respond within 24 hours.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <ContactHero />
      <ContactForm />
    </div>
  )
}
