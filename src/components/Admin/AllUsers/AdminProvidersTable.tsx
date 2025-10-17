"use client";

import React, { useState } from "react";
import {
  useGetProvidersQuery,
  useApproveProviderRequestMutation,
  useRejectProviderRequestMutation,
  useGetProviderByIdQuery,
} from "@/redux/features/property/propertyApi";
import type { Provider } from "@/redux/types/property.type";
import Title from "@/components/Shared/Title";
import PageLoader from "@/components/Shared/PageLoader";
import { toast } from "react-hot-toast";
import { GrView } from "react-icons/gr";

const AdminProvidersTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [search, setSearch] = useState("");
  const [viewProviderId, setViewProviderId] = useState<string | null>(null);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [activeActionType, setActiveActionType] = useState<
    "approve" | "reject" | null
  >(null);

  const { data, isLoading, isFetching, refetch } = useGetProvidersQuery({
    limit,
    page,
    search,
  });

  const [approveRequest] = useApproveProviderRequestMutation();
  const [rejectRequest] = useRejectProviderRequestMutation();

  const providers: Provider[] = data?.data?.data ?? [];
  const total = data?.data?.total ?? 0;
  const pageFromServer = data?.data?.page ?? page;
  const totalPages = Math.ceil(total / limit);

  const { data: viewProvider, isLoading: isViewLoading } =
    useGetProviderByIdQuery(viewProviderId as string, {
      skip: !viewProviderId,
    });

  const handleApprove = async (providerId: string) => {
    setActiveActionId(providerId);
    setActiveActionType("approve");
    try {
      await approveRequest(providerId).unwrap();
      toast.success("Provider approved successfully.");
      await refetch();
    } catch {
      toast.error("Failed to approve provider.");
    } finally {
      setActiveActionId(null);
      setActiveActionType(null);
    }
  };

  const handleReject = async (providerId: string) => {
    setActiveActionId(providerId);
    setActiveActionType("reject");
    try {
      await rejectRequest(providerId).unwrap();
      toast.success("Provider rejected successfully.");
      await refetch();
    } catch {
      toast.error("Failed to reject provider.");
    } finally {
      setActiveActionId(null);
      setActiveActionType(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="mx-auto w-full">
        {/* Header */}
        <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row">
          <Title title="Providers" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search business name, contact, area..."
            className="w-full rounded-xl border border-[#DBE0E5] px-3 py-2 text-sm sm:w-auto"
          />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="border-b-2 border-[#DBE0E5] bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                    Business Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                    Area
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                    Role
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoading || isFetching ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-sm">
                      <PageLoader />
                    </td>
                  </tr>
                ) : providers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="p-6 text-center text-sm text-gray-600"
                    >
                      No providers found.
                    </td>
                  </tr>
                ) : (
                  providers.map((p) => {
                    const isApproving =
                      activeActionId === p.id && activeActionType === "approve";
                    const isRejecting =
                      activeActionId === p.id && activeActionType === "reject";

                    return (
                      <tr
                        key={p.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        {/* Business Info */}
                        <td className="px-8 py-3 text-sm font-semibold text-gray-900">
                          <div className="flex items-center gap-3">
                            {p.portfolioImages?.[0] ? (
                              <img
                                src={p.portfolioImages[0]}
                                alt={p.bussinessName}
                                className="h-12 w-12 rounded-md object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-md bg-gray-200" />
                            )}
                            <div>
                              <p className="text-sm font-semibold">
                                {p.bussinessName}
                              </p>
                              <p className="text-xs text-gray-500">{p.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-8 py-4 text-sm text-gray-600">
                          <div className="whitespace-nowrap">
                            {p.contactName}
                          </div>
                          <span className="text-xs text-gray-500">
                            {p.phone}
                          </span>
                        </td>

                        {/* Area */}
                        <td className="px-3 py-4 text-sm text-gray-600">
                          <div className="whitespace-nowrap">
                            {p.serviceArea?.split(" ").slice(0, 3).join(" ")}
                          </div>
                        </td>

                        {/* Created */}
                        <td className="px-3 py-4 text-sm text-gray-600">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </td>

                        {/* Rating */}
                        <td className="px-3 py-4 text-sm text-gray-600">
                          {p.avg_ratting ?? 0} ({p.total_review ?? 0})
                        </td>

                        {/* Role */}
                        <td className="px-3 py-4 text-sm text-gray-600">
                          {p.user?.role}
                        </td>

                        {/* Status */}
                        <td className="px-3 py-4 text-center text-sm">
                          <span
                            className={`inline-flex w-28 items-center justify-center rounded-xl px-4 py-1.5 text-xs font-medium ${
                              p.isApproved
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-600"
                            }`}
                          >
                            {p.isApproved ? "Approved" : "Pending"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="flex items-center justify-center space-x-2 py-3">
                          {!p.isApproved && (
                            <>
                              <button
                                onClick={() => handleApprove(p.id)}
                                disabled={isApproving || isRejecting}
                                className="cursor-pointer rounded-md bg-green-600 p-2 text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                                title="Approve"
                              >
                                {isApproving ? "..." : "✓"}
                              </button>
                              <button
                                onClick={() => handleReject(p.id)}
                                disabled={isApproving || isRejecting}
                                className="cursor-pointer rounded-md bg-red-600 p-2 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                                title="Reject"
                              >
                                {isRejecting ? "..." : "✕"}
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setViewProviderId(p.id)}
                            className="flex cursor-pointer items-center justify-center rounded-lg bg-[#0F1F4C] p-2 text-white transition hover:bg-[#02133f]"
                            title="View Provider"
                          >
                            <GrView className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {providers.length > 0 && (
            <div className="mt-6 flex items-center justify-between px-4 py-3">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">{providers.length}</span>{" "}
                of <span className="font-medium">{total}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
                >
                  Prev
                </button>
                <div className="min-w-[50px] rounded-md border border-[#E3E3E4] bg-gray-50 px-3 py-1.5 text-center text-sm font-medium text-gray-700 shadow-sm">
                  {pageFromServer} / {totalPages || 1}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {viewProviderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[0.2px]">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-6 border-b border-[#E3E3E4] pb-3">
              <h2 className="text-2xl font-bold text-gray-900">
                {viewProvider?.bussinessName || "Provider"} Details
              </h2>
            </div>

            {isViewLoading ? (
              <p className="text-center text-gray-500">Loading details...</p>
            ) : viewProvider ? (
              <div className="space-y-4 text-gray-700">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <p>
                    <strong>Contact Name:</strong> {viewProvider.contactName}
                  </p>
                  <p>
                    <strong>Email:</strong> {viewProvider.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {viewProvider.phone}
                  </p>
                  <p>
                    <strong>Service Category:</strong>{" "}
                    {Array.isArray(viewProvider.serviceCategory)
                      ? viewProvider.serviceCategory.join(", ")
                      : viewProvider.serviceCategory}
                  </p>
                  <p>
                    <strong>Service Area:</strong> {viewProvider.serviceArea}
                  </p>
                  <p>
                    <strong>Price:</strong> {viewProvider.price}
                  </p>
                  <p>
                    <strong>Website:</strong>{" "}
                    <a
                      href={viewProvider.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {viewProvider.website}
                    </a>
                  </p>
                </div>

                <div>
                  <p>
                    <strong>Description:</strong>
                  </p>
                  <p className="text-gray-600">{viewProvider.description}</p>
                </div>

                {Array.isArray(viewProvider.portfolioImages) &&
                viewProvider.portfolioImages.length > 0 ? (
                  <div>
                    <p className="mb-2 font-semibold">Portfolio:</p>
                    <div className="grid max-h-60 grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3">
                      {viewProvider.portfolioImages.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`${viewProvider.bussinessName}-${idx}`}
                          className="h-28 w-full rounded-lg object-cover transition-transform duration-300 hover:scale-105"
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No portfolio images available.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500">No details found.</p>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewProviderId(null)}
                className="cursor-pointer rounded-lg bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Close
              </button>
            </div>

            <button
              onClick={() => setViewProviderId(null)}
              className="absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProvidersTable;

// import React, { useState } from "react";
// import {
//   useGetProvidersQuery,
//   useApproveProviderRequestMutation,
//   useRejectProviderRequestMutation,
//   useGetProviderByIdQuery,
// } from "@/redux/features/property/propertyApi";
// import type { Provider } from "@/redux/types/property.type";
// import Title from "@/components/Shared/Title";
// import PageLoader from "@/components/Shared/PageLoader";
// import { toast } from "react-hot-toast";

// const AdminProvidersTable: React.FC = () => {
//   const [page, setPage] = useState(1);
//   const [limit] = useState(6);
//   const [search, setSearch] = useState("");
//   const [viewProviderId, setViewProviderId] = useState<string | null>(null);

//   const [activeActionId, setActiveActionId] = useState<string | null>(null);
//   const [activeActionType, setActiveActionType] = useState<
//     "approve" | "reject" | null
//   >(null);

//   const { data, isLoading, isFetching, refetch } = useGetProvidersQuery({
//     limit,
//     page,
//     search,
//   });

//   const [approveRequest] = useApproveProviderRequestMutation();
//   const [rejectRequest] = useRejectProviderRequestMutation();

//   const providers: Provider[] = data?.data?.data ?? [];
//   const total = data?.data?.total ?? 0;
//   const pageFromServer = data?.data?.page ?? page;

//   const { data: viewProvider, isLoading: isViewLoading } =
//     useGetProviderByIdQuery(viewProviderId as string, {
//       skip: !viewProviderId,
//     });

//   const handleApprove = async (providerId: string) => {
//     setActiveActionId(providerId);
//     setActiveActionType("approve");
//     try {
//       await approveRequest(providerId).unwrap();
//       toast.success("Provider approved successfully.");
//       await refetch();
//     } catch (err) {
//       toast.error("Failed to approve provider.");
//       console.error(err);
//     } finally {
//       setActiveActionId(null);
//       setActiveActionType(null);
//     }
//   };

//   const handleReject = async (providerId: string) => {
//     setActiveActionId(providerId);
//     setActiveActionType("reject");
//     try {
//       await rejectRequest(providerId).unwrap();
//       toast.success("Provider rejected successfully.");
//       await refetch();
//     } catch (err) {
//       toast.error("Failed to reject provider.");
//       console.error(err);
//     } finally {
//       setActiveActionId(null);
//       setActiveActionType(null);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-6">
//       <div className="mx-auto w-full">
//         {/* Header */}
//         <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row">
//           <Title title="Providers" />
//           <input
//             type="search"
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setPage(1);
//             }}
//             placeholder="Search business name, contact, area..."
//             className="w-full rounded-xl border border-[#DBE0E5] px-3 py-2 text-sm sm:w-auto"
//           />
//         </div>

//         {/* Table */}
//         <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white shadow-sm">
//           <div className="w-full overflow-x-auto">
//             <table className="w-full min-w-[900px]">
//               <thead className="border-b-2 border-[#DBE0E5] bg-gray-50">
//                 <tr>
//                   {[
//                     "Business Name",
//                     "User Info",
//                     "Area",
//                     "Created",
//                     "Rating",
//                     "Role",
//                     "Status",
//                     "Action",
//                   ].map((head) => (
//                     <th
//                       key={head}
//                       className="px-6 py-5 text-left text-base font-medium text-gray-700"
//                     >
//                       {head}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>

//               <tbody>
//                 {isLoading || isFetching ? (
//                   <tr>
//                     <td colSpan={8} className="p-6 text-center text-sm">
//                       <PageLoader />
//                     </td>
//                   </tr>
//                 ) : providers.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan={8}
//                       className="p-6 text-center text-sm text-gray-600"
//                     >
//                       No providers found.
//                     </td>
//                   </tr>
//                 ) : (
//                   providers.map((p) => {
//                     const isApproving =
//                       activeActionId === p.id && activeActionType === "approve";
//                     const isRejecting =
//                       activeActionId === p.id && activeActionType === "reject";

//                     return (
//                       <tr
//                         key={p.id}
//                         className="border-b-2 border-gray-100 hover:bg-gray-50"
//                       >
//                         {/* Business Info */}
//                         <td className="px-6 py-4 text-xs font-medium text-gray-900">
//                           <div className="flex items-center gap-3">
//                             {p.portfolioImages?.[0] ? (
//                               <img
//                                 src={p.portfolioImages[0]}
//                                 alt={p.bussinessName}
//                                 className="h-12 w-12 rounded-md object-cover"
//                               />
//                             ) : (
//                               <div className="h-12 w-12 rounded-md bg-gray-200" />
//                             )}
//                             <div>
//                               <div className="text-sm font-semibold">
//                                 {p.bussinessName}
//                               </div>
//                               <div className="text-xs text-gray-500">
//                                 {p.email}
//                               </div>
//                             </div>
//                           </div>
//                         </td>

//                         {/* User Info */}
//                         <td className="px-6 py-4 text-xs text-gray-600">
//                           <div className="text-sm">{p.contactName}</div>
//                           <div className="text-xs">{p.phone}</div>
//                         </td>

//                         {/* Area */}
//                         <td className="px-6 py-4 text-xs text-gray-600">
//                           {p.serviceArea?.split(" ").slice(0, 3).join(" ")}
//                         </td>

//                         {/* Created */}
//                         <td className="px-6 py-4 text-xs text-gray-600">
//                           {new Date(p.createdAt).toLocaleString()}
//                         </td>

//                         {/* Rating */}
//                         <td className="px-6 py-4 text-xs text-gray-600">
//                           {p.avg_ratting ?? 0} ({p.total_review ?? 0})
//                         </td>
//                         <td className="px-6 py-4 text-xs text-gray-600">
//                           <div className="text-xs">{p.price}</div>
//                         </td>

//                         {/* Role */}
//                         <td className="px-6 py-4 text-xs text-gray-600">
//                           {p.user?.role}
//                         </td>

//                         {/* Status */}
//                         <td className="px-6 py-4 text-xs md:text-sm">
//                           <span
//                             className={`inline-flex w-28 items-center justify-center rounded-xl px-4 py-1.5 text-xs font-medium ${
//                               p.isApproved
//                                 ? "bg-green-100 text-green-800"
//                                 : "bg-yellow-100 text-yellow-600"
//                             }`}
//                           >
//                             {p.isApproved ? "Approved" : "Pending"}
//                           </span>
//                         </td>

//                         {/* Actions */}
//                         <td className="flex space-x-2 px-6 py-7 text-xs md:text-sm">
//                           {!p.isApproved && (
//                             <>
//                               <button
//                                 onClick={() => handleApprove(p.id)}
//                                 disabled={isApproving || isRejecting}
//                                 className="cursor-pointer rounded-lg bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
//                               >
//                                 {isApproving ? "Approving..." : "Approve"}
//                               </button>

//                               <button
//                                 onClick={() => handleReject(p.id)}
//                                 disabled={isApproving || isRejecting}
//                                 className="cursor-pointer rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
//                               >
//                                 {isRejecting ? "Rejecting..." : "Reject"}
//                               </button>
//                             </>
//                           )}

//                           <button
//                             onClick={() => setViewProviderId(p.id)}
//                             className="ml-2 cursor-pointer rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium hover:bg-gray-50"
//                           >
//                             View
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Pagination */}
//         <div className="mt-6 flex items-center justify-between px-4 py-3">
//           <div className="text-sm text-gray-600">
//             Showing <span className="font-medium">{providers.length}</span> of{" "}
//             <span className="font-medium">{total ?? "—"}</span>
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               disabled={page <= 1}
//               className="cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               Prev
//             </button>

//             <div className="min-w-[50px] rounded-md border border-[#E3E3E4] bg-gray-50 px-3 py-1.5 text-center text-sm font-medium text-gray-700 shadow-sm">
//               {pageFromServer}
//             </div>

//             <button
//               onClick={() => setPage((p) => p + 1)}
//               className="cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* View Modal */}
//       {viewProviderId && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[0.2px]">
//           <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl sm:p-8">
//             <div className="mb-6 border-b border-[#E3E3E4] pb-3">
//               <h2 className="text-2xl font-bold text-gray-900">
//                 {viewProvider?.bussinessName || "Provider"} Details
//               </h2>
//             </div>

//             {isViewLoading ? (
//               <p className="text-center text-gray-500">Loading details...</p>
//             ) : viewProvider ? (
//               <div className="space-y-4 text-gray-700">
//                 <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
//                   <p>
//                     <strong>Contact Name:</strong> {viewProvider.contactName}
//                   </p>
//                   <p>
//                     <strong>Email:</strong> {viewProvider.email}
//                   </p>
//                   <p>
//                     <strong>Phone:</strong> {viewProvider.phone}
//                   </p>
//                   <p>
//                     <strong>Service Category:</strong>{" "}
//                     {Array.isArray(viewProvider.serviceCategory)
//                       ? viewProvider.serviceCategory.join(", ")
//                       : viewProvider.serviceCategory}
//                   </p>
//                   <p>
//                     <strong>Service Area:</strong> {viewProvider.serviceArea}
//                   </p>
//                   <p>
//                     <strong>Price:</strong> {viewProvider.price}
//                   </p>
//                   <p>
//                     <strong>Website:</strong>{" "}
//                     <a
//                       href={viewProvider.website}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="text-blue-600 hover:underline"
//                     >
//                       {viewProvider.website}
//                     </a>
//                   </p>
//                 </div>

//                 <div>
//                   <p>
//                     <strong>Description:</strong>
//                   </p>
//                   <p className="text-gray-600">{viewProvider.description}</p>
//                 </div>

//                 {Array.isArray(viewProvider.portfolioImages) &&
//                 viewProvider.portfolioImages.length > 0 ? (
//                   <div>
//                     <p className="mb-2 font-semibold">Portfolio:</p>
//                     <div className="grid max-h-60 grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3">
//                       {viewProvider.portfolioImages.map((img, idx) => (
//                         <img
//                           key={idx}
//                           src={img}
//                           alt={`${viewProvider.bussinessName}-${idx}`}
//                           className="h-28 w-full rounded-lg object-cover transition-transform duration-300 hover:scale-105"
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 ) : (
//                   <p className="text-gray-500">
//                     No portfolio images available.
//                   </p>
//                 )}
//               </div>
//             ) : (
//               <p className="text-center text-gray-500">No details found.</p>
//             )}

//             <div className="mt-6 flex justify-end">
//               <button
//                 onClick={() => setViewProviderId(null)}
//                 className="cursor-pointer rounded-lg bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
//               >
//                 Close
//               </button>
//             </div>

//             <button
//               onClick={() => setViewProviderId(null)}
//               className="absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-gray-600"
//             >
//               ✕
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminProvidersTable;
