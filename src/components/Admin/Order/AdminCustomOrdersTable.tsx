import {
  useGetAllCustomOrdersQuery,
  useUpdateCustomOrderStatusMutation,
} from "@/redux/features/admin/adminCustomOrder/adminCustomOrderApi";
import PageLoader from "@/components/Shared/PageLoader";

const statusOptions = ["PENDING", "DELIVERED", "CANCELLED"];
const statusColors: Record<string, string> = {
  PENDING: "text-blue-600",
  PROCESSING: "text-yellow-600",
  DELIVERED: "text-green-600",
  CANCELLED: "text-red-600",
};

const AdminCustomOrdersTable = () => {
  const {
    data: apiData,
    isLoading,
    refetch,
  } = useGetAllCustomOrdersQuery({ limit: 10, page: 1 });
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateCustomOrderStatusMutation();

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateStatus({ id, status }).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const orders = apiData?.data?.orders || [];

  return (
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
            ) : orders.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-6 text-center text-sm text-gray-600"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
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
                    ${order.total}
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
                      className="focus:ring-opacity-50 w-full cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
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
  );
};

export default AdminCustomOrdersTable;

// import {
//   useGetAllCustomOrdersQuery,
//   useUpdateCustomOrderStatusMutation,
// } from "@/redux/features/admin/adminCustomOrder/adminCustomOrderApi";

// const statusOptions = ["PENDING", "DELIVERED", "CANCELLED"];
// const statusColors: Record<string, string> = {
//   PENDING: "text-blue-600",
//   PROCESSING: "text-yellow-600",
//   DELIVERED: "text-green-600",
//   CANCELLED: "text-red-600",
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
//       await updateStatus({ id, status }).unwrap();
//       refetch();
//     } catch (err) {
//       console.error("Failed to update status:", err);
//     }
//   };

//   // Safely get orders array
//   const orders = apiData?.data?.orders || [];

//   if (isLoading) return <p>Loading orders...</p>;

//   return (
//     <div className="overflow-x-auto rounded-lg border">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
//               Customer
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
//               T-Shirt Type
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
//               Size
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
//               Quantity
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
//               Total
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
//               Status
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
//               Action
//             </th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-200 bg-white">
//           {orders.map((order) => (
//             <tr key={order.id}>
//               <td className="px-6 py-4 text-sm text-gray-900">
//                 {order.user?.name || order.name}
//               </td>
//               <td className="px-6 py-4 text-sm text-gray-900">
//                 {order.tShirtType}
//               </td>
//               <td className="px-6 py-4 text-sm text-gray-900">{order.size}</td>
//               <td className="px-6 py-4 text-sm text-gray-900">
//                 {order.quantity}
//               </td>
//               <td className="px-6 py-4 text-sm text-gray-900">
//                 ${order.total}
//               </td>
//               <td
//                 className={`px-6 py-4 text-sm font-medium ${statusColors[order.status]}`}
//               >
//                 {order.status}
//               </td>
//               <td className="px-6 py-4 text-sm">
//                 <select
//                   value={order.status}
//                   disabled={isUpdating}
//                   className="rounded border px-2 py-1 text-sm"
//                   onChange={(e) => handleStatusChange(order.id, e.target.value)}
//                 >
//                   {statusOptions.map((status) => (
//                     <option key={status} value={status}>
//                       {status}
//                     </option>
//                   ))}
//                 </select>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AdminCustomOrdersTable;
