import { baseApi } from "@/redux/hooks/baseApi";
import type { Provider, ProvidersResponse } from "@/redux/types/property.type";

export const propertyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProviders: builder.query<
      ProvidersResponse,
      {
        limit?: number;
        page?: number;
        search?: string;
        priceRange?: string;
        serviceCategory?: string;
      }
    >({
      query: ({ limit = 10, page = 1, search, priceRange, serviceCategory }) => {
        const params = new URLSearchParams();
        params.append("limit", String(limit));
        params.append("page", String(page));
        if (search) params.append("search", search);
        if (priceRange) params.append("priceRange", priceRange);
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
      providesTags: ["Providers"],
    }),
  }),
});

export const { useGetProvidersQuery, useGetProviderByIdQuery } = propertyApi;



// // src/redux/features/property/propertyApi.ts
// import { baseApi } from "@/redux/hooks/baseApi";
// import type { Provider, ProvidersResponse } from "@/redux/types/property.type";


// export const propertyApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     getProviders: builder.query<ProvidersResponse, { limit?: number; page?: number }>({
//       query: ({ limit = 10, page = 1 }) => ({
//         url: `/user/providers?limit=${limit}&page=${page}`,
//         method: "GET",
//       }),
//       providesTags: ["Providers"],
//     }),
//     getProviderById: builder.query<Provider, string>({
//       query: (id) => ({
//         url: `/user/providers/${id}`,
//         method: "GET",
//       }),
//       providesTags: ["Providers"],
//     }),
//   }),
// });

// export const { useGetProvidersQuery, useGetProviderByIdQuery } = propertyApi;
