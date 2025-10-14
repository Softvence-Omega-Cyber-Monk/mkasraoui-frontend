// src/redux/features/user/userApi.ts

import { baseApi } from "@/redux/hooks/baseApi";
import type {
  User,
  CreateUserRequest,
  // UpdateUserRequest,
  ApiResponse,
} from "@/redux/types/user.type";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<User[], void>({
      query: () => "/user",
      transformResponse: (response: { data: User[] }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User" as const, id: "LIST" },
            ]
          : [{ type: "User" as const, id: "LIST" }],
    }),

    // GET /user/:id -> single user
    getUser: build.query<User, string>({
      query: (id) => `/user/${id}`,
      providesTags: (_result, _error, id) => [{ type: "User" as const, id }],
    }),

    // GET /user/me -> current user
    getMe: build.query<User, void>({
      query: () => "/user/me",
      transformResponse: (response: ApiResponse<User>) => response.data,
      providesTags: (result) =>
        result ? [{ type: "User" as const, id: result.id }] : [],
    }),

    getUserMeta: build.query<any, void>({
      query: () => "/user/meta-data/user",
      transformResponse: (response: ApiResponse<User>) => response.data,
    }),

    // POST /user -> create user
    createUser: build.mutation<User, CreateUserRequest>({
      query: (body) => ({
        url: "/user",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),



    // PATCH /user/:id -> update user
    updateUser: build.mutation<User, FormData>({
      query: (formData) => ({
        url: "/user", // PATCH /user
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result) =>
        result
          ? [
              { type: "User", id: result.id },
              { type: "User", id: "LIST" },
            ]
          : [],
    }),
    // DELETE /user/:id -> remove user
    deleteUser: build.mutation<{ success: boolean; id?: string }, string>({
      query: (id) => ({
        url: `/user/delete-user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useGetMeQuery,
  useGetUserMetaQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
