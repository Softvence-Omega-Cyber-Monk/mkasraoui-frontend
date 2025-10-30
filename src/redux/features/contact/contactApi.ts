import { baseApi } from "@/redux/hooks/baseApi";
import type { TContact, TContactResponse } from "@/redux/types/contact.type";

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /contact
    createContact: builder.mutation<TContactResponse, TContact>({
      query: (body) => ({
        url: "/contact",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Contact"],
    }),

    // GET /contact
    getAllContacts: builder.query<TContactResponse, void>({
      query: () => ({
        url: "/contact",
        method: "GET",
      }),
      providesTags: ["Contact"],
    }),

    // GET /contact/{id}
    getContactById: builder.query<TContactResponse, string>({
      query: (id) => ({
        url: `/contact/${id}`,
        method: "GET",
      }),
      providesTags: ["Contact"],
    }),

    // DELETE /contact/{id}
    deleteContact: builder.mutation<TContactResponse, string>({
      query: (id) => ({
        url: `/contact/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contact"],
    }),
  }),
});

export const {
  useCreateContactMutation,
  useGetAllContactsQuery,
  useGetContactByIdQuery,
  useDeleteContactMutation,
} = contactApi;
