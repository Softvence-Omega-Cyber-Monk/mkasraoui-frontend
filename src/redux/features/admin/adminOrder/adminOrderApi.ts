// src/redux/features/adminOrder/adminOrderApi.ts
import { baseApi } from "@/redux/hooks/baseApi";
import type {
  CustomOrderResponse,
  OrderResponse,
} from "@/redux/types/adminOder.type";

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

    getMyCustomOrders: builder.query<
      {
        meta: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
        orders: CustomOrderResponse[];
      },
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) =>
        `/custom-orders/my-orders?limit=${limit}&page=${page}`,
      providesTags: ["Orders"],
      transformResponse: (response: any) => {
        // Match Swagger response format
        return {
          meta: response?.data?.meta,
          orders: response?.data?.orders,
        };
      },
    }),

    /* <OrderResponse> */
    getMyOrders: builder.query<
      {
        meta: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
        orders: OrderResponse[];
      },
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) =>
        `/orders/my-orders?limit=${limit}&page=${page}`,
      providesTags: ["Orders"],
      transformResponse: (response: any) => ({
        meta: response?.data?.meta,
        orders: response?.data?.orders,
      }),
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetMyCustomOrdersQuery,
  useGetMyOrdersQuery,
} = adminOrderApi;
