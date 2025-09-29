import { baseApi } from "@/redux/hooks/baseApi";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/redux/types/auth.type";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (response: any): LoginResponse => {
        return {
          ...response,
          data: {
            ...response.data,
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
          },
        };
      },
      invalidatesTags: ["User"],
    }),

    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),

    // 🔹 Change Password
    changePassword: builder.mutation<
      { message: string },
      { oldPassword: string; newPassword: string; confirmPassword: string }
    >({
      query: (data) => ({
        url: "/auth/change-password",
        method: "PATCH",
        body: data,
      }),
    }),

    // 🔹 Request Reset Code
    requestResetCode: builder.mutation<{ message: string }, { email: string }>({
      query: (data) => ({
        url: "/auth/request-reset-code",
        method: "POST",
        body: data,
      }),
    }),

    // 🔹 Verify Reset Code
    verifyResetCode: builder.mutation<
      { message: string },
      { email: string; code: string }
    >({
      query: (data) => ({
        url: "/auth/verify-reset-code",
        method: "POST",
        body: data,
      }),
    }),

    // 🔹 Reset Password
    resetPassword: builder.mutation<
      { message: string },
      { email: string; password: string; confirmPassword: string }
    >({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useChangePasswordMutation,
  useRequestResetCodeMutation,
  useVerifyResetCodeMutation,
  useResetPasswordMutation,
} = authApi;



// import { baseApi } from "@/redux/hooks/baseApi";
// import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "@/redux/types/auth.type";


// export const authApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     login: builder.mutation<LoginResponse, LoginRequest>({
//       query: (credentials) => ({
//         url: "/auth/login",
//         method: "POST",
//         body: credentials,
//       }),
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       transformResponse: (response: any): LoginResponse => {
//         return {
//           ...response,
//           data: {
//             ...response.data,
//             accessToken: response.data.access_token,
//             refreshToken: response.data.refresh_token,
//           },
//         };
//       },
//       invalidatesTags: ["User"],
//     }),
//     register: builder.mutation<RegisterResponse, RegisterRequest>({
//       query: (userData) => ({
//         url: "/auth/register",
//         method: "POST",
//         body: userData,
//       }),
//     }),

//   }),
// });

// export const { useLoginMutation, useRegisterMutation } = authApi;




// import { baseApi } from "@/redux/hooks/baseApi";
// import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "@/redux/types/auth.type";


// export const authApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     login: builder.mutation<LoginResponse, LoginRequest>({
//       query: (credentials) => ({
//         url: "/auth/login",
//         method: "POST",
//         body: credentials,
//       }),
//       invalidatesTags: ["User"],
//     }),
//     register: builder.mutation<RegisterResponse, RegisterRequest>({
//       query: (userData) => ({
//         url: "/auth/create-user",
//         method: "POST",
//         body: userData,
//       }),
//     }),
//   }),
// });

// export const { useLoginMutation, useRegisterMutation } = authApi;
