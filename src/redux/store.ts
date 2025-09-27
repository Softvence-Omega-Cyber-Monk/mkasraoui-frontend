import cartReducer from "./features/cart/cartSlice";
import wishlistReducer from "./features/wishlist/wishlistSlice";
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./hooks/baseApi";
import authReducer from "./features/auth/authSlice";
import propertyReducer from "./features/property/propertySlice";
import quotesReducer from "./features/quotes/quotesSlice";
import providerReviewReducer from "./features/review/providerReviewSlice";
import productReducer from "./features/product/productSlice";
import userReducer from "./features/user/userSlice";
import planReducer from "./features/subscribtionPlan/planSlice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    property: propertyReducer,
    quotes: quotesReducer,
    providerReview: providerReviewReducer,
    product: productReducer,
    user: userReducer,
    plan: planReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }).concat(baseApi.middleware),
});

export type AppRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
