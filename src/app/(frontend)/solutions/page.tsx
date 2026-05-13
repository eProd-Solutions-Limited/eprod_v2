import SolutionsHero from "@/components/solutions/SolutionsHero";
import PlatformArchitecture from "@/components/solutions/PlatformArchitecture";
import DataFlow from "@/components/solutions/DataFlow";
import SecurityCompliance from "@/components/solutions/SecurityCompliance";
import Integrations from "@/components/solutions/Integrations";
import SolutionsCTA from "@/components/solutions/SolutionsCTA";

const Solutions = () => {
  return (
    <div className="min-h-screen">
      <SolutionsHero />
      <PlatformArchitecture />
      <DataFlow />
      <SecurityCompliance />
      <Integrations />
      <SolutionsCTA />
    </div>
  );
};

export default Solutions;
