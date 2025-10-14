import { useGetMyOrdersQuery } from "@/redux/features/admin/adminOrder/adminOrderApi";

const statusColors: Record<string, string> = {
  PAID: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function MyGeneralOrder() {
  const { data, isLoading, isError, isFetching } = useGetMyOrdersQuery({
    page: 1,
    limit: 10,
  });

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (isError)
    return (
      <div className="p-6 text-center font-medium text-red-500">
        ❌ Failed to fetch orders.
      </div>
    );

  const orders = data?.orders ?? [];

  return (
    <div>
      {/* Header Section */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Orders Products</h1>
        {data?.meta?.total && (
          <span className="text-sm font-medium text-gray-700">
            Total Orders: {data.meta.total}
          </span>
        )}
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b-2 border-[#DBE0E5] bg-gray-50">
              <tr>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  No
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Product
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Total
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Address
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-6 text-center text-sm text-gray-600"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order: any, index: number) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                      {order.items?.[0]?.product?.title || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      ${order.total?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          statusColors[order.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.address
                        ? order.address.split(" ").slice(0, 6).join(" ") +
                          (order.address.split(" ").length > 6 ? "..." : "")
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "-"}
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
}

// import { useGetMyOrdersQuery } from "@/redux/features/admin/adminOrder/adminOrderApi";

// export default function MyGeneralOrder() {
//   const { data, isLoading, isError } = useGetMyOrdersQuery({
//     page: 1,
//     limit: 10,
//   });

//   if (isLoading) return <p>Loading...</p>;
//   if (isError) return <p>Failed to load orders.</p>;

//   return (
//     <div className="p-6">
//       <h1 className="mb-4 text-xl font-semibold">My Orders</h1>

//       <table className="min-w-full overflow-hidden rounded-lg border border-gray-200">
//         <thead className="bg-gray-100 text-gray-700">
//           <tr>
//             <th className="px-4 py-2 text-left">#</th>
//             <th className="px-4 py-2 text-left">Product</th>
//             <th className="px-4 py-2 text-left">Total</th>
//             <th className="px-4 py-2 text-left">Status</th>
//             <th className="px-4 py-2 text-left">Address</th>
//             <th className="px-4 py-2 text-left">Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data?.orders?.map((order, index) => (
//             <tr key={order.id} className="border-b">
//               <td className="px-4 py-2">{index + 1}</td>
//               <td className="px-4 py-2">
//                 {order.items[0]?.product?.title || "N/A"}
//               </td>
//               <td className="px-4 py-2">${order.total}</td>
//               <td className="px-4 py-2">
//                 <span
//                   className={`rounded-full px-2 py-1 text-xs font-semibold ${
//                     order.status === "PAID"
//                       ? "bg-green-100 text-green-700"
//                       : "bg-yellow-100 text-yellow-700"
//                   }`}
//                 >
//                   {order.status}
//                 </span>
//               </td>
//               <td className="px-4 py-2">
//                 {order.address.split(" ").slice(0, 6).join(" ")}
//               </td>
//               <td className="px-4 py-2">
//                 {new Date(order.createdAt).toLocaleDateString()}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
