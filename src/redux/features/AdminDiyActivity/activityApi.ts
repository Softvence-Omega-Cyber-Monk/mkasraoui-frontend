// import { baseApi } from "@/redux/hooks/baseApi";
// import type { ApiResponse } from "@/redux/types/api.type";
// import type { Activity } from "@/redux/types/activity.type";

// export const activityApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     getActivities: builder.query<ApiResponse<Activity[]>, void>({
//       query: () => "/activity",
//       providesTags: ["Activities"],
//     }),

//     getActivity: builder.query<ApiResponse<Activity>, string>({
//       query: (id) => `/activity/${id}`,
//       providesTags: ["Activities"],
//     }),

//     addActivity: builder.mutation<ApiResponse<Activity>, FormData>({
//       query: (formData) => ({
//         url: "/activity",
//         method: "POST",
//         body: formData,
//       }),
//       invalidatesTags: ["Activities"],
//     }),

//     updateActivity: builder.mutation<
//       ApiResponse<Activity>,
//       { id: string; data: FormData }
//     >({
//       query: ({ id, data }) => ({
//         url: `/activity/${id}`,
//         method: "PATCH",
//         body: data,
//       }),
//       invalidatesTags: ["Activities"],
//     }),

//     deleteActivity: builder.mutation<{ id: string }, string>({
//       query: (id) => ({
//         url: `/activity/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Activities"],
//     }),
//   }),
// });

// export const {
//   useGetActivitiesQuery,
//   useGetActivityQuery,
//   useAddActivityMutation,
//   useUpdateActivityMutation,
//   useDeleteActivityMutation,
// } = activityApi;
