// src/redux/features/user/userApi.ts

import { baseApi } from "@/redux/hooks/baseApi";
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from "@/redux/types/user.type";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // GET /user -> all users
    // getUsers: build.query<User[], void>({
    //   query: () => "/user",
    //   providesTags: (result) =>
    //     result
    //       ? [
    //           ...result.map(({ id }) => ({ type: "User" as const, id })),
    //           { type: "User" as const, id: "LIST" },
    //         ]
    //       : [{ type: "User" as const, id: "LIST" }],
    // }),

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
      providesTags: (result) =>
        result ? [{ type: "User" as const, id: result.id }] : [],
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
    updateUser: build.mutation<User, UpdateUserRequest>({
      query: ({ id, data }) => ({
        url: `/user/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    // DELETE /user/:id -> remove user
    deleteUser: build.mutation<{ success: boolean; id?: string }, string>({
      query: (id) => ({
        url: `/user/${id}`,
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
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
