import { baseApi } from "@/redux/hooks/baseApi";
import type { TshirtOrderRequest, TshirtOrderResponse } from "@/redux/types/tshirtOrder.type";

export const tshirtOrderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCustomOrder: builder.mutation<TshirtOrderResponse, TshirtOrderRequest>({
      query: (customOrderData) => ({
        url: "/custom-orders",
        method: "POST",
        body: customOrderData,
      }),
    }),

    getCustomOrderById: builder.query<TshirtOrderResponse, string>({
      query: (customOrderId) => `/orders/${customOrderId}`,
    }),

    getAllCustomOrders: builder.query<TshirtOrderResponse[], void>({
      query: () => "/custom-orders",
    }),
  }),
});

export const {
  useCreateCustomOrderMutation,
  useGetCustomOrderByIdQuery,
  useGetAllCustomOrdersQuery,
} = tshirtOrderApi;
