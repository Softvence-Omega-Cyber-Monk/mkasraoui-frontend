// src/redux/features/checkout/checkoutApi.ts
import { baseApi } from "@/redux/hooks/baseApi";

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface ShippingInfo {
  name: string;
  phone: string;
  city: string;
  state: string;
  zipCode: string;
  address: string;
}

export interface OrderRequest {
  items: OrderItem[];
  totalPrice: number;
  shippingFee: number;
  shippingInfo: ShippingInfo;
  additionalNotes?: string;
}

export interface OrderResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    checkoutUrl: string;
    orderId: string;
    paymentUrl?: string; // if API gives redirect link
  };
}

export const checkoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<OrderResponse, OrderRequest>({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateOrderMutation } = checkoutApi;
