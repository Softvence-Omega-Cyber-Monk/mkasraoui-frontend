
import { baseApi } from "@/redux/hooks/baseApi";
import type { IDiyBoxActivityReview } from "@/redux/types/IDiyBoxActivityReview.type";

// Helper to validate UUID format
const isValidUUID = (uuid: string) => 
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);

export const diyBoxActivityReviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all DIY box activity reviews
    getDiyBoxActivityReviews: builder.query<IDiyBoxActivityReview[], void>({
      query: () => "/review/activity",
      providesTags: ["DiyBoxActivityReviews"],
      transformResponse: (response: { data: IDiyBoxActivityReview[] }) => response.data,
    }),

    // Get single review by ID
    getDiyBoxActivityReviewById: builder.query<IDiyBoxActivityReview, string>({
      query: (id) => `/review/activity/${id}`,
      providesTags: (_result, _err, id) => [{ type: "DiyBoxActivityReviews", id }],
      transformResponse: (response: { data: IDiyBoxActivityReview }) => response.data,
    }),

    // Create new review with UUID validation
    createDiyBoxActivityReview: builder.mutation<IDiyBoxActivityReview, Partial<IDiyBoxActivityReview>>({
      query: (body) => {
        if (!body.productId || !isValidUUID(body.productId)) {
          throw new Error("Invalid productId: must be a valid UUID");
        }
        return {
          url: "/review/activity",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["DiyBoxActivityReviews"],
      transformResponse: (response: { data: IDiyBoxActivityReview }) => response.data,
    }),

    // Delete review by ID with simple error handling
    deleteDiyBoxActivityReview: builder.mutation<void, string>({
      query: (id) => ({
        url: `/review/activity/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DiyBoxActivityReviews"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDiyBoxActivityReviewsQuery,
  useGetDiyBoxActivityReviewByIdQuery,
  useCreateDiyBoxActivityReviewMutation,
  useDeleteDiyBoxActivityReviewMutation,
} = diyBoxActivityReviewApi;















// import { baseApi } from "@/redux/hooks/baseApi";
// import type { IDiyBoxActivityReview } from "@/redux/types/IDiyBoxActivityReview.type";

// export const diyBoxActivityReviewApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     // Get all DIY box activity reviews
//     getDiyBoxActivityReviews: builder.query<IDiyBoxActivityReview[], void>({
//       query: () => "/review/activity",
//       providesTags: ["DiyBoxActivityReviews"],
//       transformResponse: (response: { data: IDiyBoxActivityReview[] }) =>
//         response.data,
//     }),

//     // Get single review by ID
//     getDiyBoxActivityReviewById: builder.query<IDiyBoxActivityReview, string>({
//       query: (id) => `/review/activity/${id}`,
//       providesTags: (_result, _err, id) => [
//         { type: "DiyBoxActivityReviews", id },
//       ],
//       transformResponse: (response: { data: IDiyBoxActivityReview }) =>
//         response.data,
//     }),

//     // Create new review
//     createDiyBoxActivityReview: builder.mutation<
//       IDiyBoxActivityReview,
//       Partial<IDiyBoxActivityReview>
//     >({
//       query: (body) => ({
//         url: "/review/activity",
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["DiyBoxActivityReviews"],
//       transformResponse: (response: { data: IDiyBoxActivityReview }) =>
//         response.data,
//     }),

//     // Delete review by ID
//     deleteDiyBoxActivityReview: builder.mutation<void, string>({
//       query: (id) => ({
//         url: `/review/activity/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["DiyBoxActivityReviews"],
//     }),
//   }),
//   overrideExisting: false,
// });

// export const {
//   useGetDiyBoxActivityReviewsQuery,
//   useGetDiyBoxActivityReviewByIdQuery,
//   useCreateDiyBoxActivityReviewMutation,
//   useDeleteDiyBoxActivityReviewMutation,
// } = diyBoxActivityReviewApi;
