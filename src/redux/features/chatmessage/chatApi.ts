

// import { baseApi } from "@/redux/hooks/baseApi";
// import type { ChatMessage, Conversation } from "@/redux/types/chat.types";

// export const chatApi = baseApi.injectEndpoints({
//   endpoints: (build) => ({

//     /** 🔹 Start a new conversation with a provider */
//     startConversation: build.mutation<{ data: Conversation }, { providerId: string }>({
//       query: ({ providerId }) => ({
//         url: "/chat/start",
//         method: "POST",
//         body: { providerId },
//       }),
//       invalidatesTags: [{ type: "Conversation", id: "LIST" }],
//     }),

//     /** 🔹 Fetch all user conversations */
//     getConversations: build.query<Conversation[], { page?: number; limit?: number }>({
//       query: ({ page = 1, limit = 10 } = {}) => ({
//         url: `/chat/conversations?page=${page}&limit=${limit}`,
//         method: "GET",
//       }),
//       transformResponse: (res: any) => res?.data ?? res ?? [],
//       providesTags: (result) =>
//         result
//           ? [
//               ...result?.map((c) => ({
//                 type: "Conversation" as const,
//                 id: c.id,
//               })),
//               { type: "Conversation", id: "LIST" },
//             ]
//           : [{ type: "Conversation", id: "LIST" }],
// //       providesTags: (result) => {
// //   if (!Array.isArray(result)) {
// //     return [{ type: "Conversation", id: "LIST" }];
// //   }
// //   return [
// //     ...result.map((c) => ({ type: "Conversation" as const, id: c.id })),
// //     { type: "Conversation", id: "LIST" },
// //   ];
// // },
//     }),

//     /** 🔹 Fetch messages from a specific conversation */
//     getMessages: build.query<
//       ChatMessage[],
//       { conversationId: string; page?: number; limit?: number }
//     >({
//       query: ({ conversationId, page = 1, limit = 20 }) => ({
//         url: `/chat/${conversationId}/messages?page=${page}&limit=${limit}`,
//         method: "GET",
//       }),
//       transformResponse: (res: any) => res?.data ?? [],
//       providesTags: (_res, _err, _arg) => [
//         { type: "Conversation", id: _arg.conversationId },
//       ],
//     }),

//     /** 🔹 Send a new message (with optional file upload) */
//     sendMessage: build.mutation<
//       any,
//       { conversationId: string; content?: string; file?: File }
//     >({
//       query: ({ conversationId, content, file }) => {
//         const formData = new FormData();
//         if (content) formData.append("content", content);
//         if (file) formData.append("file", file);

//         return {
//           url: `/chat/conversations/${conversationId}/messages`,
//           method: "POST",
//           body: formData,
//         };
//       },
//       async onQueryStarted(_arg, { queryFulfilled }) {
//         try {
//           const result = await queryFulfilled;
//           console.log("✅ Message sent successfully:", result.data);
//         } catch (err) {
//           console.error("❌ Failed to send message:", err);
//         }
//       },
//       invalidatesTags: (_res, _err, _arg) => [
//         { type: "Conversation", id: _arg.conversationId },
//         { type: "Conversation", id: "LIST" },
//       ],
//     }),
//   }),

//   overrideExisting: false,
// });

// export const {
//   useStartConversationMutation,
//   useGetConversationsQuery,
//   useGetMessagesQuery,
//   useSendMessageMutation,
// } = chatApi;


















// src/redux/features/chatmessage/chatApi.ts
import { baseApi } from "@/redux/hooks/baseApi";
import type { ChatMessage, Conversation } from "@/redux/types/chat.types";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Start a new conversation
    startConversation: build.mutation<
      { data: Conversation },
      { userId: string }
    >({
      query: ({ userId }) => ({
        url: "chat/start",
        method: "POST",
        body: { userId },
      }),
      invalidatesTags: [{ type: "Conversation", id: "LIST" }],
    }), 
    
    // Get all conversations
    getConversations: build.query<Conversation[], void>({
      query: () => ({ url: "chat/conversations", method: "GET" }),
      transformResponse: (res: any) => res?.data?.data ?? [], // return array directly
      providesTags: (result) =>
        result
          ? [
            ...result.map((c) => ({
              type: "Conversation" as const,
              id: c.id,
            })),
            { type: "Conversation", id: "LIST" },
          ]
          : [{ type: "Conversation", id: "LIST" }],
    }),
 



   getMessages: build.query<
  ChatMessage[],
  { conversationId: string; page?: number; limit?: number }
