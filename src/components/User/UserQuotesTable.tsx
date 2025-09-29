"use client";

import {
  useGetMyQuotesQuery,
  useCancelQuoteMutation,
} from "@/redux/features/quotes/quotesApi";
import type { QuoteResponse } from "@/redux/types/quotes.type";
import PageLoader from "../Shared/PageLoader";

const statusColors: Record<string, string> = {
  BOOKED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  PENDING: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

const UserQuotesTable = () => {
  const { data, isLoading, isFetching } = useGetMyQuotesQuery({
    page: 1,
    limit: 1000,
  });
  const [cancelQuote, { isLoading: isCancelling }] = useCancelQuoteMutation();

  const handleCancel = async (id: string) => {
    try {
      await cancelQuote({ id }).unwrap();
      alert("Quote cancelled successfully ✅");
    } catch (error) {
      console.error("Cancel failed:", error);
      alert("Failed to cancel quote ❌");
    }
  };

  const quotes: QuoteResponse[] = data?.data?.data ?? [];

  return (
    <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="border-b-2 border-[#DBE0E5] bg-gray-50">
            <tr>
              <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                Provider ID
              </th>
              <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                Date
              </th>
              <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                Time
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
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading || isFetching ? (
              <tr>
                <td
                  colSpan={8}
                  className="p-6 text-center text-sm text-gray-500"
                >
                  <PageLoader />
                </td>
              </tr>
            ) : quotes.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="p-6 text-center text-sm text-gray-600"
                >
                  No quotes found.
                </td>
              </tr>
            ) : (
              quotes.map((quote: QuoteResponse) => (
                <tr
                  key={quote.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {quote.providerId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(quote.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {quote.time
                      ? new Date(quote.time).toLocaleTimeString()
                      : "-"}
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
                  <td className="flex justify-center space-x-2 px-6 py-4">
                    {quote.status === "PENDING" && (
                      <button
                        onClick={() => handleCancel(quote.id)}
                        disabled={isCancelling}
                        className="rounded-md bg-red-500 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                      >
                        {isCancelling ? "Cancelling..." : "Cancel"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserQuotesTable;

// // src/components/quotes/UserQuotesTable.tsx
// "use client";

// import {
//   useGetMyQuotesQuery,
//   useCancelQuoteMutation,
// } from "@/redux/features/quotes/quotesApi";
// import type { QuoteResponse } from "@/redux/types/quotes.type";

// const statusColors: Record<string, string> = {
//   BOOKED: "bg-green-100 text-green-700",
//   CANCELLED: "bg-red-100 text-red-700",
//   PENDING: "bg-blue-100 text-blue-700",
// };

// const UserQuotesTable = () => {
//   const { data, isLoading } = useGetMyQuotesQuery({ page: 1, limit: 10 });
//   const [cancelQuote, { isLoading: isCancelling }] = useCancelQuoteMutation();

//   const handleCancel = async (id: string) => {
//     try {
//       await cancelQuote({ id }).unwrap();
//       alert("Quote cancelled successfully ✅");
//     } catch (error) {
//       console.error("Cancel failed:", error);
//       alert("Failed to cancel quote ❌");
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center py-10">
//         <div className="h-8 w-8 animate-spin rounded-full border-4 border-dashed border-blue-500"></div>
//       </div>
//     );
//   }

//   const quotes = data?.data?.data ?? []; // ✅ Safe access

//   return (
//     <div className="overflow-x-auto rounded-lg bg-white shadow-md">
//       <table className="min-w-full border-collapse">
//         <thead>
//           <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-600">
//             <th className="border-b p-3">Provider ID</th>
//             <th className="border-b p-3">Date</th>
//             <th className="border-b p-3">Time</th>
//             <th className="border-b p-3">Guests</th>
//             <th className="border-b p-3">Theme</th>
//             <th className="border-b p-3">Location</th>
//             <th className="border-b p-3">Status</th>
//             <th className="border-b p-3">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {quotes.length > 0 ? (
//             quotes.map((quote: QuoteResponse) => (
//               <tr key={quote.id} className="text-sm hover:bg-gray-50">
//                 <td className="border-b p-3">{quote.providerId}</td>
//                 <td className="border-b p-3">
//                   {new Date(quote.date).toLocaleDateString()}
//                 </td>
//                 <td className="border-b p-3">
//                   {quote.time ? new Date(quote.time).toLocaleTimeString() : "-"}
//                 </td>
//                 <td className="border-b p-3">{quote.numberOfGuest ?? "-"}</td>
//                 <td className="border-b p-3">{quote.partyTheme ?? "-"}</td>
//                 <td className="border-b p-3">{quote.partyLocation ?? "-"}</td>
//                 <td className="border-b p-3">
//                   <span
//                     className={`rounded-full px-2 py-1 text-xs font-medium ${
//                       statusColors[quote.status] || "bg-gray-100 text-gray-700"
//                     }`}
//                   >
//                     {quote.status}
//                   </span>
//                 </td>
//                 <td className="border-b p-3">
//                   {quote.status === "PENDING" && (
//                     <button
//                       onClick={() => handleCancel(quote.id)}
//                       disabled={isCancelling}
//                       className="rounded bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50"
//                     >
//                       {isCancelling ? "Cancelling..." : "Cancel"}
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={8} className="p-5 text-center text-gray-500">
//                 No quotes found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default UserQuotesTable;

// // src/components/quotes/UserQuotesTable.tsx

// import { useGetMyQuotesQuery } from "@/redux/features/quotes/quotesApi";
// import type { QuoteResponse } from "@/redux/types/quotes.type";

// const statusColors: Record<string, string> = {
//   BOOKED: "bg-green-100 text-green-700",
//   CANCELLED: "bg-red-100 text-red-700",
//   PENDING: "bg-blue-100 text-blue-700",
// };

// const UserQuotesTable = () => {
//   const { data, isLoading } = useGetMyQuotesQuery({ page: 1, limit: 10 });

//   console.log("user quote:", data);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center py-10">
//         <div className="h-8 w-8 animate-spin rounded-full border-4 border-dashed border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-x-auto rounded-lg bg-white shadow-md">
//       <table className="min-w-full border-collapse">
//         <thead>
//           <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-600">
//             <th className="border-b p-3">Provider ID</th>
//             <th className="border-b p-3">Date</th>
//             <th className="border-b p-3">Time</th>
//             <th className="border-b p-3">Guests</th>
//             <th className="border-b p-3">Theme</th>
//             <th className="border-b p-3">Location</th>
//             <th className="border-b p-3">Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data?.data?.data?.map((quote: QuoteResponse) => (
//             <tr key={quote.id} className="text-sm hover:bg-gray-50">
//               <td className="border-b p-3">{quote.providerId}</td>
//               <td className="border-b p-3">
//                 {new Date(quote.date).toLocaleDateString()}
//               </td>
//               <td className="border-b p-3">
//                 {quote.time ? new Date(quote.time).toLocaleTimeString() : "-"}
//               </td>
//               <td className="border-b p-3">{quote.numberOfGuest ?? "-"}</td>
//               <td className="border-b p-3">{quote.partyTheme ?? "-"}</td>
//               <td className="border-b p-3">{quote.partyLocation ?? "-"}</td>
//               <td className="border-b p-3">
//                 <span
//                   className={`rounded-full px-2 py-1 text-xs font-medium ${
//                     statusColors[quote.status] || "bg-gray-100 text-gray-700"
//                   }`}
//                 >
//                   {quote.status}
//                 </span>
//               </td>
//             </tr>
//           ))}

//           {data?.data?.data?.length === 0 && (
//             <tr>
//               <td colSpan={7} className="p-5 text-center text-gray-500">
//                 No quotes found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default UserQuotesTable;
