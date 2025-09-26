// src/pages/AdminUserTable.tsx

import React, { useState } from "react";
import type { User } from "@/redux/types/user.type";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "@/redux/features/user/userApi";
import toast from "react-hot-toast";

const AllUsers: React.FC = () => {
  const { data: users = [], isLoading, isError } = useGetUsersQuery();

  console.log("users all", users);

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [viewUser, setViewUser] = useState<User | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null);

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
        <h2 className="text-2xl font-bold text-gray-800">All Users</h2>
        <button className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700">
          Add User
        </button>
      </div>

      {/* Table */}
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
                    colSpan={5}
                    className="p-6 text-center text-sm text-gray-600"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-6 text-center text-sm text-red-600"
                  >
                    Failed to load users.
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-6 text-center text-sm text-gray-600"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {user.name || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.role}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm font-medium ${user.isDeleted ? "text-red-600" : "text-green-600"}`}
                    >
                      {user.isDeleted ? "INACTIVE" : "ACTIVE"}
                    </td>
                    <td className="flex space-x-2 px-6 py-4">
                      <button
                        onClick={() => setViewUser(user)}
                        className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium transition hover:bg-gray-100"
                      >
                        View
                      </button>
                      <button
                        onClick={() => setConfirmDelete(user)}
                        className="cursor-pointer rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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

// // src/pages/AdminUserTable.tsx
// import React, { useState } from "react";

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: "ADMIN" | "USER" | "PROVIDER";
//   status: "ACTIVE" | "INACTIVE";
// }

// const AllUsers: React.FC = () => {
//   const users: User[] = [
//     {
//       id: "u1",
//       name: "John Doe",
//       email: "john@example.com",
//       role: "USER",
//       status: "ACTIVE",
//     },
//     {
//       id: "u2",
//       name: "Jane Smith",
//       email: "jane@example.com",
//       role: "PROVIDER",
//       status: "INACTIVE",
//     },
//     {
//       id: "u3",
//       name: "Admin User",
//       email: "admin@example.com",
//       role: "ADMIN",
//       status: "ACTIVE",
//     },
//   ];

//   const [viewUser, setViewUser] = useState<User | null>(null);
//   const [confirmDelete, setConfirmDelete] = useState<User | null>(null);

//   return (
//     <div>
//       {/* Header */}
//       <div className="mb-6 flex items-center justify-between">
//         <h2 className="text-2xl font-bold text-gray-800">All Users</h2>
//         <button className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700">
//           Add User
//         </button>
//       </div>

//       {/* Table */}
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
//                   Role
//                 </th>
//                 <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
//                   Status
//                 </th>
//                 <th className="px-6 py-5 text-left text-sm font-medium text-gray-500">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={5}
//                     className="p-6 text-center text-sm text-gray-600"
//                   >
//                     No users found.
//                   </td>
//                 </tr>
//               ) : (
//                 users.map((user) => (
//                   <tr
//                     key={user.id}
//                     className="border-b border-gray-100 hover:bg-gray-50"
//                   >
//                     <td className="px-6 py-4 text-sm font-semibold text-gray-900">
//                       {user.name}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       {user.email}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       {user.role}
//                     </td>
//                     <td
//                       className={`px-6 py-4 text-sm font-medium ${
//                         user.status === "ACTIVE"
//                           ? "text-green-600"
//                           : "text-red-600"
//                       }`}
//                     >
//                       {user.status}
//                     </td>
//                     <td className="flex space-x-2 px-6 py-4">
//                       <button
//                         onClick={() => setViewUser(user)}
//                         className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium transition hover:bg-gray-100"
//                       >
//                         View
//                       </button>
//                       <button
//                         onClick={() => setConfirmDelete(user)}
//                         className="cursor-pointer rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-red-700"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* View Modal */}
//       {viewUser && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//           <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
//             <h3 className="mb-4 text-xl font-bold text-gray-800">
//               User Details
//             </h3>
//             <div className="space-y-2 text-sm text-gray-700">
//               <p>
//                 <span className="font-semibold">Name:</span> {viewUser.name}
//               </p>
//               <p>
//                 <span className="font-semibold">Email:</span> {viewUser.email}
//               </p>
//               <p>
//                 <span className="font-semibold">Role:</span> {viewUser.role}
//               </p>
//               <p>
//                 <span className="font-semibold">Status:</span> {viewUser.status}
//               </p>
//             </div>
//             <div className="mt-6 flex justify-end">
//               <button
//                 onClick={() => setViewUser(null)}
//                 className="cursor-pointer rounded-lg bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Confirm Delete Modal */}
//       {confirmDelete && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//           <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
//             <h3 className="mb-4 text-lg font-bold text-gray-800">
//               Confirm Delete
//             </h3>
//             <p className="text-sm text-gray-600">
//               Are you sure you want to delete{" "}
//               <span className="font-semibold">{confirmDelete.name}</span>?
//             </p>
//             <div className="mt-6 flex justify-end gap-3">
//               <button
//                 onClick={() => setConfirmDelete(null)}
//                 className="cursor-pointer rounded-lg bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => {
//                   alert(`User ${confirmDelete.name} deleted (static only)`);
//                   setConfirmDelete(null);
//                 }}
//                 className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllUsers;
