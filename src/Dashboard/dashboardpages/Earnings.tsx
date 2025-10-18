import { useState } from "react";
import { Landmark } from "lucide-react";
import { SlPaypal } from "react-icons/sl";
import { PiStripeLogo } from "react-icons/pi";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import TransactionHistoryTable from "../components/earnings/TransactionHistoryTable";

// ✅ import payment API hooks
import {
  useGetOnboardingLinkQuery,
  useLoginDashboardQuery,
} from "@/redux/features/payment/paymentApi";
import toast from "react-hot-toast";

function Earnings() {
  type TabType = "This Week" | "This Month" | "Lifetime";
  const [activeTab, setActiveTab] = useState<TabType>("This Week");

  const tabs = ["This Week", "This Month", "Lifetime"] as const;

  const paymentMethods = [
    { name: "Linked Bank", detail: "Bank of America", icon: <Landmark /> },
    {
      name: "PayPal",
      detail: "jane.doe@gmail.com",
      icon: <SlPaypal className="text-2xl" />,
    },
    {
      name: "Stripe",
      detail: "Stripe",
      icon: <PiStripeLogo className="text-2xl" />,
    },
  ];

  const earningsData = {
    "This Week": "$2,450",
    "This Month": "$8,750",
    Lifetime: "$45,320",
  };

  // ✅ hooks for Stripe onboarding & dashboard links
  const { data: onboardingLink } = useGetOnboardingLinkQuery();
  const { data: dashboardLink, isFetching: dashboardLoading } =
    useLoginDashboardQuery();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto">
        {/* Header */}
        <h1 className="mb-8 text-3xl font-bold text-[#121417]">
          Earnings & Payments
        </h1>

        {/* Earnings Summary */}
        <div className="mb-8">
          {/* 🟢 Title row with buttons */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              Earnings Summary
            </h2>

            <div className="flex flex-wrap items-center gap-3">
              {/* Go to Onboarding */}
              <button
                className={`flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition hover:shadow-md ${
                  onboardingLink?.url
                    ? "cursor-pointer bg-[#223B7D] hover:bg-[#02195a]"
                    : "cursor-not-allowed bg-gray-300"
                }`}
                onClick={() => {
                  if (onboardingLink?.url) {
                    window.open(onboardingLink.url, "_blank");
                  } else {
                    toast.success("✅ Your onboarding is already completed.");
                  }
                }}
                disabled={false} // ❗ keep clickable even when completed (we handle inside)
              >
                Go to Onboarding
                <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
              </button>

              {/* Login to Dashboard */}
              <button
                className={`flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition hover:shadow-md ${
                  dashboardLink?.url
                    ? "cursor-pointer bg-[#223B7D] hover:bg-[#02195a]"
                    : "cursor-not-allowed bg-gray-300"
                }`}
                onClick={() =>
                  dashboardLink?.url && window.open(dashboardLink.url, "_blank")
                }
                disabled={!dashboardLink?.url || dashboardLoading}
              >
                Login to Dashboard
                <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex space-x-6 overflow-x-auto border-b-2 border-[#E5E8EB]">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer p-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-[#61758A] hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Earnings Card */}
          <div className="mb-8 rounded-xl border-2 border-[#DBE0E5] bg-white p-6">
            <div className="mb-2 text-lg font-medium text-[#121417]">
              Total Earnings
            </div>
            <div className="text-3xl font-semibold text-gray-900">
              {earningsData[activeTab]}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Payment Methods
          </h2>

          <div className="mb-6 space-y-4">
            {paymentMethods.map((method, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#F0F2F5]">
                  {method.icon}
                </div>
                <div>
                  <div className="text-base font-medium text-gray-900">
                    {method.name}
                  </div>
                  <div className="text-sm text-gray-500">{method.detail}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Withdraw Button */}
          <button className="hover:bg-secondary-dark cursor-pointer rounded-xl bg-[#0D80F2] px-6 py-3 text-sm font-medium text-white transition-colors">
            Withdraw Funds
          </button>
        </div>

        {/* Transaction History Table */}
        <TransactionHistoryTable />
      </div>
    </div>
  );
}

export default Earnings;
