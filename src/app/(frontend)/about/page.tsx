export const dynamic = 'force-dynamic'

import { cache } from 'react'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import AboutHero from "@/components/about/AboutHero";
import VisionMission from "@/components/about/VisionMission";
import OurStory from "@/components/about/OurStory";
import MeetTheFounders from "@/components/about/MeetTheFounders";
import AgFintechIdentity from "@/components/about/AgFintechIdentity";
import MarketLeadership from "@/components/about/MarketLeadership";
import BankPartnersAbout from "@/components/about/BankPartnersAbout";
import LeadershipTeam from "@/components/about/LeadershipTeam";
import CareersSection from "@/components/about/CareersSection";
import AboutFAQ from "@/components/about/AboutFAQ";
import AboutCTA from "@/components/about/AboutCTA";
import { SectionScoop } from "@/components/ui/SectionScoop"

const getData = cache(async () => {
  const payload = await getPayload({ config: payloadConfig })
  const logoWall = await payload.findGlobal({ slug: 'logo-wall', depth: 1 })
  return { logoWall }
})

const aboutFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What makes eProd different from other agricultural software?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "eProd combines supply chain digitization with AgFinTech capabilities, enabling both compliance and financial inclusion.",
      },
    },
    {
      "@type": "Question",
      name: "Which compliance standards does eProd support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "EUDR, Organic, Fairtrade, GlobalG.A.P., and national traceability frameworks.",
      },
    },
    {
      "@type": "Question",
      name: "Is eProd suitable for large and small agribusinesses?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. eProd scales from small cooperatives to multinational exporters.",
      },
    },
  ],
}

const AboutUs = async () => {
  const { logoWall } = await getData()
  const bankLogos = (logoWall as any).bankLogos ?? []

  const BG_WHITE = 'hsl(0 0% 100%)'
  const BG_GRAY  = 'hsl(210 20% 91%)'

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutFaqSchema) }}
      />
      <AboutHero />
      <SectionScoop direction="right" fromBg={BG_WHITE} nextBg={BG_GRAY} />
      <VisionMission />
      <SectionScoop direction="left" fromBg={BG_GRAY} nextBg={BG_WHITE} />
      <MeetTheFounders />
      <OurStory />
      <SectionScoop direction="right" fromBg={BG_WHITE} nextBg={BG_GRAY} />
      <AgFintechIdentity />
      <SectionScoop direction="left" fromBg={BG_GRAY} nextBg={BG_WHITE} />
      <MarketLeadership />
      <SectionScoop direction="right" fromBg={BG_WHITE} nextBg={BG_GRAY} />
      <BankPartnersAbout bankLogos={bankLogos} />
      <SectionScoop direction="left" fromBg={BG_GRAY} nextBg={BG_WHITE} />
      <LeadershipTeam />
      <CareersSection />
      <SectionScoop direction="right" fromBg={BG_WHITE} nextBg={BG_GRAY} />
      <AboutFAQ />
      <AboutCTA />
    </div>
  );
};

export default AboutUs;
