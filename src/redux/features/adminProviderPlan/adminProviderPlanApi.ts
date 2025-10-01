import { baseApi } from "@/redux/hooks/baseApi";
import type {
  GetPlansResponse,
  Plan,
  PlanFormData,
} from "@/redux/types/adminProviderPlan.type";

export const adminProviderPlanApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminProviderPlans: build.query<GetPlansResponse, void>({
      query: () => ({ url: "/provider-plan", method: "GET" }),
      providesTags: (result) =>
        result
          ? [...result.data.map((p) => ({ type: "Plan" as const, id: p.id }))]
          : [],
    }),

    getAdminProviderPlanById: build.query<Plan, string>({
      query: (id) => ({ url: `/provider-plan/${id}`, method: "GET" }),
      providesTags: (_result, _error, id) => [{ type: "Plan" as const, id }],
    }),

    createAdminProviderPlan: build.mutation<Plan, PlanFormData>({
      query: (data) => ({
        url: "/provider-plan",
        method: "POST",
        body: data,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: [{ type: "Plan" }],
    }),

    updateAdminProviderPlan: build.mutation<Plan, { id: string; data: PlanFormData }>({
      query: ({ id, data }) => ({
        url: `/provider-plan/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Plan", id }],
    }),

    deleteAdminProviderPlan: build.mutation<void, string>({
      query: (id) => ({ url: `/provider-plan/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [{ type: "Plan", id }],
    }),
  }),
});

export const {
  useGetAdminProviderPlansQuery,
  useGetAdminProviderPlanByIdQuery,
  useCreateAdminProviderPlanMutation,
  useUpdateAdminProviderPlanMutation,
  useDeleteAdminProviderPlanMutation,
} = adminProviderPlanApi;
