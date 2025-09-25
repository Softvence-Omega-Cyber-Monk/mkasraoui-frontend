import { baseApi } from "@/redux/hooks/baseApi";
import type { CartResponse,AddToCartRequest, UpdateCartRequest, RemoveCartRequest } from "@/redux/types/cart.type";

export const cartApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCart: builder.query<CartResponse, void>({
            query: () => "/cart",
            transformResponse: (response: {data: CartResponse}) => response.data,
            providesTags: ["Cart"]
        }),
        addToCart: builder.mutation<CartResponse, AddToCartRequest>({
            query: (body) => ({
                url: "/cart/add",
                method: "POST",
                body
            }),
            invalidatesTags: ["Cart"]
        }),
        updateCartItem: builder.mutation<CartResponse,UpdateCartRequest>({
            query: (body) => ({
                url: "/cart/update",
                method: "PATCH",
                body
            }),
            invalidatesTags: ["Cart"]
        }),
        removeCartItem: builder.mutation<CartResponse, RemoveCartRequest>({
            query: (body) => ({
                url: "/cart/remove",
                method: "DELETE",
                body
            }),
            invalidatesTags: ["Cart"]
        }),
        clearCart: builder.mutation<CartResponse,void>({
            query: () => ({
                url: "/cart/clear",
                method: "DELETE"
            }),
            invalidatesTags: ["Cart"]
        }) 
    })
})

export const {
    useGetCartQuery,
    useAddToCartMutation,
    useUpdateCartItemMutation,
    useRemoveCartItemMutation,
    useClearCartMutation
} = cartApi