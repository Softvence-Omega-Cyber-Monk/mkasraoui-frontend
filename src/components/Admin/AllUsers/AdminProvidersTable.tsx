// src/pages/AdminProviders.tsx
import React, { useState } from "react";
import {
  useGetProvidersQuery,
  useApproveProviderRequestMutation,
  useRejectProviderRequestMutation,
  useGetProviderByIdQuery,
} from "@/redux/features/property/propertyApi";
import type { Provider } from "@/redux/types/property.type";

const AdminProvidersTable: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(6);
  const [search, setSearch] = useState<string>("");

  // modal state for approve/reject
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null,
  );
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null,
  );

  // modal state for view details
  const [viewProviderId, setViewProviderId] = useState<string | null>(null);

  const { data, isLoading, isFetching, refetch } = useGetProvidersQuery({
    limit,
    page,
    search,
  });

  const [approveRequest, { isLoading: isApproving }] =
    useApproveProviderRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] =
    useRejectProviderRequestMutation();

  const providers: Provider[] = data?.data?.data ?? [];
  const total = data?.data?.total ?? 0;
  const pageFromServer = data?.data?.page ?? page;

  // Get provider details when viewProviderId changes
  const { data: viewProvider, isLoading: isViewLoading } =
    useGetProviderByIdQuery(viewProviderId!, {
      skip: !viewProviderId, // skip if no id
    });

  // Approve / Reject handlers
  const openConfirmDialog = (
    provider: Provider,
    type: "approve" | "reject",
  ) => {
    setSelectedProvider(provider);
    setActionType(type);
  };

  const handleConfirm = async () => {
    if (!selectedProvider || !actionType) return;

    try {
      if (actionType === "approve") {
        await approveRequest(selectedProvider.id).unwrap();
        alert("Provider approved.");
      } else {
        await rejectRequest(selectedProvider.id).unwrap();
        alert("Provider rejected.");
      }
      await refetch();
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setSelectedProvider(null);
      setActionType(null);
    }
  };

  const handleCancel = () => {
    setSelectedProvider(null);
    setActionType(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto w-full">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Providers</h1>

          <div className="flex items-center gap-2">
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search business name, contact, area..."
              className="rounded-md border px-3 py-2 text-sm"
            />
            <button
              onClick={() => refetch()}
              className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="border-b-2 border-[#DBE0E5] bg-gray-50">
                <tr>
                  <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
                    Business Name
                  </th>
                  <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
                    User Info
                  </th>
                  <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
                    Area
                  </th>
                  <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
                    Created
                  </th>
                  <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
                    Rating
                  </th>
                  <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
                    Role
                  </th>
                  <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-5 text-left text-base font-medium text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoading || isFetching ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-sm">
                      Loading providers...
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
                  providers.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b-2 border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-xs font-medium text-gray-900">
                        <div className="flex items-center gap-3">
                          {p.portfolioImages && p.portfolioImages[0] ? (
                            <img
                              src={p.portfolioImages[0]}
                              alt={p.bussinessName}
                              className="h-12 w-12 rounded-md object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-md bg-gray-200" />
                          )}
                          <div>
                            <div className="text-sm font-semibold">
                              {p.bussinessName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {p.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-xs text-gray-600">
                        <div className="text-sm">{p.contactName}</div>
                        <div className="text-xs">{p.phone}</div>
                      </td>

                      <td className="px-6 py-4 text-xs text-gray-600">
                        <div className="text-xs text-gray-600">
                          {p.serviceArea}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-xs text-gray-600">
                        {new Date(p.createdAt).toLocaleString()}
                      </td>

                      <td className="px-6 py-4 text-xs text-gray-600">
                        {p.avg_ratting ?? 0} ({p.total_review ?? 0})
                      </td>

                      <td className="px-6 py-4 text-xs text-gray-600">
                        {p.user.role}
                      </td>

                      <td className="px-6 py-4 text-xs md:text-sm">
                        <span
                          className={`inline-flex w-28 items-center justify-center rounded-xl px-4 py-1.5 font-medium ${
                            p.isApproved
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-600"
                          } text-xs`}
                        >
                          {p.isApproved ? "Approved" : "Pending"}
                        </span>
                      </td>

                      <td className="flex space-x-2 px-6 py-4 text-xs md:text-sm">
                        {!p.isApproved && (
                          <>
                            <button
                              onClick={() => openConfirmDialog(p, "approve")}
                              disabled={isApproving}
                              className="cursor-pointer rounded-lg bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                            >
                              {isApproving ? "Approving..." : "Approve"}
                            </button>

                            <button
                              onClick={() => openConfirmDialog(p, "reject")}
                              disabled={isRejecting}
                              className="cursor-pointer rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
                            >
                              {isRejecting ? "Rejecting..." : "Reject"}
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => setViewProviderId(p.id)}
                          className="ml-2 cursor-pointer rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium hover:bg-gray-50"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {providers.length} of {total ?? "—"}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="cursor-pointer rounded-md border px-3 py-1 text-sm"
            >
              Prev
            </button>
            <div className="px-3 py-1 text-sm">Page {pageFromServer}</div>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="cursor-pointer rounded-md border px-3 py-1 text-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Approve / Reject Modal */}
      {selectedProvider && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[0.2px]">
          <div className="w-[400px] rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 cursor-pointer text-lg font-semibold text-gray-900">
              Confirm {actionType === "approve" ? "Approval" : "Rejection"}
            </h2>
            <p className="mb-6 text-sm text-gray-700">
              Are you sure you want to{" "}
              <span className="font-medium">{actionType}</span> provider{" "}
              <span className="font-semibold">
                {selectedProvider.bussinessName}
              </span>{" "}
              ({selectedProvider.contactName})?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="cursor-pointer rounded-md border border-[#E5E7EB] px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`cursor-pointer rounded-md px-4 py-2 text-sm text-white ${
                  actionType === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {actionType === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {/* View Details Modal */}
      {viewProviderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[0.2px]">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl sm:p-8">
            {/* Header */}
            <div className="mb-6 border-b pb-3">
              <h2 className="text-2xl font-bold text-gray-900">
                {viewProvider?.bussinessName || "Provider"} Details
              </h2>
            </div>

            {/* Body */}
            {isViewLoading ? (
              <p className="text-center text-gray-500">Loading details...</p>
            ) : viewProvider ? (
              <div className="space-y-4 text-gray-700">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <p>
                    <span className="font-semibold">Contact Name:</span>{" "}
                    {viewProvider.contactName}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {viewProvider.email}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {viewProvider.phone}
                  </p>
                  <p>
                    <span className="font-semibold">Service Category:</span>{" "}
                    {Array.isArray(viewProvider.serviceCategory)
                      ? viewProvider.serviceCategory.join(", ")
                      : viewProvider.serviceCategory}
                  </p>
                  <p>
                    <span className="font-semibold">Service Area:</span>{" "}
                    {viewProvider.serviceArea}
                  </p>
                  <p>
                    <span className="font-semibold">Price Range:</span>{" "}
                    {viewProvider.priceRange}
                  </p>
                  <p>
                    <span className="font-semibold">Website:</span>{" "}
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
                    <span className="font-semibold">Description:</span>
                  </p>
                  <p className="text-gray-600">{viewProvider.description}</p>
                </div>

                {viewProvider.portfolioImages &&
                  viewProvider.portfolioImages.length > 0 && (
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
                  )}
              </div>
            ) : (
              <p className="text-center text-gray-500">No details found.</p>
            )}

            {/* Footer */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewProviderId(null)}
                className="cursor-pointer rounded-lg bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 shadow transition-colors hover:bg-gray-200"
              >
                Close
              </button>
            </div>

            {/* Close icon (optional) */}
            <button
              onClick={() => setViewProviderId(null)}
              className="absolute top-3 right-3 cursor-pointer text-gray-400 transition-colors hover:text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProvidersTable;

// // src/pages/AdminProviders.tsx
// import React, { useState } from "react";
// import {
//   useGetProvidersQuery,
//   useApproveProviderRequestMutation,
//   useRejectProviderRequestMutation,
// } from "@/redux/features/property/propertyApi";
// import type { Provider } from "@/redux/types/property.type";

// const AdminProvidersTable: React.FC = () => {
//   const [page, setPage] = useState<number>(1);
//   const [limit] = useState<number>(6);
//   const [search, setSearch] = useState<string>("");

//   // modal state
//   const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
//     null,
//   );
//   const [actionType, setActionType] = useState<"approve" | "reject" | null>(
//     null,
//   );

//   const { data, isLoading, isFetching, refetch } = useGetProvidersQuery({
//     limit,
//     page,
//     search,
//   });

//   const [approveRequest, { isLoading: isApproving }] =
//     useApproveProviderRequestMutation();
//   const [rejectRequest, { isLoading: isRejecting }] =
//     useRejectProviderRequestMutation();

//   const providers: Provider[] = data?.data?.data ?? [];
//   const total = data?.data?.total ?? 0;
//   const pageFromServer = data?.data?.page ?? page;

//   const openConfirmDialog = (provider: Provider, type: "approve" | "reject") => {
//     setSelectedProvider(provider);
//     setActionType(type);
//   };

//   const handleConfirm = async () => {
//     if (!selectedProvider || !actionType) return;

//     try {
//       if (actionType === "approve") {
//         await approveRequest(selectedProvider.id).unwrap();
//         alert("Provider approved.");
//       } else {
//         await rejectRequest(selectedProvider.id).unwrap();
//         alert("Provider rejected.");
//       }
//       await refetch();
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong.");
//     } finally {
//       setSelectedProvider(null);
//       setActionType(null);
//     }
//   };

//   const handleCancel = () => {
//     setSelectedProvider(null);
//     setActionType(null);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="mx-auto w-full">
//         {/* Header */}
//         <div className="mb-6 flex items-center justify-between">
//           <h1 className="text-3xl font-bold text-gray-900">Providers</h1>

//           <div className="flex items-center gap-2">
//             <input
//               type="search"
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setPage(1);
//               }}
//               placeholder="Search business name, contact, area..."
//               className="rounded-md border px-3 py-2 text-sm"
//             />
//             <button
//               onClick={() => refetch()}
//               className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
//             >
//               Refresh
//             </button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
//           <div className="w-full overflow-x-auto">
//             <table className="w-full min-w-[900px]">
//               <thead className="border-b-2 border-[#DBE0E5] bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-700">
//                     Business
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-700">
//                     Contact
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-700">
//                     Category / Area
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-700">
//                     Created
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-700">
//                     Rating
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-700">
//                     Role
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-700">
//                     Status
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500">
//                     Action
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {isLoading || isFetching ? (
//                   <tr>
//                     <td colSpan={7} className="p-6 text-center text-sm">
//                       Loading providers...
//                     </td>
//                   </tr>
//                 ) : providers.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan={7}
//                       className="p-6 text-center text-sm text-gray-600"
//                     >
//                       No providers found.
//                     </td>
//                   </tr>
//                 ) : (
//                   providers.map((p) => (
//                     <tr
//                       key={p.id}
//                       className="border-b-2 border-gray-100 hover:bg-gray-50"
//                     >
//                       <td className="px-6 py-4 text-xs font-medium text-gray-900">
//                         <div className="flex items-center gap-3">
//                           {p.portfolioImages && p.portfolioImages[0] ? (
//                             <img
//                               src={p.portfolioImages[0]}
//                               alt={p.bussinessName}
//                               className="h-12 w-12 rounded-md object-cover"
//                             />
//                           ) : (
//                             <div className="h-12 w-12 rounded-md bg-gray-200" />
//                           )}
//                           <div>
//                             <div className="text-sm font-semibold">
//                               {p.bussinessName}
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               {p.email}
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               {p.user.role}
//                             </div>
//                           </div>
//                         </div>
//                       </td>

//                       <td className="px-6 py-4 text-xs text-gray-600">
//                         <div className="text-sm">{p.contactName}</div>
//                         <div className="text-xs">{p.phone}</div>
//                         <div className="text-xs text-gray-400">
//                           {p.user?.address}
//                         </div>
//                       </td>

//                       <td className="px-6 py-4 text-xs text-gray-600">
//                         <div className="text-sm">
//                           {Array.isArray(p.serviceCategory)
//                             ? p.serviceCategory.join(", ")
//                             : p.serviceCategory}
//                         </div>
//                         <div className="text-xs text-gray-400">
//                           {p.serviceArea}
//                         </div>
//                       </td>

//                       <td className="px-6 py-4 text-xs text-gray-600">
//                         {new Date(p.createdAt).toLocaleString()}
//                       </td>

//                       <td className="px-6 py-4 text-xs text-gray-600">
//                         {p.avg_ratting ?? 0} ({p.total_review ?? 0})
//                       </td>

//                       <td className="px-6 py-4 text-xs text-gray-600">
//                         {p.user.role}
//                       </td>

//                       <td className="px-6 py-4 text-xs md:text-sm">
//                         <span
//                           className={`inline-flex w-28 items-center justify-center rounded-xl px-4 py-1.5 font-medium ${
//                             p.isApproved
//                               ? "bg-green-100 text-green-800"
//                               : "bg-yellow-100 text-yellow-600"
//                           } text-xs`}
//                         >
//                           {p.isApproved ? "Approved" : "Pending"}
//                         </span>
//                       </td>

//                       <td className="space-x-2 px-6 py-4 text-xs md:text-sm">
//                         {!p.isApproved ? (
//                           <>
//                             <button
//                               onClick={() => openConfirmDialog(p, "approve")}
//                               disabled={isApproving}
//                               className="cursor-pointer rounded-lg bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
//                             >
//                               {isApproving ? "Approving..." : "Approve"}
//                             </button>

//                             <button
//                               onClick={() => openConfirmDialog(p, "reject")}
//                               disabled={isRejecting}
//                               className="cursor-pointer rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
//                             >
//                               {isRejecting ? "Rejecting..." : "Reject"}
//                             </button>
//                           </>
//                         ) : (
//                           <span className="text-gray-500">
//                             Already approved
//                           </span>
//                         )}

//                         {p.portfolioImages && p.portfolioImages.length > 0 && (
//                           <a
//                             href={p.portfolioImages[0]}
//                             target="_blank"
//                             rel="noreferrer"
//                             className="ml-2 inline-block rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium"
//                           >
//                             View
//                           </a>
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Pagination */}
//         <div className="mt-4 flex items-center justify-between">
//           <div className="text-sm text-gray-600">
//             Showing {providers.length} of {total ?? "—"}
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               disabled={page <= 1}
//               className="rounded-md border px-3 py-1 text-sm"
//             >
//               Prev
//             </button>
//             <div className="px-3 py-1 text-sm">Page {pageFromServer}</div>
//             <button
//               onClick={() => setPage((p) => p + 1)}
//               className="rounded-md border px-3 py-1 text-sm"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Confirmation Modal */}
//       {selectedProvider && actionType && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
//           <div className="w-[400px] rounded-lg bg-white p-6 shadow-lg">
//             <h2 className="mb-4 text-lg font-semibold text-gray-900">
//               Confirm {actionType === "approve" ? "Approval" : "Rejection"}
//             </h2>
//             <p className="mb-6 text-sm text-gray-700">
//               Are you sure you want to{" "}
//               <span className="font-medium">{actionType}</span> provider{" "}
//               <span className="font-semibold">
//                 {selectedProvider.bussinessName}
//               </span>{" "}
//               ({selectedProvider.contactName})?
//             </p>
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={handleCancel}
//                 className="rounded-md border px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirm}
//                 className={`rounded-md px-4 py-2 text-sm text-white ${
//                   actionType === "approve"
//                     ? "bg-green-600 hover:bg-green-700"
//                     : "bg-red-600 hover:bg-red-700"
//                 }`}
//               >
//                 {actionType === "approve" ? "Approve" : "Reject"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminProvidersTable;

// // src/pages/AdminProviders.tsx
// import React, { useState } from "react";
// import {
//   useGetProvidersQuery,
//   useApproveProviderRequestMutation,
//   useRejectProviderRequestMutation,
// } from "@/redux/features/property/propertyApi";
// import type { Provider } from "@/redux/types/property.type";

// const AdminProvidersTable: React.FC = () => {
//   const [page, setPage] = useState<number>(1);
//   const [limit] = useState<number>(6);
//   const [search, setSearch] = useState<string>("");

//   // fetch providers (will re-run when page/search change)
//   const { data, isLoading, isFetching, refetch } = useGetProvidersQuery({
//     limit,
//     page,
//     search,
//   });

//   const [approveRequest, { isLoading: isApproving }] =
//     useApproveProviderRequestMutation();
//   const [rejectRequest, { isLoading: isRejecting }] =
//     useRejectProviderRequestMutation();

//   // data shape: ProvidersResponse -> data.data is Provider[]
//   const providers: Provider[] = data?.data?.data ?? [];
//   const total = data?.data?.total ?? 0;
//   const pageFromServer = data?.data?.page ?? page;

//   const handleApprove = async (provider: Provider) => {
//     // Confirm with admin
//     const ok = window.confirm(
//       `Approve provider "${provider.bussinessName}" (${provider.contactName})?`,
//     );
//     if (!ok) return;

//     try {
//       // IMPORTANT: here we pass provider.id to the approve endpoint.
//       // If your backend expects a provider-request id (different field),
//       // replace provider.id with the provider request id (e.g. provider.requestId).
//       await approveRequest(provider.id).unwrap();
//       // refetch will run automatically because of invalidatesTags, but we can also call refetch
//       await refetch();
//       alert("Provider approved.");
//     } catch (err: any) {
//       console.error(err);
//       alert("Failed to approve provider. See console for details.");
//     }
//   };

//   const handleReject = async (provider: Provider) => {
//     const ok = window.confirm(
//       `Reject provider "${provider.bussinessName}" (${provider.contactName})?`,
//     );
//     if (!ok) return;

//     try {
//       // same note as above re: id
//       await rejectRequest(provider.id).unwrap();
//       await refetch();
//       alert("Provider rejected.");
//     } catch (err: any) {
//       console.error(err);
//       alert("Failed to reject provider. See console for details.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="mx-auto w-full">
//         <div className="mb-6 flex items-center justify-between">
//           <h1 className="text-3xl font-bold text-gray-900">Providers</h1>

//           <div className="flex items-center gap-2">
//             <input
//               type="search"
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setPage(1);
//               }}
//               placeholder="Search business name, contact, area..."
//               className="rounded-md border px-3 py-2 text-sm"
//             />
//             <button
//               onClick={() => refetch()}
//               className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
//             >
//               Refresh
//             </button>
//           </div>
//         </div>

//         <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
//           <div className="w-full overflow-x-auto">
//             <table className="w-full min-w-[900px]">
//               <thead className="border-b-2 border-[#DBE0E5] bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-700">
//                     Business
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-700">
//                     Contact
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-700">
//                     Category / Area
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-700">
//                     Created
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-700">
//                     Rating
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-700">
//                     Role
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-700">
//                     Status
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500">
//                     Action
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {isLoading || isFetching ? (
//                   <tr>
//                     <td colSpan={7} className="p-6 text-center text-sm">
//                       Loading providers...
//                     </td>
//                   </tr>
//                 ) : providers.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan={7}
//                       className="p-6 text-center text-sm text-gray-600"
//                     >
//                       No providers found.
//                     </td>
//                   </tr>
//                 ) : (
//                   providers.map((p) => (
//                     <tr
//                       key={p.id}
//                       className="border-b-2 border-gray-100 hover:bg-gray-50"
//                     >
//                       <td className="px-6 py-4 text-xs font-medium text-gray-900">
//                         <div className="flex items-center gap-3">
//                           {p.portfolioImages && p.portfolioImages[0] ? (
//                             <img
//                               src={p.portfolioImages[0]}
//                               alt={p.bussinessName}
//                               className="h-12 w-12 rounded-md object-cover"
//                             />
//                           ) : (
//                             <div className="h-12 w-12 rounded-md bg-gray-200" />
//                           )}
//                           <div>
//                             <div className="text-sm font-semibold">
//                               {p.bussinessName}
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               {p.email}
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               {p.user.role}
//                             </div>
//                           </div>
//                         </div>
//                       </td>

//                       <td className="px-6 py-4 text-xs text-gray-600">
//                         <div className="text-sm">{p.contactName}</div>
//                         <div className="text-xs">{p.phone}</div>
//                         <div className="text-xs text-gray-400">
//                           {p.user?.address}
//                         </div>
//                       </td>

//                       <td className="px-6 py-4 text-xs text-gray-600">
//                         <div className="text-sm">
//                           {Array.isArray(p.serviceCategory)
//                             ? p.serviceCategory.join(", ")
//                             : p.serviceCategory}
//                         </div>
//                         <div className="text-xs text-gray-400">
//                           {p.serviceArea}
//                         </div>
//                       </td>

//                       <td className="px-6 py-4 text-xs text-gray-600">
//                         {new Date(p.createdAt).toLocaleString()}
//                       </td>

//                       <td className="px-6 py-4 text-xs text-gray-600">
//                         {p.avg_ratting ?? 0} ({p.total_review ?? 0})
//                       </td>

//                       <td className="px-6 py-4 text-xs text-gray-600">
//                         {p.user.role}
//                       </td>

//                       <td className="px-6 py-4 text-xs md:text-sm">
//                         <span
//                           className={`inline-flex w-28 items-center justify-center rounded-xl px-4 py-1.5 font-medium ${
//                             p.isApproved
//                               ? "bg-green-100 text-green-800"
//                               : "bg-yellow-100 text-yellow-600"
//                           } text-xs`}
//                         >
//                           {p.isApproved ? "Approved" : "Pending"}
//                         </span>
//                       </td>

//                       <td className="space-x-2 px-6 py-4 text-xs md:text-sm">
//                         {!p.isApproved ? (
//                           <>
//                             <button
//                               onClick={() => handleApprove(p)}
//                               disabled={isApproving}
//                               className="cursor-pointer rounded-lg bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
//                             >
//                               {isApproving ? "Approving..." : "Approve"}
//                             </button>

//                             <button
//                               onClick={() => handleReject(p)}
//                               disabled={isRejecting}
//                               className="cursor-pointer rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
//                             >
//                               {isRejecting ? "Rejecting..." : "Reject"}
//                             </button>
//                           </>
//                         ) : (
//                           <span className="text-gray-500">
//                             Already approved
//                           </span>
//                         )}

//                         {/* Optional quick view: open portfolio in new tab */}
//                         {p.portfolioImages && p.portfolioImages.length > 0 && (
//                           <a
//                             href={p.portfolioImages[0]}
//                             target="_blank"
//                             rel="noreferrer"
//                             className="ml-2 inline-block rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium"
//                           >
//                             View
//                           </a>
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Simple pagination */}
//         <div className="mt-4 flex items-center justify-between">
//           <div className="text-sm text-gray-600">
//             Showing {providers.length} of {total ?? "—"}
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               disabled={page <= 1}
//               className="rounded-md border px-3 py-1 text-sm"
//             >
//               Prev
//             </button>
//             <div className="px-3 py-1 text-sm">Page {pageFromServer}</div>
//             <button
//               onClick={() => setPage((p) => p + 1)}
//               className="rounded-md border px-3 py-1 text-sm"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminProvidersTable;
