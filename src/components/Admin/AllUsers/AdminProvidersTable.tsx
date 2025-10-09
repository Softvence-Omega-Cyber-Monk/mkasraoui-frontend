// src/pages/AdminProviders.tsx
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

const AdminProvidersTable: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(6);
  const [search, setSearch] = useState<string>("");

  // state for view modal
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

  // Get provider details for view modal
  const { data: viewProvider, isLoading: isViewLoading } =
    useGetProviderByIdQuery(viewProviderId!, {
      skip: !viewProviderId,
    });

  // Direct Approve / Reject handlers
  const handleApprove = async (providerId: string) => {
    try {
      await approveRequest(providerId).unwrap();
      toast.success("Provider approved successfully.");
      await refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve provider.");
    }
  };

  const handleReject = async (providerId: string) => {
    try {
      await rejectRequest(providerId).unwrap();
      toast.success("Provider rejected successfully.");
      await refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject provider.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="mx-auto w-full px-4">
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
        <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white shadow-sm">
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
                  providers.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b-2 border-gray-100 hover:bg-gray-50"
                    >
                      {/* Business Info */}
                      <td className="px-6 py-4 text-xs font-medium text-gray-900">
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
                            <div className="text-sm font-semibold">
                              {p.bussinessName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {p.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* User Info */}
                      <td className="px-6 py-4 text-xs text-gray-600">
                        <div className="text-sm">{p.contactName}</div>
                        <div className="text-xs">{p.phone}</div>
                      </td>

                      {/* Area */}
                      <td className="px-6 py-4 text-xs text-gray-600">
                        {p.serviceArea.split(" ").slice(0, 3).join(" ")}
                      </td>

                      {/* Created */}
                      <td className="px-6 py-4 text-xs text-gray-600">
                        {new Date(p.createdAt).toLocaleString()}
                      </td>

                      {/* Rating */}
                      <td className="px-6 py-4 text-xs text-gray-600">
                        {p.avg_ratting ?? 0} ({p.total_review ?? 0})
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4 text-xs text-gray-600">
                        {p.user.role}
                      </td>

                      {/* Status */}
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

                      {/* Actions */}
                      <td className="flex space-x-2 px-6 py-7 text-xs md:text-sm">
                        {!p.isApproved && (
                          <>
                            <button
                              onClick={() => handleApprove(p.id)}
                              disabled={isApproving}
                              className="cursor-pointer rounded-lg bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                            >
                              {isApproving ? "Approving..." : "Approve"}
                            </button>

                            <button
                              onClick={() => handleReject(p.id)}
                              disabled={isRejecting}
                              className="cursor-pointer rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
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
        <div className="mt-6 flex items-center justify-between px-4 py-3">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">{providers.length}</span> of{" "}
            <span className="font-medium">{total ?? "—"}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Prev
            </button>

            <div className="min-w-[50px] rounded-md border border-[#E3E3E4] bg-gray-50 px-3 py-1.5 text-center text-sm font-medium text-gray-700 shadow-sm">
              {pageFromServer}
            </div>

            <button
              onClick={() => setPage((p) => p + 1)}
              className="cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
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
                    <span className="font-semibold">Price:</span>{" "}
                    {viewProvider.price}
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

                {viewProvider?.portfolioImages &&
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
