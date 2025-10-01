// src/redux/features/subscription/subscriptionApi.ts
import { baseApi } from "@/redux/hooks/baseApi";
import type { SubscriptionRequest, SubscriptionResponse } from "@/redux/types/subscription.type";

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSubscription: builder.mutation<SubscriptionResponse, SubscriptionRequest>({
      query: (body) => ({
        url: "/subscription/payment",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateSubscriptionMutation } = subscriptionApi;
