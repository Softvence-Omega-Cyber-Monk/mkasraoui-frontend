import { baseApi } from "@/redux/hooks/baseApi";
import type { QuoteRequest, QuoteResponse } from "@/redux/types/quotes.type";

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
  }),
});

export const { useCreateQuoteMutation } = quotesApi;
