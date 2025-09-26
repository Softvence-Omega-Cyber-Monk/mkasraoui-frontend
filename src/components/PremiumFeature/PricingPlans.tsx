// PricingPlans.tsx
import React, { useState } from "react";
import { useGetActivePlansQuery } from "@/redux/features/plan/planApi";
import type { Plan } from "@/redux/types/plan.types";

const PricingPlans: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);

  const { data, isLoading, error } = useGetActivePlansQuery();

  if (isLoading) return <p className="text-center">Loading plans...</p>;
  if (error) return <p className="text-center text-red-500">Failed to load plans</p>;

  // Separate plans into monthly & yearly
  const monthlyPlans = data?.filter((p) => p.plan_duration === "MONTHLY") || [];
  const yearlyPlans = data?.filter((p) => p.plan_duration === "YEARLY") || [];

  // Get Non-Subscriber and Premium plans depending on toggle
  const nonSubPlan: Plan | undefined = (isYearly ? yearlyPlans : monthlyPlans).find(
    (p) => p.name === "Non-Subscriber"
  );
  const premiumPlan: Plan | undefined = (isYearly ? yearlyPlans : monthlyPlans).find(
    (p) => p.name === "Premium Subscriber"
  );

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
    <li key={label} className="flex items-start justify-between space-x-2">
      <div className="flex items-center">
        {getCheckIcon()}
        <span className="text-body ml-2 text-xs sm:text-sm">{label}</span>
      </div>
      <span className="text-right text-xs font-medium text-[#191919] sm:text-sm">
        {value}
      </span>
    </li>
  );

  const renderPlanCard = (plan?: Plan, isPremium?: boolean) => {
    if (!plan) return null;

    return (
      <div
        className={`mx-auto flex w-full max-w-[500px] flex-col rounded-2xl border ${
          isPremium ? "border-secondary" : "border-[#DFE1E6]"
        } bg-white p-6 shadow-md sm:p-8`}
      >
        <div className="flex-grow">
          <h3 className="text-2xl font-bold text-gray-800">{plan.name}</h3>
          <div className="mt-4 flex items-baseline">
            <span className="text-4xl font-bold text-gray-800">{plan.price}€</span>
            <span className="ml-1 text-gray-500">
              {isYearly ? "/year" : "/month"}
            </span>
          </div>
          <ul className="mt-8 space-y-4">
            {plan.features.map((f) => renderFeature(f.name, f.limit))}
          </ul>
        </div>
        <a
          href="#"
          className={`mt-8 block rounded-xl border px-5 py-3 text-center text-sm font-medium ${
            isPremium
              ? "border-secondary bg-secondary text-white hover:bg-secondary-dark"
              : "border-secondary text-secondary bg-white hover:bg-gray-50"
          }`}
        >
          {isPremium ? "Subscribe" : "Get Started For Free"}
        </a>
      </div>
    );
  };

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
          {renderPlanCard(nonSubPlan, false)}
          {renderPlanCard(premiumPlan, true)}
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
