import CombinationPacks from "@/components/PremiumFeature/CombinationPacks";
import CTAButtons from "@/components/PremiumFeature/CTAButtons";
import ExtrasAddons from "@/components/PremiumFeature/ExtrasAddons";
import FeaturesGrid from "@/components/PremiumFeature/FeaturesGrid";
import Header from "@/components/PremiumFeature/Header";
import LoyaltyReferralBonuses from "@/components/PremiumFeature/LoyaltyReferralBonuses";
import PricingPlans from "@/components/PremiumFeature/PricingPlans";
import ServiceProvidersArea from "@/components/PremiumFeature/ServiceProvidersArea";
import Testimonials from "@/components/PremiumFeature/Testimonials";

export default function PremiumFeature() {
  return (
    <div>
      <Header />
      <FeaturesGrid />
      <PricingPlans />
      <CombinationPacks />
      <ExtrasAddons />
      <ServiceProvidersArea />
      <LoyaltyReferralBonuses />
      <CTAButtons />
      <Testimonials />
    </div>
  );
}
