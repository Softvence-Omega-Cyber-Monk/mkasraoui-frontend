// src/redux/features/chat/chatApi.ts
import { baseApi } from "@/redux/hooks/baseApi";
import type { ChatMessage, Conversation } from "@/redux/types/chat.types";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // 1) Start (or get/create) a conversation with a provider
    startConversation: build.mutation<
      { data: Conversation },
      { providerId: string }
    >({
      query: ({ providerId }) => ({
        url: "chat/start",
        method: "POST",
        body: { providerId },
      }),
      // refresh conversation list after creating
      invalidatesTags: [{ type: "Conversation", id: "LIST" }],
    }),

    // 2) Fetch conversations (paginated on server — swagger returns meta + data)
    getConversations: build.query<{ meta?: any; data: Conversation[] }, void>({
      query: () => ({ url: "chat/conversations", method: "GET" }),
      transformResponse: (response: any) => {
        // swagger: response.data contains { meta, data }
        return response?.data ?? response;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((c) => ({
                type: "Conversation" as const,
                id: c.id,
              })),
              { type: "Conversation", id: "LIST" },
            ]
          : [{ type: "Conversation", id: "LIST" }],
    }),

    // 3) Fetch messages for a conversation (server marks unread => read)
    getMessages: build.query<
      { meta?: any; data: ChatMessage[] },
      { conversationId: string; page?: number; limit?: number }
    >({
      query: ({ conversationId, page = 1, limit = 100 }) => ({
        url: `chat/${conversationId}/messages?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data ?? response,
      providesTags: (_result, _error, arg) => [
        { type: "Conversation", id: arg.conversationId },
      ],
    }),

    // 4) Send a message (multipart form for file support)
    sendMessage: build.mutation<
      any,
      { conversationId: string; content?: string; file?: File }
    >({
      query: ({ conversationId, content, file }) => {
        const form = new FormData();
        if (typeof content !== "undefined") form.append("content", content);
        if (file) form.append("file", file);
        return {
          url: `chat/conversations/${conversationId}/messages`,
          method: "POST",
          body: form,
        };
      },
      invalidatesTags: (_result, _error, arg) => [
        { type: "Conversation", id: arg.conversationId },
        { type: "Conversation", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useStartConversationMutation,
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} = chatApi;
