import { baseApi } from "@/redux/hooks/baseApi";
import type { PlansResponse, Plan } from "@/redux/types/plan.types";

export const plansApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query<PlansResponse, void>({
      query: () => "/plan", 
      transformResponse: (response: PlansResponse) => response,
    }),
    getActivePlans: builder.query<Plan[], void>({
      query: () => "/plan",
      transformResponse: (response: PlansResponse) =>
        response.data.filter((plan) => plan.is_active),
    }),
  }),
});

export const { useGetPlansQuery, useGetActivePlansQuery } = plansApi;
