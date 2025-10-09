import { baseApi } from "@/redux/hooks/baseApi";
import type {
  Provider,
  ProviderResponse,
  ProvidersResponse,
} from "@/redux/types/property.type";

export const propertyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProviders: builder.query<
      ProvidersResponse,
      {
        limit?: number;
        page?: number;
        search?: string;
        price?: string;
        serviceCategory?: string;
      }
    >({
      query: ({ limit = 10, page = 1, search, price, serviceCategory }) => {
        const params = new URLSearchParams();
        params.append("limit", String(limit));
        params.append("page", String(page));
        if (search) params.append("search", search);
        if (price) params.append("price", price);
        if (serviceCategory) params.append("serviceCategory", serviceCategory);

        return {
          url: `/user/providers?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Providers"],
    }),

    getProviderById: builder.query<Provider, string>({
      query: (id) => ({
        url: `/user/providers/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ProviderResponse) => response.data,
      providesTags: ["Providers"],
    }),

    requestProvider: builder.mutation<ProviderResponse, FormData>({
      query: (formData) => ({
        url: "/user/request-provider",
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["Providers"],
    }),

    // ✅ Update Provider Profile (with images)
    updateProviderProfile: builder.mutation<ProviderResponse, FormData>({
      query: (formData) => ({
        url: "/user/provider/update-profile",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Providers"],
    }),

    // ---- New mutations for approve / reject provider requests ----
    approveProviderRequest: builder.mutation<ProviderResponse, string>({
      query: (id) => ({
        url: `/user/provider-requests/${id}/approve`,
        method: "PATCH",
      }),
      // refresh list after approving
      invalidatesTags: ["Providers"],
    }),

    rejectProviderRequest: builder.mutation<ProviderResponse, string>({
      query: (id) => ({
        url: `/user/provider-requests/${id}/reject`,
        method: "DELETE",
      }),
      // refresh list after rejecting
      invalidatesTags: ["Providers"],
    }),
  }),
});

export const {
  useGetProvidersQuery,
  useGetProviderByIdQuery,
  useRequestProviderMutation,
  useUpdateProviderProfileMutation, // ✅ export new mutation
  useApproveProviderRequestMutation,
  useRejectProviderRequestMutation,
} = propertyApi;

// import { baseApi } from "@/redux/hooks/baseApi";
// import type {
//   Provider,
//   ProviderResponse,
//   ProvidersResponse,
// } from "@/redux/types/property.type";

// export const propertyApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     getProviders: builder.query<
//       ProvidersResponse,
//       {
//         limit?: number;
//         page?: number;
//         search?: string;
//         price?: string;
//         serviceCategory?: string;
//       }
//     >({
//       query: ({
//         limit = 10,
//         page = 1,
//         search,
//         price,
//         serviceCategory,
//       }) => {
//         const params = new URLSearchParams();
//         params.append("limit", String(limit));
//         params.append("page", String(page));
//         if (search) params.append("search", search);
//         if (price) params.append("price", price);
//         if (serviceCategory) params.append("serviceCategory", serviceCategory);

//         return {
//           url: `/user/providers?${params.toString()}`,
//           method: "GET",
//         };
//       },
//       providesTags: ["Providers"],
//     }),

//     getProviderById: builder.query<Provider, string>({
//       query: (id) => ({
//         url: `/user/providers/${id}`,
//         method: "GET",
//       }),
//       transformResponse: (response: ProviderResponse) => response.data, // ✅ directly return Provider
//       providesTags: ["Providers"],
//     }),

//     requestProvider: builder.mutation<ProviderResponse, FormData>({
//       query: (formData) => ({
//         url: "/user/request-provider",
//         method: "POST",
//         body: formData,
//       }),
//       invalidatesTags: ["Providers"],
//     }),

//     // ---- New mutations for approve / reject provider requests ----
//     approveProviderRequest: builder.mutation<ProviderResponse, string>({
//       query: (id) => ({
//         url: `/user/provider-requests/${id}/approve`,
//         method: "PATCH",
//       }),
//       // refresh list after approving
//       invalidatesTags: ["Providers"],
//     }),

//     rejectProviderRequest: builder.mutation<ProviderResponse, string>({
//       query: (id) => ({
//         url: `/user/provider-requests/${id}/reject`,
//         method: "DELETE",
//       }),
//       // refresh list after rejecting
//       invalidatesTags: ["Providers"],
//     }),
//   }),
// });

// export const {
//   useGetProvidersQuery,
//   useGetProviderByIdQuery,
//   useRequestProviderMutation,
//   useApproveProviderRequestMutation,
//   useRejectProviderRequestMutation,
// } = propertyApi;
