import { baseApi } from "@/redux/hooks/baseApi";

export const chatApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, password },
      }),
      invalidatesTags: ["User"],
    }),

    // Provider endpoints
    getProviders: builder.query({
      query: () => "/user/providers",
      providesTags: ["Provider"],
    }),

    // Conversation endpoints
    getConversations: builder.query({
      query: () => `/chat/conversations?page=1&limit=20`,
      providesTags: ["Conversation"],
      transformResponse: (response) => response.data?.data || response.data || response,
    }),

    startConversation: builder.mutation({
      query: (providerId) => ({
        url: "/chat/start",
        method: "POST",
        body: { providerId },
      }),
      invalidatesTags: ["Conversation"],
      transformResponse: (response) => response.data || response,
    }),

    // Message endpoints
    getMessages: builder.query({
      query: ({ conversationId, page = 1, limit = 50 }) =>
        `/chat/${conversationId}/messages?page=${page}&limit=${limit}`,
      transformResponse: (response) => response.data?.data || response.data || response,
    }),

    sendMessage: builder.mutation({
      query: ({ conversationId, content, file }) => {
        const formData = new FormData()
        if (content) formData.append("content", content)
        if (file) formData.append("file", file)

        return {
          url: `/chat/conversations/${conversationId}/messages`,
          method: "POST",
          body: formData,
        }
      },
      transformResponse: (response) => response.data || response,
    }),
  }),
})


export const {
  useLoginMutation,
  useGetProvidersQuery,
  useGetConversationsQuery,
  useStartConversationMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
} = chatApi
