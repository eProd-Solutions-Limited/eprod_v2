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
import AboutCTA from "@/components/about/AboutCTA";

const getData = cache(async () => {
  const payload = await getPayload({ config: payloadConfig })
  const logoWall = await payload.findGlobal({ slug: 'logo-wall', depth: 1 })
  return { logoWall }
})

const AboutUs = async () => {
  const { logoWall } = await getData()
  const bankLogos = (logoWall as any).bankLogos ?? []

  return (
    <div className="min-h-screen">
      <AboutHero />
      <VisionMission />
      <MeetTheFounders />
      <OurStory />
      <AgFintechIdentity />
      <MarketLeadership />
      <BankPartnersAbout bankLogos={bankLogos} />
      <LeadershipTeam />
      <AboutCTA />
    </div>
  );
};

export default AboutUs;
