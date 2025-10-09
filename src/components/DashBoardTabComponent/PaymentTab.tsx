"use client";

import {
  useCheckoutPaymentMutation,
  useGetMyQuotesQuery,
} from "@/redux/features/quotes/quotesApi";
import { useState } from "react";

const statusColors: Record<string, string> = {
  PAID: "bg-green-100 text-green-700",
  BOOKED: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-blue-100 text-blue-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  CANCELLED: "bg-red-100 text-red-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function PaymentTab() {
  const { data, isLoading, isFetching } = useGetMyQuotesQuery({
    page: 1,
    limit: 10,
  });
  const [checkoutPayment, { isLoading: paying }] = useCheckoutPaymentMutation();
  const [message, setMessage] = useState<string | null>(null);

  const quotes = data?.data?.data ?? [];

  const handlePay = async (quoteId: string) => {
    try {
      // ✅ Call your RTK Query mutation
      const res = await checkoutPayment({ quoteId }).unwrap();

      console.log("Stripe checkout response:", res);

      // ✅ Safely access Stripe URL from API response
      const stripeUrl = res?.data?.url;

      if (stripeUrl) {
        // 🔥 Redirect to Stripe payment page
        window.location.href = stripeUrl;
      } else {
        setMessage("⚠️ Payment link not received!");
      }
    } catch (error: any) {
      setMessage(error?.data?.message || "❌ Payment failed!");
    }

    // Auto clear message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
  };

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          My Quotes & Payments
        </h1>
      </div>

      {message && (
        <div className="mb-4 rounded-lg border border-yellow-400 bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-800">
          {message}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b-2 border-[#DBE0E5] bg-gray-50">
              <tr>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Theme
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Location
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Date
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Guests
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-6 py-5 text-center text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {quotes.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-6 text-center text-sm text-gray-600"
                  >
                    No quotes found.
                  </td>
                </tr>
              ) : (
                quotes.map((quote) => (
                  <tr
                    key={quote.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {quote.partyTheme || "Untitled Event"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {quote.partyLocation || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {quote.date
                        ? new Date(quote.date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {quote.numberOfGuest ?? 0}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          statusColors[quote.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {quote.status}
                      </span>
                    </td>
                    <td className="flex justify-center space-x-3 px-6 py-4">
                      {(quote.status === "BOOKED" ||
                        quote.status === "ACCEPTED") && (
                        <button
                          onClick={() => handlePay(quote.id)}
                          disabled={paying}
                          className={`flex cursor-pointer items-center justify-center space-x-1 rounded-lg px-4 py-1.5 text-sm font-semibold text-white shadow transition duration-200 ${
                            paying
                              ? "cursor-not-allowed bg-blue-300"
                              : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                          }`}
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 8c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2s2-.9 2-2v-4c0-1.1-.9-2-2-2z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 12h12"
                            />
                          </svg>
                          <span>{paying ? "Processing..." : "Pay Now"}</span>
                        </button>
                      )}

                      {quote.status === "PAID" && (
                        <span className="font-semibold text-green-600">
                          Payment Done
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