>({
  // query: ({ conversationId, page = 1, limit = 100 }) => ({
  //   url: `chat/${conversationId}/messages?page=${page}&limit=${limit}`,
  //   method: "GET",
  // }),
// query: ({ conversationId }) => ({
//   url: `chat/${conversationId}/messages`,
//   method: "GET",
// }),

query: ({ conversationId }) => ({
  url: `chat/${conversationId}/messages?limit=1000000`, // effectively “no limit”
  method: "GET",
}),


  transformResponse: (res: any) => {
    const messages: ChatMessage[] = res?.data?.data ?? [];

    // ✅ Log raw backend response for debugging
    console.log("🟢 Backend response for getMessages:", {
      conversationId: res?.data?.conversationId || "N/A",
      messagesCount: messages.length,
      messages,
      rawResponse: res,
    });

    return messages; // pass array to RTK Query state
  },

  providesTags: (_res, _err, _arg) => [
    { type: "Conversation", id: _arg.conversationId },
  ],
}),







    sendMessage: build.mutation<
  any,
  { conversationId: string; content?: string; file?: File }
>({
  query: ({ conversationId, content, file }) => {
    const form = new FormData();
    if (content) form.append("content", content);
    if (file) form.append("file", file);

    // ✅ Log what we are sending
    console.log("🟢 Sending message to backend:", {
      conversationId,
      content,
      file,
      formDataKeys: Array.from(form.keys()),
    });

    return {
      url: `chat/conversations/${conversationId}/messages`,
      method: "POST",
      body: form,
    };
  },

  // Optional: log the response after sending
  async onQueryStarted(_arg, { queryFulfilled }) {
    try {
      const result = await queryFulfilled;
      console.log("✅ Message sent successfully, server response:", result.data);
    } catch (err) {
      console.error("❌ Failed to send message:", err);
    }
  },

  invalidatesTags: (_res, _err, _arg) => [
    { type: "Conversation", id: _arg.conversationId },
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












// // src/redux/features/chatmessage/chatApi.ts
// import { baseApi } from "@/redux/hooks/baseApi";
// import type { ChatMessage, Conversation } from "@/redux/types/chat.types";

// export const chatApi = baseApi.injectEndpoints({
//   endpoints: (build) => ({
//     // Start a new conversation (Matches: POST /chat/start)
//     startConversation: build.mutation<
//       { data: Conversation },
//       { providerId: string }
//     >({
//       query: ({ providerId }) => ({
//         url: "chat/start",
//         method: "POST",
//         body: { providerId },
//       }),
//       invalidatesTags: [{ type: "Conversation", id: "LIST" }],
//     }),

//     // Get all conversations (Matches: GET /chat/conversations)
//     getConversations: build.query<Conversation[], void>({
//       query: () => ({ url: "chat/conversations", method: "GET" }),
//       transformResponse: (res: any) => res?.data?.data ?? [], // return array directly
//       providesTags: (result) =>
//         result
//           ? [
//             ...result.map((c) => ({
//               type: "Conversation" as const,
//               id: c.id,
//             })),
//             { type: "Conversation", id: "LIST" },
//           ]
//           : [{ type: "Conversation", id: "LIST" }],
//     }),

//     // Get messages for a conversation (Matches: GET /chat/{conversationId}/messages)
//     getMessages: build.query<
//       ChatMessage[],
//       { conversationId: string; page?: number; limit?: number }
//     >({
//       query: ({ conversationId, page = 1, limit = 100 }) => ({
//         // 💡 Route adjusted: Removed redundant 'chat/' based on swagger image path
//         url: `chat/${conversationId}/messages?page=${page}&limit=${limit}`,
//         method: "GET",
//       }),
//       transformResponse: (res: any) => res?.data?.data ?? [], // array directly
//       providesTags: (_res, _err, arg) => [
//         { type: "Conversation", id: arg.conversationId },
//       ],
//     }),

//     // Send message (Matches: POST /chat/conversations/{id}/messages)
//     sendMessage: build.mutation<
//       any,
//       { conversationId: string; content?: string; file?: File }
//     >({
//       query: ({ conversationId, content, file }) => {
//         const form = new FormData();
//         if (content) form.append("content", content);
//         if (file) form.append("file", file);
//         return {
//           // 💡 Route adjusted: Removed redundant 'chat/' to match swagger path: /chat/conversations/{id}/messages
//           url: `chat/conversations/${conversationId}/messages`,
//           method: "POST",
//           body: form,
//         };
//       },
//       invalidatesTags: (_res, _err, arg) => [
//         { type: "Conversation", id: arg.conversationId },
//         { type: "Conversation", id: "LIST" },
//       ],
//     }),
//   }),
//   overrideExisting: false,
// });

// export const {
//   useStartConversationMutation,
//   useGetConversationsQuery,
//   useGetMessagesQuery,
//   useSendMessageMutation,
// } = chatApi;