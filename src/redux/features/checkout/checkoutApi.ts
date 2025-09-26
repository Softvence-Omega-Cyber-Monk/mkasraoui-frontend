// src/redux/features/checkout/checkoutApi.ts
import { baseApi } from "@/redux/hooks/baseApi";

export interface CheckoutItem {
  id: string | number;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}


export interface CheckoutRequest {
  items: CheckoutItem[];
}

export interface CheckoutResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    url: string;
  };
}

export const checkoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCheckout: builder.mutation<CheckoutResponse, CheckoutRequest>({
      query: (body) => ({
        url: "/checkout/payment",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateCheckoutMutation } = checkoutApi;
