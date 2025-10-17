"use client";

import {
  useGetProviderQuotesQuery,
  useUpdateQuoteStatusMutation,
} from "@/redux/features/quotes/quotesApi";
import type { QuoteResponse } from "@/redux/types/quotes.type";
import Title from "../Shared/Title";
import PageLoader from "../Shared/PageLoader";
import toast from "react-hot-toast";

const statusColors: Record<string, string> = {
  BOOKED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  PENDING: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

const ProviderQuotesTable = () => {
  const { data, isLoading, isFetching } = useGetProviderQuotesQuery({
    page: 1,
    limit: 1000,
  });

  const [updateStatus] = useUpdateQuoteStatusMutation();
  const quotes: QuoteResponse[] = data?.data?.data ?? [];

  const handleStatusUpdate = async (
    id: string,
    status: "BOOKED" | "CANCELLED"
  ) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success(`Quote marked as ${status}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (isLoading || isFetching) {
    return (
      <div>
        <PageLoader />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Title title="Provider Quotes " />
      </div>
      <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="border-b-2 border-[#DBE0E5] bg-gray-50">
              <tr>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Name
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Email
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Phone
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Guests
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Theme
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Location
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-6 py-5 text-center text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {quotes.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
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
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                      {quote.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {quote.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {quote.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {quote.numberOfGuest ?? "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {quote.partyTheme ?? "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {quote.partyLocation ?? "-"}
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
                    <td className="flex justify-center space-x-3 px-6 py-5">
                      {/* ✅ Only show Accept if not already BOOKED */}
                      {quote.status !== "BOOKED" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(quote.id, "BOOKED")
                          }
                          className="flex cursor-pointer items-center justify-center space-x-1 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-semibold text-white shadow transition duration-200 hover:bg-green-700 hover:shadow-lg"
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>Accept</span>
                        </button>
                      )}

                      {/* ❌ Cancel button always shown */}
                      <button
                        onClick={() =>
                          handleStatusUpdate(quote.id, "CANCELLED")
                        }
                        className="flex cursor-pointer items-center justify-center space-x-1 rounded-lg bg-red-600 px-4 py-1 text-sm font-semibold text-white shadow transition duration-200 hover:bg-red-700 hover:shadow-lg"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        <span>Cancel</span>
                      </button>
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
};

export default ProviderQuotesTable;



// "use client";

// import {
//   useGetProviderQuotesQuery,
//   useUpdateQuoteStatusMutation,
// } from "@/redux/features/quotes/quotesApi";
// import type { QuoteResponse } from "@/redux/types/quotes.type";
// import Title from "../Shared/Title";
// import PageLoader from "../Shared/PageLoader";
// import toast from "react-hot-toast";

// const statusColors: Record<string, string> = {
//   BOOKED: "bg-green-100 text-green-700",
//   CANCELLED: "bg-red-100 text-red-700",
//   PENDING: "bg-blue-100 text-blue-700",
//   ACCEPTED: "bg-green-100 text-green-700",
//   REJECTED: "bg-red-100 text-red-700",
// };

// const ProviderQuotesTable = () => {
//   const { data, isLoading, isFetching } = useGetProviderQuotesQuery({
//     page: 1,
//     limit: 1000,
//   });

//   console.log("prodsfdsfdsfd", data);
//   const [updateStatus] = useUpdateQuoteStatusMutation();

//   const quotes: QuoteResponse[] = data?.data?.data ?? [];

//   const handleStatusUpdate = async (
//     id: string,
//     status: "BOOKED" | "CANCELLED",
//   ) => {
//     try {
//       await updateStatus({ id, status }).unwrap();
//       toast.success(`Quote marked as ${status}`);
//     } catch {
//       toast.error("Failed to update status");
//     }
//   };

//   if (isLoading || isFetching) {
//     return (
//       <div>
//         <PageLoader />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="mb-6">
//         <Title title="Provider Quotes " />
//       </div>
//       <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
//         <div className="w-full overflow-x-auto">
//           <table className="w-full min-w-[800px]">
//             <thead className="border-b-2 border-[#DBE0E5] bg-gray-50">
//               <tr>
//                 <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
//                   Name
//                 </th>
//                 <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
//                   Email
//                 </th>
//                 <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
//                   Phone
//                 </th>
//                 <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
//                   Guests
//                 </th>
//                 <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
//                   Theme
//                 </th>
//                 <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
//                   Location
//                 </th>
//                 <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
//                   Status
//                 </th>
//                 <th className="px-6 py-5 text-center text-sm font-medium text-gray-500">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {quotes.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={8}
//                     className="p-6 text-center text-sm text-gray-600"
//                   >
//                     No quotes found.
//                   </td>
//                 </tr>
//               ) : (
//                 quotes.map((quote) => (
//                   <tr
//                     key={quote.id}
//                     className="border-b border-gray-100 hover:bg-gray-50"
//                   >
//                     <td className="px-6 py-4 text-sm font-semibold text-gray-900">
//                       {quote.name}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       {quote.email}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       {quote.phone}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       {quote.numberOfGuest ?? "-"}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       {quote.partyTheme ?? "-"}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       {quote.partyLocation ?? "-"}
//                     </td>
//                     <td className="px-6 py-4 text-sm">
//                       <span
//                         className={`rounded-full px-2 py-1 text-xs font-medium ${
//                           statusColors[quote.status] ||
//                           "bg-gray-100 text-gray-700"
//                         }`}
//                       >
//                         {quote.status}
//                       </span>
//                     </td>
//                     <td className="flex justify-center space-x-3 px-6 py-5">
//                       <button
//                         onClick={() => handleStatusUpdate(quote.id, "BOOKED")}
//                         className="flex cursor-pointer items-center justify-center space-x-1 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-semibold text-white shadow transition duration-200 hover:bg-green-700 hover:shadow-lg"
//                       >
//                         <svg
//                           className="h-4 w-4"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth={2}
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M5 13l4 4L19 7"
//                           />
//                         </svg>
//                         <span>Accept</span>
//                       </button>

//                       <button
//                         onClick={() =>
//                           handleStatusUpdate(quote.id, "CANCELLED")
//                         }
//                         className="flex cursor-pointer items-center justify-center space-x-1 rounded-lg bg-red-600 px-4 py-1 text-sm font-semibold text-white shadow transition duration-200 hover:bg-red-700 hover:shadow-lg"
//                       >
//                         <svg
//                           className="h-4 w-4"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth={2}
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M6 18L18 6M6 6l12 12"
//                           />
//                         </svg>
//                         <span>Cancel</span>
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProviderQuotesTable;
