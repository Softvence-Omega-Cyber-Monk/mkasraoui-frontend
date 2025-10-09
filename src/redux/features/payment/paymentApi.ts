import { baseApi } from "@/redux/hooks/baseApi";
import type { OnboardingLinkResponse, OnboardingStatusResponse } from "./payment.types";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get onboarding link
    getOnboardingLink: build.query<OnboardingLinkResponse, void>({
      query: () => ({ url: "/provider/payment/onboarding-link", method: "GET" }),
      transformResponse: (res: any) => res.data,
    }),

    // Get onboarding status
    getOnboardingStatus: build.query<OnboardingStatusResponse, void>({
      query: () => ({ url: "/provider/payment/onboarding-status", method: "GET" }),
      transformResponse: (res: any) => res.data,
    }),

    // Login to Stripe dashboard
    loginDashboard: build.query<OnboardingLinkResponse, void>({
      query: () => ({ url: "/provider/payment/login-dashboard", method: "GET" }),
      transformResponse: (res: any) => res.data,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOnboardingLinkQuery,
  useGetOnboardingStatusQuery,
  useLoginDashboardQuery,
} = paymentApi;




 