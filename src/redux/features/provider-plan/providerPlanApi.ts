// src/redux/features/providerPlan/providerPlanApi.ts
import { baseApi } from "@/redux/hooks/baseApi";// your baseApi setup
import type { ProviderPlanResponse, ProviderPlan } from "./providerPlanSlice";

export const providerPlanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProviderPlans: builder.query<
      ProviderPlan[],
      void
    >({
      query: () => "/provider-plan", // replace with your actual API route
      transformResponse: (response: ProviderPlanResponse) => response.data, 
      providesTags: ["ProviderPlans"],
    }),
    
  }),
});

export const { useGetProviderPlansQuery } = providerPlanApi;
