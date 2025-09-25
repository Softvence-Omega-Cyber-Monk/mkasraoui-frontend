import { configureStore } from "@reduxjs/toolkit"
import { baseApi } from "./hooks/baseApi"
import authReducer from "./features/auth/authSlice"
import cartReducer from "./features/cart/cartSlice"
import wishlistReducer from "./features/wishlist/wishlistSlice"

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }).concat(baseApi.middleware),
})

export type AppRootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
