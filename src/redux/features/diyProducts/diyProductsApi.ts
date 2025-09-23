import { baseApi } from "@/redux/hooks/baseApi";
import type { DIYResponse, DIYProduct } from "@/redux/types/diy.types";

export const diyProductApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDIYProducts: builder.query<DIYProduct | DIYProduct[],void>({
            query: () => "/products",
            transformResponse: (response: DIYResponse) => response.data as DIYProduct[],
            providesTags: ["DIY"]
        }),
        getDIYProductById: builder.query<DIYProduct, string>({
            query: (id) => `/products/${id}`,
            transformResponse: (response: DIYResponse) => response.data as DIYProduct,
            providesTags: ["DIY"]
        })
    })
})

export const {useGetDIYProductsQuery, useGetDIYProductByIdQuery } = diyProductApi