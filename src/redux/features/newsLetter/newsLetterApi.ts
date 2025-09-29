import { baseApi } from "@/redux/hooks/baseApi";
import type { Newsletter, PromotionalMailPayload, SubscribePayload } from "@/redux/types/newsLetter";

export const newsLetterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNewsletters: builder.query<Newsletter[], void>({
      query: () => ({
        url: "/news-letter",
        method: "GET",
      }),
      providesTags: ["NewsLetter"],
      transformResponse: (response: any) => response.data,
    }),

    getNewsletterById: builder.query<Newsletter, string>({
      query: (id) => ({
        url: `/news-letter/${id}`,
        method: "GET",
      }),
    }),

    subscribeNewsletter: builder.mutation<Newsletter, SubscribePayload>({
      query: (body) => ({
        url: "/news-letter",
        method: "POST",
        body,
      }),
      invalidatesTags: ["NewsLetter"],
    }),

    deleteNewsletter: builder.mutation<{ success: boolean }, string>({
      query: (idOrEmail) => ({
        url: `/news-letter/${idOrEmail}`,
        method: "DELETE",
      }),
      invalidatesTags: ["NewsLetter"],
    }),

    sendPromotionalMail: builder.mutation<{ success: boolean }, PromotionalMailPayload>({
      query: (body) => ({
        url: "/news-letter/promotional-mail",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetAllNewslettersQuery,
  useGetNewsletterByIdQuery,
  useSubscribeNewsletterMutation,
  useDeleteNewsletterMutation,
  useSendPromotionalMailMutation,
} = newsLetterApi;
