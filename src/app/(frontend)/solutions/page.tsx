import SolutionsHero from "@/components/solutions/SolutionsHero";
import PlatformArchitecture from "@/components/solutions/PlatformArchitecture";
import DataFlow from "@/components/solutions/DataFlow";
import SecurityCompliance from "@/components/solutions/SecurityCompliance";
import Integrations from "@/components/solutions/Integrations";
import SolutionsCTA from "@/components/solutions/SolutionsCTA";
import { SectionScoop } from "@/components/ui/SectionScoop";

const BG_WHITE = 'hsl(0 0% 100%)'
const BG_GRAY  = 'hsl(210 20% 91%)'

const Solutions = () => {
  return (
    <div className="min-h-screen">
      <SolutionsHero />
      {/* SolutionsHero bottom overlay handles the gradient→white transition */}
      <PlatformArchitecture />
      <SectionScoop direction="right" fromBg={BG_WHITE} nextBg={BG_GRAY} />
      <DataFlow />
      <SectionScoop direction="left" fromBg={BG_GRAY} nextBg={BG_WHITE} />
      <SecurityCompliance />
      <SectionScoop direction="right" fromBg={BG_WHITE} nextBg={BG_GRAY} />
      <Integrations />
      {/* SolutionsCTA top overlay handles the gray→gradient transition */}
      <SolutionsCTA />
    </div>
  );
};

export default Solutions;
