import { baseApi } from "@/redux/hooks/baseApi";
import type {
  ApiResponse,
  PaginatedResponse,
  QuoteRequest,
  QuoteResponse,
} from "@/redux/types/quotes.type";

export const quotesApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    createQuote: builder.mutation<{ data: QuoteResponse }, QuoteRequest>({
      query: (body) => ({
        url: "/quotes",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Quotes", "Providers"],
    }),
    /* dfgfd */

    // ✅ Fetch user’s own quotes
    getMyQuotes: builder.query<
      ApiResponse<PaginatedResponse<QuoteResponse>>, // ✅ Updated type
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) =>
        `/quotes/my?page=${page}&limit=${limit}`,
      providesTags: ["Quotes"],
    }),

    // ✅ Cancel quote (User only)
    cancelQuote: builder.mutation<{ data: QuoteResponse }, { id: string }>({
      query: ({ id }) => ({
        url: `/quotes/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["Quotes"],
    }),

    // ✅ Fetch provider quotes (Provider only)
    getProviderQuotes: builder.query<
      ApiResponse<PaginatedResponse<QuoteResponse>>, // ✅ Wrap in ApiResponse
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) =>
        `/quotes/provider/my?page=${page}&limit=${limit}`,
      providesTags: ["Quotes"],
    }),

    /* Payment */
    // checkoutPayment: builder.mutation<
    //   { url: string }, // ✅ API returns a redirect URL
    //   { quoteId: string }
    // >({
    //   query: ({ quoteId }) => ({
    //     url: "/provider/payment/checkout",
    //     method: "POST",
    //     body: { quoteId },
    //   }),
    //   invalidatesTags: ["Quotes"],
    // }),

    checkoutPayment: builder.mutation<
      { data: { url: string } },
      { quoteId: string }
    >({
      query: ({ quoteId }) => ({
        url: "/provider/payment/checkout",
        method: "POST",
        body: { quoteId },
      }),
      invalidatesTags: ["Quotes"],
    }),

    // ✅ Update quote status (Provider only)
    updateQuoteStatus: builder.mutation<
      { data: QuoteResponse },
      { id: string; status: "BOOKED" | "CANCELLED" }
    >({
      query: ({ id, status }) => ({
        url: `/quotes/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Quotes"],
    }),
  }),
});

export const {
  useCreateQuoteMutation,
  useGetMyQuotesQuery,
  useGetProviderQuotesQuery,
  useUpdateQuoteStatusMutation,
  useCancelQuoteMutation,
  useCheckoutPaymentMutation,
} = quotesApi;
