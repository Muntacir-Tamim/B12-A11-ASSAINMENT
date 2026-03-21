import HowItWorksSection from "../../components/Home/HowItWorksSection";
import Container from "../../components/Shared/Container";

const HowItWorks = () => {
  return (
    <div>
      <div className="bg-blue-700 text-white py-16 text-center">
        <h1 className="text-4xl font-extrabold">How CivicFix Works</h1>
        <p className="text-blue-200 mt-3 text-lg">
          A transparent, step-by-step guide to issue resolution
        </p>
      </div>
      <HowItWorksSection />
    </div>
  );
};

export default HowItWorks;
