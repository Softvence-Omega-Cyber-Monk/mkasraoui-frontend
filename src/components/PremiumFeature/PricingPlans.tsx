// PricingPlans.tsx
import React, { useState } from "react";

const PricingPlans: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);

  const nonSubscriberPrices = {
    monthly: {
      aiPartyGenerator: "1 free use, then €4.90",
      aiPlanner: "Editable PDF",
      interactiveAi: "1 free",
      diyBoxes: "€24.90",
      birthdayTshirt: "€21.90",
      aiDigitalInvitation: "1 free, then €1/guest",
      printableInvitation: "€2/guest",
      diyTutorial: "Free",
      diyBoxDelivery: "€4.90",
      giftShop: "Standard links",
      localProviders: "Basic view only",
      price: "€0",
    },
    yearly: {
      aiPartyGenerator: "1 free use, then €4.90",
      aiPlanner: "Editable PDF",
      interactiveAi: "1 free",
      diyBoxes: "€24.90",
      birthdayTshirt: "€21.90",
      aiDigitalInvitation: "1 free, then €1/guest",
      printableInvitation: "€2/guest",
      diyTutorial: "Free",
      diyBoxDelivery: "€4.90",
      giftShop: "Standard links",
      localProviders: "Basic view only",
      price: "€0",
    },
  };

  const premiumSubscriberPrices = {
    monthly: {
      aiPartyGenerator: "Unlimited + PDF Download",
      aiPlanner: "Editable + Calendar Sync",
      interactiveAi: "Unlimited + Personalized",
      diyBoxes: "€19.90 (or -20%)",
      birthdayTshirt: "€16.90 + Free Delivery",
      aiDigitalInvitation: "Free",
      printableInvitation: "Free",
      diyTutorial: "Early Access + Printable",
      diyBoxDelivery: "Free (with 2+ items)",
      giftShop: "Wishlist + AI Picks",
      localProviders: "Direct contact + Map",
      price: "€6.90",
    },
    yearly: {
      aiPartyGenerator: "Unlimited + PDF Download",
      aiPlanner: "Editable + Calendar Sync",
      interactiveAi: "Unlimited + Personalized",
      diyBoxes: "€19.90 (or -20%)",
      birthdayTshirt: "€16.90 + Free Delivery",
      aiDigitalInvitation: "Free",
      printableInvitation: "Free",
      diyTutorial: "Early Access + Printable",
      diyBoxDelivery: "Free (with 2+ items)",
      giftShop: "Wishlist + AI Picks",
      localProviders: "Direct contact + Map",
      price: "€69",
    },
  };

  const nonSubData = isYearly
    ? nonSubscriberPrices.yearly
    : nonSubscriberPrices.monthly;
  const premiumSubData = isYearly
    ? premiumSubscriberPrices.yearly
    : premiumSubscriberPrices.monthly;

  const getCheckIcon = () => (
    <svg
      className="text-secondary h-5 w-5 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );

  const renderFeature = (label: string, value: string) => (
    <li className="flex items-start justify-between space-x-2">
      <div className="flex items-center">
        {getCheckIcon()}
        <span className="text-body ml-2 text-xs sm:text-sm">{label}</span>
      </div>
      <span className="text-right text-xs font-medium text-[#191919] sm:text-sm">
        {value}
      </span>
    </li>
  );

  return (
    <div
      className="py-20"
      style={{
        background:
          "linear-gradient(0deg, rgba(240, 244, 255, 0.34) 1.76%, rgba(242, 245, 255, 0.00) 103.06%)",
      }}
    >
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-secondary font-fredoka text-5xl font-semibold">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-[#63657E]">
            Only €69/year get 2 months free compared to the monthly plan.
          </p>
          <div className="mt-8 inline-flex items-center rounded-lg bg-[#D4D4D8]">
            <button
              onClick={() => setIsYearly(false)}
              className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium ${
                !isYearly ? "bg-secondary text-white" : "text-[#63657E]"
              }`}
            >
              monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium ${
                isYearly ? "bg-secondary text-white" : "text-[#63657E]"
              }`}
            >
              yearly
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
          {/* Non-Subscriber Card */}
          <div className="mx-auto flex w-full max-w-[500px] flex-col rounded-2xl border border-[#DFE1E6] bg-white p-6 shadow-md sm:p-8">
            <div className="flex-grow">
              <h3 className="text-2xl font-bold text-gray-800">
                Non-Subscriber
              </h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-gray-800">
                  {nonSubData.price.replace("/year", "").replace("/month", "")}
                </span>
                <span className="ml-1 text-gray-500">
                  {isYearly ? "/year" : "/month"}
                </span>
              </div>
              <ul className="mt-8 space-y-4">
                {renderFeature(
                  "AI Party Generator",
                  nonSubData.aiPartyGenerator,
                )}
                {renderFeature("AI Planner + Checklist", nonSubData.aiPlanner)}
                {renderFeature(
                  "Interactive AI Checklist",
                  nonSubData.interactiveAi,
                )}
                {renderFeature("DIY Boxes", nonSubData.diyBoxes)}
                {renderFeature("Birthday T-shirt", nonSubData.birthdayTshirt)}
                {renderFeature(
                  "AI Digital Invitation",
                  nonSubData.aiDigitalInvitation,
                )}
                {renderFeature(
                  "Printable Invitation",
                  nonSubData.printableInvitation,
                )}
                {renderFeature("DIY Tutorial Access", nonSubData.diyTutorial)}
                {renderFeature("DIY Box Delivery", nonSubData.diyBoxDelivery)}
                {renderFeature("Gift Shop", nonSubData.giftShop)}
                {renderFeature(
                  "Local Providers Access",
                  nonSubData.localProviders,
                )}
              </ul>
            </div>
            <a
              href="#"
              className="border-secondary text-secondary mt-8 block rounded-xl border bg-white px-5 py-3 text-center text-sm font-medium hover:bg-gray-50"
            >
              Get Started For Free
            </a>
          </div>

          {/* Premium Subscriber Card */}
          <div className="border-secondary mx-auto flex w-full max-w-[500px] flex-col rounded-2xl border bg-white p-6 shadow-md sm:p-8">
            <div className="flex-grow">
              <h3 className="text-2xl font-bold text-gray-800">
                Premium Subscriber
              </h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-gray-800">
                  {premiumSubData.price
                    .replace("/year", "")
                    .replace("/month", "")}
                </span>
                <span className="ml-1 text-gray-500">
                  {isYearly ? "/year" : "/month"}
                </span>
              </div>
              <ul className="mt-8 space-y-4">
                {renderFeature(
                  "AI Party Generator",
                  premiumSubData.aiPartyGenerator,
                )}
                {renderFeature(
                  "AI Planner + Checklist",
                  premiumSubData.aiPlanner,
                )}
                {renderFeature(
                  "Interactive AI Checklist",
                  premiumSubData.interactiveAi,
                )}
                {renderFeature("DIY Boxes", premiumSubData.diyBoxes)}
                {renderFeature(
                  "Birthday T-shirt",
                  premiumSubData.birthdayTshirt,
                )}
                {renderFeature(
                  "AI Digital Invitation",
                  premiumSubData.aiDigitalInvitation,
                )}
                {renderFeature(
                  "Printable Invitation",
                  premiumSubData.printableInvitation,
                )}
                {renderFeature(
                  "DIY Tutorial Access",
                  premiumSubData.diyTutorial,
                )}
                {renderFeature(
                  "DIY Box Delivery",
                  premiumSubData.diyBoxDelivery,
                )}
                {renderFeature("Gift Shop", premiumSubData.giftShop)}
                {renderFeature(
                  "Local Providers Access",
                  premiumSubData.localProviders,
                )}
              </ul>
            </div>
            <a
              href="#"
              className="border-secondary bg-secondary hover:bg-secondary-dark mt-8 block rounded-xl border px-5 py-3 text-center text-sm font-medium text-white"
            >
              Subscribe
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
