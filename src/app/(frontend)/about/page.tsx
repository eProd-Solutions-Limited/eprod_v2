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
import AboutFAQ from "@/components/about/AboutFAQ";
import AboutCTA from "@/components/about/AboutCTA";

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

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutFaqSchema) }}
      />
      <AboutHero />
      <VisionMission />
      <MeetTheFounders />
      <OurStory />
      <AgFintechIdentity />
      <MarketLeadership />
      <BankPartnersAbout bankLogos={bankLogos} />
      <LeadershipTeam />
      <AboutFAQ />
      <AboutCTA />
    </div>
  );
};

export default AboutUs;
