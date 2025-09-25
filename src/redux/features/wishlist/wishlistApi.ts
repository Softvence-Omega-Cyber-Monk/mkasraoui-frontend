// redux/services/wishlistApi.ts
import { baseApi } from "@/redux/hooks/baseApi";
import type { WishlistResponse, Favorite } from "@/redux/types/wishlist.types";

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  imges: string[];
}

export interface WishlistItem {
  id: string;
  prodcut: Product; // keeping typo since your backend uses "prodcut"
}


export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query<WishlistItem[], void>({
      query: () => "/favorite",
      transformResponse: (response: WishlistResponse) => response.data,
      providesTags: ["Wishlist"],
    }),

    addToWishlistApi: builder.mutation<Favorite, { product_id: string }>({
      query: (body) => ({
        url: "/favorite",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wishlist"],
    }),

    removeFromWishlistApi: builder.mutation<void, string>({
      query: (favoriteId) => ({
        url: `/favorite/${favoriteId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistApiMutation,
  useRemoveFromWishlistApiMutation,
} = wishlistApi;
