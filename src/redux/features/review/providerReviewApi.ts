import { baseApi } from "@/redux/hooks/baseApi";
import type { IProviderReview } from "@/redux/types/review.type";

export const providerReviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all reviews
    getProviderReviews: builder.query<IProviderReview[], void>({
      query: () => "/provider-review",
      providesTags: ["ProviderReviews"],
      transformResponse: (response: { data: IProviderReview[] }) =>
        response.data,
    }),

    // Get single review by id
    getProviderReviewById: builder.query<IProviderReview, string>({
      query: (id) => `/provider-review/${id}`,
      providesTags: (_result, _err, id) => [{ type: "ProviderReviews", id }],
      transformResponse: (response: { data: IProviderReview }) => response.data,
    }),

    // Create new review
    createProviderReview: builder.mutation<
      IProviderReview,
      Partial<IProviderReview>
    >({
      query: (body) => ({
        url: "/provider-review",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ProviderReviews"],
      transformResponse: (response: { data: IProviderReview }) => response.data,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProviderReviewsQuery,
  useGetProviderReviewByIdQuery,
  useCreateProviderReviewMutation,
} = providerReviewApi;
