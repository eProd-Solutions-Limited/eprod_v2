import AboutHero from "@/components/about/AboutHero";
import VisionMission from "@/components/about/VisionMission";
import OurStory from "@/components/about/OurStory";
import AgFintechIdentity from "@/components/about/AgFintechIdentity";
import MarketLeadership from "@/components/about/MarketLeadership";
import BankPartnersAbout from "@/components/about/BankPartnersAbout";
import LeadershipTeam from "@/components/about/LeadershipTeam";
import AboutCTA from "@/components/about/AboutCTA";

const AboutUs = () => {
    return (
        <div className="min-h-screen">
            <AboutHero />
            <VisionMission />
            <OurStory />
            <AgFintechIdentity />
            <MarketLeadership />
            <BankPartnersAbout />
            <LeadershipTeam />
            <AboutCTA />
        </div>
    );
};

export default AboutUs;
