// src/redux/features/adminOrder/adminOrderApi.ts
import { baseApi } from "@/redux/hooks/baseApi";
import type { OrderResponse } from "@/redux/types/adminOder.type";

export const adminOrderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<
      { meta: any; data: { orders: OrderResponse[] } }, // 👈 now has "data.orders"
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) =>
        `/orders?page=${page}&limit=${limit}`,
      providesTags: ["Orders"],
    }),

    updateOrderStatus: builder.mutation<
      OrderResponse,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const { useGetOrdersQuery, useUpdateOrderStatusMutation } =
  adminOrderApi;
