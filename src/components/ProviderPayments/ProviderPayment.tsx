


import { useState } from "react";
import {
  useGetOnboardingLinkQuery,
  useGetOnboardingStatusQuery,
  useLoginDashboardQuery,
} from "@/redux/features/payment/paymentApi";
import {
  CheckCircleIcon,
  ClockIcon,
  ArrowTopRightOnSquareIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const ProviderPayment = () => {
  const { data: onboardingLink } = useGetOnboardingLinkQuery();
  const {
    data: onboardingStatus,
    refetch: fetchOnboardingStatus,
    isFetching: isStatusLoading,
  } = useGetOnboardingStatusQuery();
  const {
    data: dashboardLink,
    refetch: fetchDashboard,
    isFetching: isDashboardLoading,
  } = useLoginDashboardQuery();

  const [loading, setLoading] = useState(false);

  // Refresh both onboarding status & dashboard link (optional combined refresh)
  const handleRefresh = async () => {
    setLoading(true);
    await Promise.all([fetchOnboardingStatus(), fetchDashboard()]);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 text-center">
        Payment Dashboard
      </h1>

      {/* Onboarding Section */}
      <div className="p-6 bg-white shadow-sm rounded-2xl border border-gray-200 space-y-5 transition hover:shadow-md">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-700">
            Stripe Onboarding
          </h2>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              onboardingStatus?.completed
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {onboardingStatus?.completed ? (
              <>
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Completed
              </>
            ) : (
              <>
                <ClockIcon className="h-4 w-4 mr-1 animate-pulse" />
                Pending
              </>
            )}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            className={`flex items-center justify-center px-5 py-2 rounded-md text-white font-medium transition hover:shadow-lg ${
              onboardingLink?.url
                ? "bg-[#223B7D] hover:bg-[#02195a]"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            onClick={() =>
              onboardingLink?.url && window.open(onboardingLink.url, "_blank")
            }
            disabled={!onboardingLink?.url}
          >
            Go to Onboarding
            <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-2" />
          </button>

          <button
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition"
            onClick={async () => {
              await fetchOnboardingStatus();
            }}
            disabled={isStatusLoading}
          >
            {isStatusLoading && (
              <ArrowPathIcon className="h-4 w-4 mr-1 animate-spin" />
            )}
            Refresh Status
          </button>
        </div>
      </div>

      {/* Stripe Dashboard Section */}
      <div className="p-6 bg-white shadow-sm rounded-2xl border border-gray-200 space-y-5 transition hover:shadow-md">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-700">
            Stripe Dashboard
          </h2>
          {dashboardLink?.url && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Ready
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            className={`flex items-center justify-center px-5 py-2 rounded-md text-white font-medium transition hover:shadow-lg ${
              dashboardLink?.url
                ? "bg-[#223B7D] hover:bg-[#02195a]"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            onClick={() =>
              dashboardLink?.url && window.open(dashboardLink.url, "_blank")
            }
            disabled={!dashboardLink?.url}
          >
            Login to Dashboard
            <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-2" />
          </button>

          <button
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition"
            onClick={async () => {
              const res = await fetchDashboard();
              console.log("Dashboard link refreshed:", res);
            }}
            disabled={isDashboardLoading}
          >
            {isDashboardLoading && (
              <ArrowPathIcon className="h-4 w-4 mr-1 animate-spin" />
            )}
            Refresh Dashboard Link
          </button>
        </div>
      </div>

      {/* Optional combined refresh button */}
      <div className="text-center pt-4">
        <button
          className="inline-flex items-center px-5 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition disabled:opacity-50"
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading && <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />}
          Refresh All
        </button>
      </div>
    </div>
  );
};

export default ProviderPayment;
















 