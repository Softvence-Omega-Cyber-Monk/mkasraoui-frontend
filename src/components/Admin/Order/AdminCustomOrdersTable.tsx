import { useState } from "react";
import {
  useGetAllCustomOrdersQuery,
  useUpdateCustomOrderStatusMutation,
} from "@/redux/features/admin/adminCustomOrder/adminCustomOrderApi";
import PageLoader from "@/components/Shared/PageLoader";
import { toast } from "react-hot-toast";
import Title from "@/components/Shared/Title";

const statusOptions = ["PENDING", "DELIVERED", "CANCELLED"];
const statusColors: Record<string, string> = {
  PENDING: "text-blue-600",
  PROCESSING: "text-yellow-600",
  DELIVERED: "text-green-600",
  CANCELLED: "text-red-600",
};

const statusBg: Record<string, string> = {
  PENDING: "bg-blue-100 text-blue-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const AdminCustomOrdersTable = () => {
  const ordersPerPage = 9; // items per page
  const [currentPage, setCurrentPage] = useState(1);

  const { data: apiData, isLoading, refetch } = useGetAllCustomOrdersQuery({});

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateCustomOrderStatusMutation();

  const orders = apiData?.data?.orders || [];
  const total = orders.length;
  const totalPages = Math.ceil(total / ordersPerPage);

  const paginatedOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage,
  );

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const toastId = toast.loading("Updating order status...");
      await updateStatus({ id, status }).unwrap();
      toast.success("Order status updated successfully!", { id: toastId });
      refetch();
    } catch (err: any) {
      console.error("Failed to update status:", err);
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Title title="Custom Orders" />
      </div>

      <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b-2 border-[#DBE0E5] bg-gray-50">
              <tr>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
                  Customer
                </th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
                  T-Shirt Type
                </th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
                  Size
                </th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
                  Quantity
                </th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
                  Total
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
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-sm">
                    <PageLoader />
                  </td>
                </tr>
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-6 text-center text-sm text-gray-600"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b-2 border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.user?.name || order.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.tShirtType}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.size}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      €{order.total}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm font-medium ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={order.status}
                        disabled={isUpdating}
                        className={`w-full cursor-pointer rounded-md border border-gray-300 px-3 py-2 text-sm font-medium shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50 ${statusBg[order.status] || "bg-gray-100 text-gray-700"}`}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() +
                              status.slice(1).toLowerCase()}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {total > 0 && (
        <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium">{paginatedOrders.length}</span> of{" "}
            <span className="font-medium">{total}</span> orders
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="cursor-pointer rounded-md border px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`rounded-md border px-3 py-1 text-sm ${num === currentPage ? "bg-secondary-dark text-white" : "text-gray-700 hover:bg-gray-100"}`}
              >
                {num}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="cursor-pointer rounded-md border px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomOrdersTable;

// import {
//   useGetAllCustomOrdersQuery,
//   useUpdateCustomOrderStatusMutation,
// } from "@/redux/features/admin/adminCustomOrder/adminCustomOrderApi";
// import PageLoader from "@/components/Shared/PageLoader";
// import { toast } from "react-hot-toast";
// import Title from "@/components/Shared/Title";

// const statusOptions = ["PENDING", "DELIVERED", "CANCELLED"];
// const statusColors: Record<string, string> = {
//   PENDING: "text-blue-600",
//   PROCESSING: "text-yellow-600",
//   DELIVERED: "text-green-600",
//   CANCELLED: "text-red-600",
// };

// const statusBg: Record<string, string> = {
//   PENDING: "bg-blue-100 text-blue-800",
//   DELIVERED: "bg-green-100 text-green-800",
//   CANCELLED: "bg-red-100 text-red-800",
// };

// const AdminCustomOrdersTable = () => {
//   const {
//     data: apiData,
//     isLoading,
//     refetch,
//   } = useGetAllCustomOrdersQuery({ limit: 10, page: 1 });

//   const [updateStatus, { isLoading: isUpdating }] =
//     useUpdateCustomOrderStatusMutation();

//   const handleStatusChange = async (id: string, status: string) => {
//     try {
//       // optional: show loading toast
//       const toastId = toast.loading("Updating order status...");
//       await updateStatus({ id, status }).unwrap();

//       toast.success("Order status updated successfully!", { id: toastId });
//       refetch();
//     } catch (err: any) {
//       console.error("Failed to update status:", err);
//       toast.error(err?.data?.message || "Failed to update status");
//     }
//   };

//   const orders = apiData?.data?.orders || [];

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <Title title="Custom Orders" />
//       </div>
//       <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
//         <div className="w-full overflow-x-auto">
//           <table className="w-full min-w-[900px]">
//             <thead className="border-b-2 border-[#DBE0E5] bg-gray-50">
//               <tr>
//                 <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
//                   Customer
//                 </th>
//                 <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
//                   T-Shirt Type
//                 </th>
//                 <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
//                   Size
//                 </th>
//                 <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
//                   Quantity
//                 </th>
//                 <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
//                   Total
//                 </th>
//                 <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
//                   Status
//                 </th>
//                 <th className="px-6 py-5 text-left text-base font-medium text-gray-500">
//                   Action
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {isLoading ? (
//                 <tr>
//                   <td colSpan={7} className="p-6 text-center text-sm">
//                     <PageLoader />
//                   </td>
//                 </tr>
//               ) : orders.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={7}
//                     className="p-6 text-center text-sm text-gray-600"
//                   >
//                     No orders found.
//                   </td>
//                 </tr>
//               ) : (
//                 orders.map((order) => (
//                   <tr
//                     key={order.id}
//                     className="border-b-2 border-gray-100 hover:bg-gray-50"
//                   >
//                     <td className="px-6 py-4 text-sm text-gray-900">
//                       {order.user?.name || order.name}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-900">
//                       {order.tShirtType}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-900">
//                       {order.size}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-900">
//                       {order.quantity}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-900">
//                       €{order.total}
//                     </td>
//                     <td
//                       className={`px-6 py-4 text-sm font-medium ${statusColors[order.status]}`}
//                     >
//                       {order.status}
//                     </td>

//                     <td className="px-6 py-4 text-sm">
//                       <select
//                         value={order.status}
//                         disabled={isUpdating}
//                         className={`focus:ring-opacity-50 w-full cursor-pointer rounded-md border border-gray-300 px-3 py-2 text-sm font-medium shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50 ${statusBg[order.status] || "bg-gray-100 text-gray-700"}`}
//                         onChange={(e) =>
//                           handleStatusChange(order.id, e.target.value)
//                         }
//                       >
//                         {statusOptions.map((status) => (
//                           <option key={status} value={status}>
//                             {status.charAt(0).toUpperCase() +
//                               status.slice(1).toLowerCase()}
//                           </option>
//                         ))}
//                       </select>
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

// export default AdminCustomOrdersTable;
