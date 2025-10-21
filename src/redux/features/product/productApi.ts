// src/redux/features/product/productApi.ts
import { baseApi } from "@/redux/hooks/baseApi";
import type { ApiResponse, Product } from "@/redux/types/product.type";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ApiResponse<{ diyBoxes: Product[]; gifts: Product[] }>,void>({
      query: () => ({
        url: "/products",
        method: "GET",
      }),
      providesTags: ["Products"],
    }),

    getProduct: builder.query<ApiResponse<Product>, string>({
      query: (id) => `/products/${id}`,
      providesTags: ["Products"],
    }),

    addProduct: builder.mutation<ApiResponse<Product>, FormData>({
      query: (formData) => ({
        url: "/products",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation<Product, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
