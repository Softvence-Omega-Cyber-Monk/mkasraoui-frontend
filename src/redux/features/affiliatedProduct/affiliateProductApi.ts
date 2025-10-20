import { baseApi } from "@/redux/hooks/baseApi";
import type { IAffiliatedProduct, AffiliatedProductPayload, IAffiliatedProductResponse } from "@/redux/types/IAffiliatedProduct.type";

const isValidUUID = (uuid: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);

export const affiliateProductApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAffiliateProducts: builder.query<IAffiliatedProductResponse, { search?: string; company?: string; limit?: number; page?: number } | void>({
      query: (params) => {
        const queryString = new URLSearchParams(
          Object.entries(params || {}).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null) acc[key] = String(value);
            return acc;
          }, {} as Record<string, string>)
        ).toString();
        return `/affiliate-product${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["AffiliateProducts"],
      transformResponse: (response: { data: IAffiliatedProductResponse }) => response.data,
    }),

    getAffiliateProductById: builder.query<IAffiliatedProduct, string>({
      query: (id) => `/affiliate-product/${id}`,
      providesTags: (_result, _err, id) => [{ type: "AffiliateProducts", id }],
      transformResponse: (response: { data: IAffiliatedProduct }) => response.data,
    }),

    createAffiliateProduct: builder.mutation<IAffiliatedProduct, AffiliatedProductPayload>({
      query: (body) => ({ url: "/affiliate-product", method: "POST", body }),
      invalidatesTags: ["AffiliateProducts"],
      transformResponse: (response: { data: IAffiliatedProduct }) => response.data,
    }),

    updateAffiliateProduct: builder.mutation<IAffiliatedProduct, { id: string; body: AffiliatedProductPayload }>({
      query: ({ id, body }) => {
        if (!isValidUUID(id)) throw new Error("Invalid UUID");
        return { url: `/affiliate-product/${id}`, method: "PATCH", body };
      },
      invalidatesTags: (_res, _err, { id }) => [{ type: "AffiliateProducts", id }],
      transformResponse: (response: { data: IAffiliatedProduct }) => response.data,
    }),

    deleteAffiliateProduct: builder.mutation<void, string>({
      query: (id) => ({ url: `/affiliate-product/${id}`, method: "DELETE" }),
      invalidatesTags: ["AffiliateProducts"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAffiliateProductsQuery,
  useGetAffiliateProductByIdQuery,
  useCreateAffiliateProductMutation,
  useUpdateAffiliateProductMutation,
  useDeleteAffiliateProductMutation,
} = affiliateProductApi;



// import { baseApi } from "@/redux/hooks/baseApi";
// import type { IAffiliatedProduct } from "@/redux/types/IAffiliatedProduct.type";

// // Helper to validate UUID
// const isValidUUID = (uuid: string) =>
//   /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);

// export const affiliateProductApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     // ✅ GET all affiliate products (with optional query filters)
//     getAffiliateProducts: builder.query<
//       IAffiliatedProduct[],
//       { search?: string; company?: string; limit?: number; page?: number } | void
//     >({
//       query: (params) => {
//         const queryString = new URLSearchParams(
//           Object.entries(params || {}).reduce((acc, [key, value]) => {
//             if (value !== undefined && value !== null) acc[key] = String(value);
//             return acc;
//           }, {} as Record<string, string>)
//         ).toString();

//         return `/affiliate-product${queryString ? `?${queryString}` : ""}`;
//       },
//       providesTags: ["AffiliateProducts"],
//       transformResponse: (response: { data: IAffiliatedProduct[] }) => response.data,
//     }),

//     // ✅ GET a single affiliate product by ID
//     getAffiliateProductById: builder.query<IAffiliatedProduct, string>({
//       query: (id) => `/affiliate-product/${id}`,
//       providesTags: (_result, _err, id) => [{ type: "AffiliateProducts", id }],
//       transformResponse: (response: { data: IAffiliatedProduct }) => response.data,
//     }),

//     // ✅ CREATE a new affiliate product
//     createAffiliateProduct: builder.mutation<IAffiliatedProduct, Partial<IAffiliatedProduct>>({
//       query: (body) => ({
//         url: "/affiliate-product",
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["AffiliateProducts"],
//       transformResponse: (response: { data: IAffiliatedProduct }) => response.data,
//     }),

//     // ✅ UPDATE an existing affiliate product
//     updateAffiliateProduct: builder.mutation<
//       IAffiliatedProduct,
//       { id: string; body: Partial<IAffiliatedProduct> }
//     >({
//       query: ({ id, body }) => {
//         if (!isValidUUID(id)) {
//           throw new Error("Invalid product ID: must be a valid UUID");
//         }
//         return {
//           url: `/affiliate-product/${id}`,
//           method: "PATCH",
//           body,
//         };
//       },
//       invalidatesTags: (_res, _err, { id }) => [{ type: "AffiliateProducts", id }],
//       transformResponse: (response: { data: IAffiliatedProduct }) => response.data,
//     }),

//     // ✅ DELETE an affiliate product
//     deleteAffiliateProduct: builder.mutation<void, string>({
//       query: (id) => ({
//         url: `/affiliate-product/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["AffiliateProducts"],
//     }),
//   }),
//   overrideExisting: false,
// });

// export const {
//   useGetAffiliateProductsQuery,
//   useGetAffiliateProductByIdQuery,
//   useCreateAffiliateProductMutation,
//   useUpdateAffiliateProductMutation,
//   useDeleteAffiliateProductMutation,
// } = affiliateProductApi;
