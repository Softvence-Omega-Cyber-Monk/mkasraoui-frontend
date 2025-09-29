import { baseApi } from "@/redux/hooks/baseApi";
import type { 
  DIYResponse, 
  SingleProductResponse, 
  DIYProduct, 
  Review, 
  ProductsData 
} from "@/redux/types/diy.types";

export const diyProductApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all products (returns both DIY boxes and gifts)
        getDIYProducts: builder.query<ProductsData, void>({
            query: () => "/products",
            transformResponse: (response: DIYResponse) => response.data,
            providesTags: ["DIY"]
        }),
        
        // Get only DIY boxes
        getDIYBoxes: builder.query<DIYProduct[], void>({
            query: () => "/products",
            transformResponse: (response: DIYResponse) => response.data.diyBoxes,
            providesTags: ["DIY"]
        }),
        
        // Get only gifts
        getGifts: builder.query<DIYProduct[], void>({
            query: () => "/products",
            transformResponse: (response: DIYResponse) => response.data.gifts,
            providesTags: ["DIY"]
        }),
        
        // Get all products as a single flattened array
        getAllProductsFlat: builder.query<DIYProduct[], void>({
            query: () => "/products",
            transformResponse: (response: DIYResponse) => [
                ...response.data.diyBoxes,
                ...response.data.gifts
            ],
            providesTags: ["DIY"]
        }),
        
        // Get product by ID (assuming single product endpoint exists)
        getDIYProductById: builder.query<DIYProduct, string>({
            query: (id) => `/products/${id}`,
            transformResponse: (response: SingleProductResponse) => response.data,
            providesTags: ["DIY"]
        }),
        
        // Create review
        createReview: builder.mutation<Review, { 
            productId: string; 
            rating: number; 
            description: string 
        }>({
            query: (body) => ({
                url: `/review`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["DIY"]
        }),
    })
});

export const { 
    useGetDIYProductsQuery,
    useGetDIYBoxesQuery,
    useGetGiftsQuery,
    useGetAllProductsFlatQuery,
    useGetDIYProductByIdQuery, 
    useCreateReviewMutation  
} = diyProductApi;