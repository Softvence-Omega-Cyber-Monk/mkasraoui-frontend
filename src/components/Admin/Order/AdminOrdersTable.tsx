import { useState } from "react";
import Title from "@/components/Shared/Title";
import PageLoader from "@/components/Shared/PageLoader";
import { toast } from "react-hot-toast";
import type { OrderResponse } from "@/redux/types/adminOder.type";
import {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  adminOrderApi,
} from "@/redux/features/admin/adminOrder/adminOrderApi";

const statusText: Record<string, string> = {
  PENDING: "text-blue-600",
  DELIVERED: "text-green-600",
  CANCELLED: "text-red-600",
};

const statusBg: Record<string, string> = {
  PENDING: "bg-blue-100 text-blue-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const statusOptions: OrderResponse["status"][] = [
  "PENDING",
  "DELIVERED",
  "CANCELLED",
];

const AdminOrdersTable: React.FC = () => {
  const ordersPerPage = 9; // items per page
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isFetching } = useGetOrdersQuery({
    page: 1,
    limit: 1000000, // fetch all for frontend pagination
  });

  const [updateStatus] = useUpdateOrderStatusMutation();
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const orders = data?.data?.orders || [];
  const total = orders.length;
  const totalPages = Math.ceil(total / ordersPerPage);

  const paginatedOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage,
  );

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      setUpdatingOrderId(orderId);
      const toastId = toast.loading("Updating order status...");

      await updateStatus({ id: orderId, status }).unwrap();

      // Update cache correctly
      adminOrderApi.util.updateQueryData(
        "getOrders",
        { page: 1, limit: 100000 },
        (draft) => {
          const order = draft.data.orders.find((o) => o.id === orderId);
          if (order) order.status = status;
        },
      );

      toast.success("Order status updated successfully!", { id: toastId });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Title title="All Orders" />
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
                  Total
                </th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
                  Items
                </th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
                  Created At
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
                  <td
                    colSpan={6}
                    className="p-6 text-center text-sm text-gray-500"
                  >
                    <PageLoader />
                  </td>
                </tr>
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-6 text-center text-sm text-gray-600"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order: OrderResponse) => (
                  <tr
                    key={order.id}
                    className="border-b-2 border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-xs text-gray-600">
                      <div className="text-sm font-medium">
                        {order.user.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      €{order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      {order.items
                        .map((item) => item.product.title)
                        .join(" ")
                        .split(" ")
                        .slice(0, 3)
                        .join(" ")}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm font-semibold ${statusText[order.status]}`}
                    >
                      {order.status.charAt(0) +
                        order.status.slice(1).toLowerCase()}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <select
                        value={order.status}
                        disabled={updatingOrderId === order.id}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className={`w-full cursor-pointer rounded-md border border-gray-300 px-3 py-2 text-sm font-medium shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50 ${statusBg[order.status]} ${statusText[order.status]}`}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0) + status.slice(1).toLowerCase()}
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

      {/* Pagination */}
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

export default AdminOrdersTable;

// import Title from "@/components/Shared/Title";
// import { toast } from "react-hot-toast";
// import type { OrderResponse } from "@/redux/types/adminOder.type";
// import {
//   useGetOrdersQuery,
//   useUpdateOrderStatusMutation,
//   adminOrderApi,
// } from "@/redux/features/admin/adminOrder/adminOrderApi";
// import PageLoader from "@/components/Shared/PageLoader";
// import { useState } from "react";

// // Status text and background colors
// const statusText: Record<string, string> = {
//   PENDING: "text-blue-600",
//   DELIVERED: "text-green-600",
//   CANCELLED: "text-red-600",
// };

// const statusBg: Record<string, string> = {
//   PENDING: "bg-blue-100 text-blue-800",
//   DELIVERED: "bg-green-100 text-green-800",
//   CANCELLED: "bg-red-100 text-red-800",
// };

// const statusOptions: OrderResponse["status"][] = [
//   "PENDING",
//   "DELIVERED",
//   "CANCELLED",
// ];

// const AdminOrdersTable: React.FC = () => {
//   const { data, isLoading, isFetching } = useGetOrdersQuery({
//     page: 1,
//     limit: 100000,
//   });

//   const [updateStatus] = useUpdateOrderStatusMutation();
//   const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

//   const handleStatusChange = async (orderId: string, status: string) => {
//     try {
//       setUpdatingOrderId(orderId);
//       const toastId = toast.loading("Updating order status...");

//       // Update server
//       await updateStatus({ id: orderId, status }).unwrap();

//       // Optimistically update cache
//       adminOrderApi.util.updateQueryData(
//         "getOrders",
//         { page: 1, limit: 10 },
//         (draft) => {
//           const order = draft.data.orders.find((o) => o.id === orderId);
//           if (order) order.status = status;
//         },
//       );

//       toast.success("Order status updated successfully!", { id: toastId });
//     } catch (error: any) {
//       console.error(error);
//       toast.error(error?.data?.message || "Failed to update order status");
//     } finally {
//       setUpdatingOrderId(null);
//     }
//   };

//   const orders = data?.data?.orders || [];

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <Title title="All Orders" />
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
//                   Total
//                 </th>
//                 <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
//                   Items
//                 </th>
//                 <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
//                   Created At
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
//               {isLoading || isFetching ? (
//                 <tr>
//                   <td
//                     colSpan={7}
//                     className="p-6 text-center text-sm text-gray-500"
//                   >
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
//                 orders.map((order: OrderResponse) => (
//                   <tr
//                     key={order.id}
//                     className="border-b-2 border-gray-100 hover:bg-gray-50"
//                   >
//                     {/* Customer */}
//                     <td className="px-6 py-4 text-xs text-gray-600">
//                       <div className="text-sm font-medium">
//                         {order.user.name}
//                       </div>
//                       <div className="text-xs text-gray-500">
//                         {order.user.email}
//                       </div>
//                     </td>

//                     {/* Total */}
//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       €{order.total.toFixed(2)}
//                     </td>

//                     {/* Items */}
//                     <td className="px-6 py-4 text-xs text-gray-600">
//                       {order.items
//                         .map((item) => item.product.title)
//                         .join(" ")
//                         .split(" ")
//                         .slice(0, 3)
//                         .join(" ")}
//                     </td>

//                     {/* Created At */}
//                     <td className="px-6 py-4 text-xs text-gray-600">
//                       {new Date(order.createdAt).toLocaleString()}
//                     </td>

//                     {/* Status Text */}
//                     <td
//                       className={`px-6 py-4 text-sm font-semibold ${statusText[order.status]}`}
//                     >
//                       {order.status.charAt(0) +
//                         order.status.slice(1).toLowerCase()}
//                     </td>

//                     {/* Status Dropdown */}
//                     <td className="px-6 py-4 text-xs">
//                       <select
//                         value={order.status}
//                         disabled={updatingOrderId === order.id}
//                         onChange={(e) =>
//                           handleStatusChange(order.id, e.target.value)
//                         }
//                         className={`w-full cursor-pointer rounded-md border border-gray-300 px-3 py-2 text-sm font-medium shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50 ${statusBg[order.status]} ${statusText[order.status]}`}
//                       >
//                         {statusOptions.map((status) => (
//                           <option key={status} value={status}>
//                             {status.charAt(0) + status.slice(1).toLowerCase()}
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

// export default AdminOrdersTable;
