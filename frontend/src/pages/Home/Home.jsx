import BannerSection from "../../components/Home/BannerSection";
import LatestResolvedIssues from "../../components/Home/LatestResolvedIssues";
import FeaturesSection from "../../components/Home/FeaturesSection";
import CategorySection from "../../components/Home/CategorySection";
import HowItWorksSection from "../../components/Home/HowItWorksSection";
import CTASection from "../../components/Home/CTASection";

const Home = () => {
  return (
    <div>
      <BannerSection />
      <LatestResolvedIssues />
      <CategorySection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
    </div>
  );
};

export default Home;
