 


import { baseApi } from "@/redux/hooks/baseApi";
import type { ApiResponse } from "../../types/activity.type";
import type { Activity } from "../../types/activity.type";

export const activityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all activities or search by ID/title/description
    getActivities: builder.query<ApiResponse<Activity[]>, string | void>({
      query: (search) =>
        search
          ? `/products/activity?search=${encodeURIComponent(search)}`
          : "/products/activity",
      providesTags: (result) =>
        result
          ? [
            ...result.data.map(({ id }) => ({ type: "Activities" as const, id })),
            { type: "Activities", id: "LIST" },
          ]
          : [{ type: "Activities", id: "LIST" }],
    }),

    // Add a new activity
    addActivity: builder.mutation<ApiResponse<Activity>, FormData>({
      query: (formData) => ({
        url: "/products/create-activity",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Activities", id: "LIST" }],
    }),

    // Update activity
    updateActivity: builder.mutation<
      ApiResponse<Activity>,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/products/update-activity/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Activities", id },
        { type: "Activities", id: "LIST" },
      ],
    }),


    deleteActivity: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        // url: `/products/delet-activity/${id}`,
        url: `/products/delete-activity/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Activities", id },
        { type: "Activities", id: "LIST" },
      ],
    }),

 
    //     DeleteActivity: builder.mutation<{ id: string }, string>({
    //   query: (id) => ({
    //     url: `/products/delete-activity/${id}`, // ✅ corrected
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: (_result, _error, id) => [
    //     { type: "Activities", id },
    //     { type: "Activities", id: "LIST" },
    //   ],
    // }),


    getProductActivity: builder.query<ApiResponse<Activity>, string>({
      query: (id) => `/products/${id}/activity`,
      providesTags: (_result, _error, id) => [
        { type: "Activities", id },
        { type: "Activities", id: "LIST" },
      ],
    }),


  }),
});

export const {
  useGetActivitiesQuery,
  useAddActivityMutation,
  useUpdateActivityMutation,
  useDeleteActivityMutation,
  useGetProductActivityQuery
} = activityApi;














// import { baseApi } from "@/redux/hooks/baseApi";
// import type { ApiResponse } from "../../types/activity.type";
// import type { Activity } from "../../types/activity.type";

// export const activityApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     // Get all activities or search by ID/title/description
//     getActivities: builder.query<ApiResponse<Activity[]>, string | void>({
//       query: (search) =>
//         search
//           ? `/products/activity?search=${encodeURIComponent(search)}`
//           : "/products/activity",
//       providesTags: (result) =>
//         result
//           ? [
//               ...result.data.map(({ id }) => ({ type: "Activities" as const, id })),
//               { type: "Activities", id: "LIST" },
//             ]
//           : [{ type: "Activities", id: "LIST" }],
//     }),

//     // Add a new activity
//     addActivity: builder.mutation<ApiResponse<Activity>, FormData>({
//       query: (formData) => ({
//         url: "/products/create-activity",
//         method: "POST",
//         body: formData,
//       }),
//       invalidatesTags: [{ type: "Activities", id: "LIST" }],
//     }),

//     // Update activity
//     updateActivity: builder.mutation<
//       ApiResponse<Activity>,
//       { id: string; data: FormData }
//     >({
//       query: ({ id, data }) => ({
//         url: `/products/update-activity/${id}`,
//         method: "PATCH",
//         body: data,
//       }),
//       invalidatesTags: (result, error, { id }) => [
//         { type: "Activities", id },
//         { type: "Activities", id: "LIST" },
//       ],
//     }),

//     // Delete activity
//     deleteActivity: builder.mutation<{ id: string }, string>({
//       query: (id) => ({
//         url: `/products/delet-activity/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: (result, error, id) => [
//         { type: "Activities", id },
//         { type: "Activities", id: "LIST" },
//       ],
//     }),
//   }),
// });

// export const {
//   useGetActivitiesQuery,
//   useAddActivityMutation,
//   useUpdateActivityMutation,
//   useDeleteActivityMutation,
// } = activityApi;


















// import { baseApi } from "@/redux/hooks/baseApi";
// import type { ApiResponse } from "../../types/activity.type";
// import type { Activity } from "../../types/activity.type";

// export const activityApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     getActivities: builder.query<ApiResponse<Activity[]>, void>({
//       query: () => "/products/activity",
//       providesTags: ["Activities"],
//     }),

//     getActivity: builder.query<ApiResponse<Activity>, string>({
//       query: (id) => `/products/${id}`,
//       providesTags: ["Activities"],
//     }),

//     addActivity: builder.mutation<ApiResponse<Activity>, FormData>({
//       query: (formData) => ({
//         url: "/products/create-activity",
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
//         url: `/products/update-activity/${id}`,
//         method: "PATCH",
//         body: data,
//       }),
//       invalidatesTags: ["Activities"],
//     }),

//     deleteActivity: builder.mutation<{ id: string }, string>({
//       query: (id) => ({
//         url: `/products/delet-activity/${id}`,
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
