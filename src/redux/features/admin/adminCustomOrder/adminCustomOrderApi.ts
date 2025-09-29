// src/redux/features/admin/adminCustomOrder/adminCustomOrderApi.ts
import { baseApi } from "@/redux/hooks/baseApi";
import type {
  CustomOrder,
  CustomOrderResponse,
} from "@/redux/types/adminCustom.type";

export const adminCustomOrderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCustomOrders: builder.query<
      CustomOrderResponse,
      { limit?: number; page?: number }
    >({
      query: ({ limit = 10, page = 1 }) =>
        `/custom-orders?limit=${limit}&page=${page}`,
      providesTags: ["Orders"],
    }),

    getMyCustomOrders: builder.query<
      CustomOrderResponse,
      { limit?: number; page?: number }
    >({
      query: ({ limit = 10, page = 1 }) =>
        `/custom-orders/my-orders?limit=${limit}&page=${page}`,
      providesTags: ["Orders"],
    }),

    updateCustomOrderStatus: builder.mutation<
      CustomOrder,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/custom-orders/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetAllCustomOrdersQuery,
  useGetMyCustomOrdersQuery,
  useUpdateCustomOrderStatusMutation,
} = adminCustomOrderApi;
