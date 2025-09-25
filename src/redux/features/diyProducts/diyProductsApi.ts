import { baseApi } from "@/redux/hooks/baseApi";
import type { DIYResponse, DIYProduct, Review } from "@/redux/types/diy.types";

export const diyProductApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDIYProducts: builder.query<DIYProduct | DIYProduct[], void>({
            query: () => "/products",
            transformResponse: (response: DIYResponse) => response.data as DIYProduct[],
            providesTags: ["DIY"]
        }),
        getDIYProductById: builder.query<DIYProduct, string>({
            query: (id) => `/products/${id}`,
            transformResponse: (response: DIYResponse) => response.data as DIYProduct,
            providesTags: ["DIY"]
        }),
        createReview: builder.mutation<Review, { productId: string; rating: number; description: string }>({
            query: (body) => ({
                url: `/review`,
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, { productId }) => [{ type: "DIY", id: productId }],
        }),
    })
})

export const { useGetDIYProductsQuery, useGetDIYProductByIdQuery, useCreateReviewMutation  } = diyProductApi