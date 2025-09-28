// src/redux/features/admin/dashboardApi.ts
import { baseApi } from "@/redux/hooks/baseApi";

export interface DashboardData {
  totalUsers: number;
  totalProducts: number;
  totalRevenue: number;
  totalProviders: number;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDashboard: build.query<DashboardData, void>({
      query: () => ({
        url: "/admin",
        method: "GET",
      }),
      transformResponse: (response: { data: DashboardData }) => response.data,
      providesTags: ["Dashboard"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetDashboardQuery } = dashboardApi;
