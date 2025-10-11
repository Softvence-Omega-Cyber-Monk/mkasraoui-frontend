import { useGetMyCustomOrdersQuery } from "@/redux/features/admin/adminOrder/adminOrderApi";

const statusColors: Record<string, string> = {
  PAID: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function MyCustomOrder() {
  const { data, isLoading, isError, isFetching } = useGetMyCustomOrdersQuery({
    limit: 10,
    page: 1,
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
        ❌ Failed to fetch custom orders.
      </div>
    );

  const orders = data?.orders ?? [];

  return (
    <div>
      {/* Header Section */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Custom Orders</h1>
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
                  Name
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Address
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Product Type
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Total
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Date
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-6 text-center text-sm text-gray-600"
                  >
                    No custom orders found.
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
                      {order.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.address
                        ? order.address.split(" ").slice(0, 3).join(" ") +
                          (order.address.split(" ").length > 3 ? "..." : "")
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.tShirtType || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      ${order.total?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "-"}
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
