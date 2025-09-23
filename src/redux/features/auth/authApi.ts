import { baseApi } from "@/redux/hooks/baseApi";
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "@/redux/types/auth.type";


export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
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

  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;




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
