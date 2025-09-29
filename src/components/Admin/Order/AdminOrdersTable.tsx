"use client";

import Title from "@/components/Shared/Title";
import { toast } from "react-hot-toast";

import type { OrderResponse } from "@/redux/types/adminOder.type";
import {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/redux/features/admin/adminOrder/adminOrderApi";
import PageLoader from "@/components/Shared/PageLoader";

const statusColors: Record<string, string> = {
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
  const { data, isLoading, isFetching } = useGetOrdersQuery({
    page: 1,
    limit: 10,
  });
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await updateStatus({ id: orderId, status }).unwrap();
      toast.success("Order status updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order status");
    }
  };

  const orders = data?.data?.orders || [];

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
                {/* <th className="px-6 py-5 text-left text-base font-medium text-gray-700">
                  Order ID
                </th> */}
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
                    colSpan={7}
                    className="p-6 text-center text-sm text-gray-500"
                  >
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
                orders.map((order: OrderResponse) => (
                  <tr
                    key={order.id}
                    className="border-b-2 border-gray-100 hover:bg-gray-50"
                  >
                    {/* Order ID */}
                    {/* <td className="px-6 py-4 font-mono text-xs text-gray-900">
                      {order.id.slice(0, 8)}...
                    </td> */}

                    {/* Customer */}
                    <td className="px-6 py-4 text-xs text-gray-600">
                      <div className="text-sm font-medium">
                        {order.user.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.user.email}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      ${order.total.toFixed(2)}
                    </td>

                    {/* Items */}
                    <td className="px-6 py-4 text-xs text-gray-600">
                      {order.items
                        .map((item) => item.product.title)
                        .join(" ")
                        .split(" ")
                        .slice(0, 3)
                        .join(" ")}
                    </td>

                    {/* Created At */}
                    <td className="px-6 py-4 text-xs text-gray-600">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      {order.status}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-xs">
                      <select
                        className={`w-full min-w-30 cursor-pointer rounded-lg border border-none border-gray-300 px-3 py-2 text-sm font-medium shadow-sm transition-colors duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 ${statusColors[order.status]}`}
                        value={order.status}
                        disabled={isUpdating}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                      >
                        {statusOptions.map((status) => (
                          <option
                            key={status}
                            value={status}
                            className="cursor-pointer border-none"
                          >
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
    </div>
  );
};

export default AdminOrdersTable;
