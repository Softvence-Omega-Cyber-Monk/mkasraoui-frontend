import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./hooks/baseApi";
import authReducer from "./features/auth/authSlice";
import propertyReducer from "./features/property/propertySlice";
import quotesReducer from "./features/quotes/quotesSlice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    property: propertyReducer,
    quotes: quotesReducer,
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
