import { Check } from "lucide-react";
import { useState } from "react";
import { useGetProviderPlansQuery } from "@/redux/features/provider-plan/providerPlanApi";
import { useCreateSubscriptionMutation } from "@/redux/features/subscription/subscriptionApi";
import type { Plan } from "@/redux/types/plan.types";
import toast from "react-hot-toast";

export default function ServiceProvidersArea() {
  const [isYearly, setIsYearly] = useState(false);
  const { data: plans, isLoading } = useGetProviderPlansQuery();
  const [createSubscription, { isLoading: isSubscribing }] = useCreateSubscriptionMutation();

  const handleSubscribe = async (plan: Plan) => {
    try {
      const priceId = isYearly 
        ? "price_1SImarAMwgyWNlYh2r5y7P0P"  // $29 yearly
        : "price_1SIma1AMwgyWNlYhgPPvN9Tr";  // $2.9 monthly

      const res = await createSubscription({
        priceId,
        pland_id: plan.id,
      }).unwrap();

      if (res?.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error("Subscription failed:", err);
      toast.error("Subscription failed. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full bg-[#F9FAFB] px-4 py-18 text-center">
        <p>Loading provider plans...</p>
      </div>
    );
  }

  // Filter plans by duration
  const monthlyPlans = plans?.filter((p) => p.plan_duration === "MONTHLY") || [];
  const yearlyPlans = plans?.filter((p) => p.plan_duration === "YEARLY") || [];
  const displayPlans = isYearly ? yearlyPlans : monthlyPlans;

  return (
    <div className="mx-auto w-full bg-[#F9FAFB] px-4 py-18">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-blue-900">
            Service Providers Area
          </h1>
          <p className="mt-4 text-gray-600">
            Only €29/year get 2 months free compared to the monthly plan.
          </p>

          {/* Toggle */}
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

        {/* Provider Cards */}
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {displayPlans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-xl border border-gray-200 bg-white p-8 flex flex-col justify-between"
            >
              <div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                  {plan.name}
                </h2>
                <p className="mb-6 text-gray-600">
                  €{plan.price} / {isYearly ? "year" : "month"}
                </p>

                <div className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="mr-3 h-5 w-5 flex-shrink-0 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subscribe Button */}
              <button
                className="mt-6 w-full rounded-lg bg-secondary px-4 py-2 text-white hover:bg-blue-700 transition disabled:opacity-50"
                onClick={() => handleSubscribe(plan as unknown as Plan)}
                disabled={isSubscribing}
              >
                {isSubscribing ? "Redirecting..." : "Subscribe"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}