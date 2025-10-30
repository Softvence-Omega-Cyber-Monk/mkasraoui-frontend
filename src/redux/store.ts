import cartReducer from "./features/cart/cartSlice";
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./hooks/baseApi";
import authReducer from "./features/auth/authSlice";
import propertyReducer from "./features/property/propertySlice";
import quotesReducer from "./features/quotes/quotesSlice";
import providerReviewReducer from "./features/review/providerReviewSlice";
import productReducer from "./features/product/productSlice";
import userReducer from "./features/user/userSlice";
import planReducer from "./features/subscribtionPlan/planSlice";
import adminProviderPlanReducer from "./features/adminProviderPlan/adminProviderPlanSlice";
import newsLetterReducer from "./features/newsLetter/newsLetterSlice";
import contactReducer from "./features/contact/contactSlice";
import chatReducer from "./features/chatmessage/chatSlice";
import { tShirtApi } from "./features/tShirt/tshirtApi";
import { partyPlanApi } from "./features/partyPlan/partyPlanApi";
import { generateCardApi } from "./features/generateCard/generateCard";
import { messageApi } from "./features/generatedMessage/generatedMessageApi";
// import { chatApi } from "./features/chatmessage/chatApi";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [tShirtApi.reducerPath]: tShirtApi.reducer,
    [partyPlanApi.reducerPath]: partyPlanApi.reducer,
    [generateCardApi.reducerPath]: generateCardApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
    // [chatApi.reducerPath]: chatApi.reducer,
    auth: authReducer,
    cart: cartReducer,
    property: propertyReducer,
    quotes: quotesReducer,
    providerReview: providerReviewReducer,
    product: productReducer,
    user: userReducer,
    plan: planReducer,
    providerPlan: adminProviderPlanReducer,
    newsLetter: newsLetterReducer,
    chat: chatReducer,
    contact: contactReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    })
      .concat(baseApi.middleware)
      .concat(tShirtApi.middleware)
      .concat(partyPlanApi.middleware)
      .concat(generateCardApi.middleware)
      // .concat(chatApi.middleware),
      .concat(messageApi.middleware),
  // .concat(chatApi.middleware),
});

export type AppRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
