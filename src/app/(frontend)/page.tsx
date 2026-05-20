import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import BankPartnershipsSection from "@/components/BankPartnershipsSection";
import ProofSection from "@/components/ProofSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import DifferentiationSection from "@/components/DifferentiationSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import { faqs } from "@/data/faqs";

export const dynamic = 'force-dynamic'

export default async function IndexPage() {
  const payload = await getPayload({ config: payloadConfig })
  const [logoWall, teamResult, voiceOfCustomer] = await Promise.all([
    payload.findGlobal({ slug: 'logo-wall', depth: 1 }),
    payload.find({ collection: 'team', sort: 'order', limit: 20 }),
    payload.findGlobal({ slug: 'voice-of-customer' }),
  ])

  const agribusinessLogos = ((logoWall as any).agribusinessLogos ?? []).filter((l: any) => l.active !== false)
  const bankLogos = ((logoWall as any).bankLogos ?? []).filter((l: any) => l.active !== false)
  const team = teamResult.docs
  const vocQuotes = (voiceOfCustomer as any).quotes ?? []

  const bankPartnerNames: string[] = bankLogos
    .filter((b: any) => b.name)
    .map((b: any) => b.name as string)

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "eProd Solutions",
    alternateName: "eProd",
    description:
      "eProd is an AgFinTech platform providing agricultural supply chain management software. eProd digitizes farmer relationships, supply chain traceability, and compliance reporting—unlocking access to capital for agribusinesses across Sub-Saharan Africa. Founded in 2004 in Kenya, eProd serves 250+ clients across 20+ countries and manages over 1 million farmer records.",
    url: "https://www.eprod.io",
    foundingDate: "2004",
    foundingLocation: {
      "@type": "Place",
      name: "Kenya",
      addressCountry: "KE",
    },
    areaServed: {
      "@type": "Place",
      name: "Sub-Saharan Africa",
    },
    knowsAbout: [
      "Agricultural Supply Chain Management",
      "AgFinTech",
      "Smallholder Farmer Finance",
      "Agricultural Lending De-risking",
      "Supply Chain Traceability",
      "Export Compliance Certification",
      "Outgrower Management",
    ],
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      name: "ISO 27001",
    },
    ...(team.length > 0 && {
      employee: team.map((person: any) => ({
        "@type": "Person",
        name: person.name,
        jobTitle: person.title,
        ...(person.linkedin ? { sameAs: person.linkedin } : {}),
      })),
    }),
    ...(bankPartnerNames.length > 0 && {
      additionalProperty: {
        "@type": "PropertyValue",
        name: "Partner Financial Institutions",
        value: bankPartnerNames.join(", "),
      },
    }),
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <BankPartnershipsSection bankLogos={bankLogos} />
      <ProofSection agribusinessLogos={agribusinessLogos} />
      <HowItWorksSection />
      <TestimonialsSection quotes={vocQuotes} />
      <DifferentiationSection />
      <FAQSection />
      <CTASection />
    </div>
  );
};