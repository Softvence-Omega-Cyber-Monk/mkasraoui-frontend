import { useState } from "react";
import { Landmark } from "lucide-react";
import { SlPaypal } from "react-icons/sl";
import { PiStripeLogo } from "react-icons/pi";

function Earnings() {
  type TabType = "This Week" | "This Month" | "Lifetime";
  const [activeTab, setActiveTab] = useState<TabType>("This Week");

  const tabs = ["This Week", "This Month", "Lifetime"] as const;

  const paymentMethods = [
    {
      name: "Linked Bank",
      detail: "Bank of America",
      icon: <Landmark />,
    },
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

  const transactions = [
    {
      date: "07/15/2024",
      client: "Tech Solutions Inc.",
      amount: "$500",
      status: "Paid",
    },
    {
      date: "07/10/2024",
      client: "Global Marketing LLC",
      amount: "$750",
      status: "Paid",
    },
    {
      date: "07/05/2024",
      client: "Innovative Designs Co.",
      amount: "$400",
      status: "Paid",
    },
    {
      date: "06/30/2024",
      client: "Creative Minds Agency",
      amount: "$300",
      status: "Paid",
    },
    {
      date: "06/25/2024",
      client: "Digital Dynamics Ltd.",
      amount: "$500",
      status: "Paid",
    },
  ];

  const earningsData = {
    "This Week": "$2,450",
    "This Month": "$8,750",
    Lifetime: "$45,320",
  };

  return (
    <div>
      <div className="bg-gray-50 p-6">
        <div className="container mx-auto">
          {/* Header */}
          <h1 className="mb-8 text-3xl font-bold text-[#121417]">
            Earnings & Payments
          </h1>

          {/* Earnings Summary */}
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Earnings Summary
            </h2>

            {/* Tabs */}
            <div className="mb-6 flex space-x-6 overflow-x-scroll border-b-2 border-[#E5E8EB] md:overflow-x-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`cursor-pointer border-b-3 p-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? "border-[#E5E8EB] text-gray-900"
                      : "border-transparent text-[#61758A] hover:text-gray-700"
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
              {paymentMethods.map((method, index) => {
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#F0F2F5]">
                      {method?.icon}
                    </div>
                    <div>
                      <div className="text-base font-medium text-gray-900">
                        {method.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {method.detail}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Withdraw Button */}
            <button className="hover:bg-secondary-dark cursor-pointer rounded-xl bg-[#0D80F2] px-6 py-3 text-sm font-medium text-white transition-colors">
              Withdraw Funds
            </button>
          </div>

          {/* Transaction History */}
          <div>
            <h2 className="mb-4 text-lg font-medium text-gray-900">
              Transaction History
            </h2>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                      Payment Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {transactions.map((transaction, index) => (
                    <tr
                      key={index}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium whitespace-nowrap text-gray-900">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {transaction.client}
                      </td>
                      <td className="px-6 py-4 font-semibold whitespace-nowrap text-gray-900">
                        {transaction.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                            transaction.status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : transaction.status === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Earnings;
