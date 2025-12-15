import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const baseURL = import.meta.env.VITE_API_ENDPOINT;

if (!baseURL) {
  throw new Error("VITE_API_ENDPOINT is not defined in environment variables");
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: baseURL,
  credentials: "include", // Changed from "omit" to "include"
  prepareHeaders: (headers) => {
    const token = Cookies.get("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    // headers.set("Content-Type", "application/json");
    return headers;
  },
});

const baseQueryWithErrorHandler: typeof rawBaseQuery = async (
  args,
  api,
  extraOptions,
) => {
  try {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
      Cookies.remove("token");
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);
    return {
      error: {
        status: "FETCH_ERROR",
        error: "Failed to fetch",
      },
    };
  }
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithErrorHandler,

  tagTypes: [
    "User",
    "Providers",
    "Quotes",
    "ProviderReviews",
    "Products",
    "DIY",
    "Cart",
    "Wishlist",
    "Bookings",
    "Plan",
    "ProviderPlans",
    "Dashboard",
    "NewsLetter",
    "Provider",
    "Conversation",
    "Orders",
    "Tasks",
    "Invitations",
    "Blogs",
    "PartyPlans",
    "Activities",
    "DiyBoxActivityReviews",
    "AffiliateProducts",
    "Contact",
    "PrintOrders"
  ],

  endpoints: () => ({}),
});

// dont delete above code

// export const baseApi = createApi({
//   reducerPath: "api",
//   baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
//   tagTypes: [
//     "User",
//     "Providers",
//     "Quotes",
//     "ProviderReviews",
//     "Products",
//     "DIY",
//     "Cart",
//     "Wishlist",
//     "Bookings",
//     "Plan",
//     "ProviderPlans",
//     "Dashboard",
//     "NewsLetter",
//     "Provider",
//     "Conversation",
//     "Orders",
//     "Tasks",
//     "Invitations",
//  "Blogs", //.................
//   ],
//   endpoints: () => ({}),
// });
