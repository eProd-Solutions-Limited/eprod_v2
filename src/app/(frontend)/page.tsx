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

export const dynamic = 'force-dynamic'

export default async function IndexPage() {
  const payload = await getPayload({ config: payloadConfig })
  const logoWall = await payload.findGlobal({ slug: 'logo-wall', depth: 1 }) as any

  const agribusinessLogos = logoWall.agribusinessLogos ?? []
  const bankLogos = logoWall.bankLogos ?? []

  return (
    <div className="min-h-screen">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <BankPartnershipsSection bankLogos={bankLogos} />
      <ProofSection agribusinessLogos={agribusinessLogos} />
      <HowItWorksSection />
      <TestimonialsSection />
      <DifferentiationSection />
      <FAQSection />
      <CTASection />
    </div>
  );
};