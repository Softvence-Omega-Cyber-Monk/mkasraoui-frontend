import { baseApi } from "@/redux/hooks/baseApi";

// Admin dashboard response
export interface DashboardData {
  totalUsers: number;
  totalProducts: number;
  totalRevenue: number;
  totalProviders: number;
}

// Provider card response
export interface ProviderData {
  totalBookings: number;
  totalReview: number;
  avgRating: number;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Admin Dashboard Data
    getDashboard: build.query<DashboardData, void>({
      query: () => ({
        url: "/admin",
        method: "GET",
      }),
      transformResponse: (response: { data: DashboardData }) => response.data,
      providesTags: ["Dashboard"],
    }),

    // Provider Meta Data
    getProviderMeta: build.query<ProviderData, void>({
      query: () => ({
        url: "/user/providers/meta-data",
        method: "GET",
      }),
      transformResponse: (response: { data: ProviderData }) => response.data,
      providesTags: ["Provider"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetDashboardQuery, useGetProviderMetaQuery } = dashboardApi;



// // src/redux/features/admin/dashboardApi.ts
// import { baseApi } from "@/redux/hooks/baseApi";

// export interface DashboardData {
//   totalUsers: number;
//   totalProducts: number;
//   totalRevenue: number;
//   totalProviders: number;
// }

// export const dashboardApi = baseApi.injectEndpoints({
//   endpoints: (build) => ({
//     getDashboard: build.query<DashboardData, void>({
//       query: () => ({
//         url: "/admin",
//         method: "GET",
//       }),
//       transformResponse: (response: { data: DashboardData }) => response.data,
//       providesTags: ["Dashboard"],
//     }),
//   }),
//   overrideExisting: false,
// });

// export const { useGetDashboardQuery } = dashboardApi;
