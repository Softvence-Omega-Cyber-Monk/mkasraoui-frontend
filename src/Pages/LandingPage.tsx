import PremiumBanner from "@/components/Home/PremiumBanner";
import Stats from "@/components/Home/Stats";
import Testimonials from "@/components/Home/Testimonials";
import VideoBanner from "@/components/Home/VideoBanner";
import WhatWeOffer from "@/components/Home/WhatWeOffer";
import WhoWeAre from "@/components/Home/WhoWeAre";
import Hero from "../components/Home/Hero";

const LandingPage = () => {
  return (
    <>
      <Hero />
      <WhoWeAre />
      <Stats />
      <WhatWeOffer />
      <VideoBanner />
      <Testimonials />
      <PremiumBanner />
    </>
  );
};

export default LandingPage;
