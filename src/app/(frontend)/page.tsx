
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


export default async function IndexPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <BankPartnershipsSection />
      <ProofSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <DifferentiationSection />
      <FAQSection />
      <CTASection />
    </div>
  );
};