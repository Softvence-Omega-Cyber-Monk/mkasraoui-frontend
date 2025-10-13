import { baseApi } from "@/redux/hooks/baseApi";
import type { ApiResponse, Blog } from "@/redux/types/blog.type";

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query<ApiResponse<Blog[]>, void>({
      query: () => "/blog",
      providesTags: ["Blogs"],
    }),

    getBlog: builder.query<ApiResponse<Blog>, string>({
      query: (id) => `/blog/${id}`,
      providesTags: ["Blogs"],
    }),

    addBlog: builder.mutation<ApiResponse<Blog>, FormData>({
      query: (formData) => ({
        url: "/blog",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Blogs"],
    }),

    updateBlog: builder.mutation<
      ApiResponse<Blog>,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/blog/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Blogs"],
    }),

    deleteBlog: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/blog/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blogs"],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogQuery,
  useAddBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;

