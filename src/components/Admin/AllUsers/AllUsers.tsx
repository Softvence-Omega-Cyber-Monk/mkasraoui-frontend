// src/pages/AdminUserTable.tsx

import React, { useState } from "react";
import type { User } from "@/redux/types/user.type";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "@/redux/features/user/userApi";
import toast from "react-hot-toast";
import PageLoader from "@/components/Shared/PageLoader";
import { MdDelete } from "react-icons/md";
import { GrView } from "react-icons/gr";
import Title from "@/components/Shared/Title";

const AllUsers: React.FC = () => {
  const { data: users = [], isLoading, isError } = useGetUsersQuery();

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [viewUser, setViewUser] = useState<User | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null);

  // 👉 Frontend Pagination States
  const [page, setPage] = useState(1);
  const usersPerPage = 10;
  const total = users.length;
  const totalPages = Math.ceil(total / usersPerPage);

  const startIndex = (page - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId).unwrap();
      toast.success("User deleted");
      setConfirmDelete(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Title title="All Users" />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="border-b-2 border-[#DBE0E5] bg-gray-50">
              <tr>
                <th className="px-6 py-5 text-left text-sm font-medium whitespace-nowrap text-gray-700">
                  User Name
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Email
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium whitespace-nowrap text-gray-700">
                  Phone Number
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Address
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Role
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-6 text-center text-sm text-gray-600"
                  >
                    <PageLoader />
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-6 text-center text-sm text-red-600"
                  >
                    Failed to load users.
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-6 text-center text-sm text-gray-600"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm font-semibold whitespace-nowrap text-gray-900">
                      {user.name || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.address}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.role}
                    </td>

                    <td
                      className={`px-6 py-4 text-sm font-medium ${
                        user.isDeleted ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {user.isDeleted ? "INACTIVE" : "ACTIVE"}
                    </td>
                    <td className="flex space-x-2 px-6 py-4">
                      <button
                        onClick={() => setConfirmDelete(user)}
                        className="flex cursor-pointer items-center justify-center rounded-md bg-red-600 p-2 text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-400 focus:outline-none"
                        title="Delete User"
                      >
                        <MdDelete className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewUser(user)}
                        className="flex cursor-pointer items-center justify-center rounded-md bg-emerald-500 p-2 text-white transition-colors hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                        title="View User"
                      >
                        <GrView className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {users.length > 0 && (
          <div className="mt-6 flex items-center justify-between px-4 py-3">
            {/* Info text */}
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium">{paginatedUsers.length}</span> of{" "}
              <span className="font-medium">{total}</span>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Prev
              </button>

              <div className="min-w-[50px] rounded-md border border-[#E3E3E4] bg-gray-50 px-3 py-1.5 text-center text-sm font-medium text-gray-700 shadow-sm">
                {page} / {totalPages}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-bold text-gray-800">
              User Details
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {viewUser.name || "—"}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {viewUser.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {viewUser.phone || "—"}
              </p>
              <p>
                <span className="font-semibold">Role:</span> {viewUser.role}
              </p>
              <p>
                <span className="font-semibold">Address:</span>{" "}
                {viewUser.address || "—"}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewUser(null)}
                className="cursor-pointer rounded-lg bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-bold text-gray-800">
              Confirm Delete
            </h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{confirmDelete.name}</span>?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="cursor-pointer rounded-lg bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete.id)}
                disabled={isDeleting}
                className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
