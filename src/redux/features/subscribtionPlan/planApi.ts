// src/redux/features/plan/planApi.ts
import { baseApi } from "@/redux/hooks/baseApi";
import type {
  GetPlansResponse,
  Plan,
  PlanFormData,
} from "@/redux/types/subscribtionPlan.type";

export const planApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get all plans
    getPlans: build.query<GetPlansResponse, void>({
      query: () => ({ url: "/plan", method: "GET" }),
      providesTags: (result) =>
        result
          ? [...result.data.map((p) => ({ type: "Plan" as const, id: p.id }))]
          : [],
    }),

    // Get single plan
    getPlanById: build.query<Plan, string>({
      query: (id) => ({
        url: `/plan/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Plan" as const, id }],
    }),

    // Create a new plan
    createPlan: build.mutation<Plan, PlanFormData>({
      query: (data) => ({
        url: "/plan",
        method: "POST",
        body: {
          ...data,
          price: Number(data.price), // ensure number
          features: data.features?.filter(Boolean) || [],
        },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [{ type: "Plan" as const }],
    }),



    updatePlan: build.mutation<Plan, { id: string; data: PlanFormData }>({
      query: ({ id, data }) => ({
        url: `/plan/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Plan", id }],
    }),
    deletePlan: build.mutation<void, string>({
      query: (id) => ({
        url: `/plan/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Plan", id }],
    }),
  }),
});

export const {
  useGetPlansQuery,
  useGetPlanByIdQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} = planApi;

// import { baseApi } from "@/redux/hooks/baseApi";
// import type { Plan, PlanFormData } from "@/redux/types/subscribtionPlan.type";

// export const planApi = baseApi.injectEndpoints({
//   endpoints: (build) => ({
//     getPlans: build.query<Plan[], void>({
//       query: () => ({
//         url: "/plans",
//         method: "GET",
//       }),
//       providesTags: (result) =>
//         result
//           ? [
//               ...result.map(({ id }) => ({ type: "Plan" as const, id })),
//               { type: "Plan" },
//             ]
//           : [{ type: "Plan" }],
//     }),
//     getPlanById: build.query<Plan, string>({
//       query: (id) => ({
//         url: `/plans/${id}`,
//         method: "GET",
//       }),
//       providesTags: (_result, _error, id) => [{ type: "Plan", id }],
//     }),
//     createPlan: build.mutation<Plan, PlanFormData>({
//       query: ({ isPopular, ...data }) => ({
//         url: "/plans",
//         method: "POST",
//         body: {
//           ...data,
//           price: Number(data.price),
//           features: data.features?.filter(Boolean) || [],
//         },
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }),
//       invalidatesTags: [{ type: "Plan" }],
//     }),

//      updatePlan: build.mutation<Plan, { id: string; data: PlanFormData }>({
//       query: ({ id, data }) => ({
//         url: `/plans/${id}`,
//         method: "PATCH",
//         body: data,
//       }),
//       invalidatesTags: (_result, _error, { id }) => [{ type: "Plan", id }],
//     }),

//     deletePlan: build.mutation<void, string>({
//       query: (id) => ({
//         url: `/plans/${id}`,
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }),
//       invalidatesTags: (_result, _error, id) => [{ type: "Plan", id }],
//     }),
//   }),
// });

// export const {
//   useGetPlansQuery,
//   useGetPlanByIdQuery,
//   useCreatePlanMutation,
//   useUpdatePlanMutation,
//   useDeletePlanMutation,
// } = planApi;
