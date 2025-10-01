// // src/components/Chat/ChatContainer.tsx
// import { useEffect } from "react";

// import {
//   useGetConversationsQuery,
//   useGetMessagesQuery,
//   useSendMessageMutation,
//   useStartConversationMutation,
// } from "@/redux/features/chatmessage/chatApi";
// import {
//   setSelectedConversation,
//   appendLocalMessage,
// } from "@/redux/features/chatmessage/chatSlice";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
// import type { ChatMessage } from "@/redux/types/chat.types";
// import ConversationList from "./ConversationList";
// import MessageList from "./MessageList";
// import MessageInput from "./MessageInput";

// export default function ChatContainer({ myUserId }: { myUserId: string }) {
//   const dispatch = useAppDispatch();
//   const selectedConversationId = useAppSelector(
//     (s) => s.chat.selectedConversationId,
//   );

//   const {
//     data: convRes,
//     isLoading: convLoading,
//     refetch: refetchConversations,
//   } = useGetConversationsQuery();
//   const conversations = convRes?.data ?? [];

//   const {
//     data: msgRes,
//     isLoading: messagesLoading,
//     refetch: refetchMessages,
//   } = useGetMessagesQuery(
//     selectedConversationId
//       ? { conversationId: selectedConversationId, page: 1, limit: 100 }
//       : ({} as any),
//     { skip: !selectedConversationId },
//   );
//   const messages = msgRes?.data ?? [];

//   const [startConversation] = useStartConversationMutation();
//   const [sendMessage, { isLoading: sending }] = useSendMessageMutation();

//   // when user selects a conversation elsewhere, we might want to refetch messages
//   useEffect(() => {
//     if (selectedConversationId) {
//       refetchMessages();
//     }
//   }, [selectedConversationId]);

//   // helper to start conversation with providerId (if you need to start fresh)
//   const startWithProvider = async (providerId: string) => {
//     const res = await startConversation({ providerId }).unwrap();
//     const newConvId = res.data?.id;
//     if (newConvId) {
//       dispatch(setSelectedConversation(newConvId));
//       // small delay then refetch list
//       await refetchConversations();
//     }
//   };

//   const handleSend = async (content: string, file?: File) => {
//     if (!selectedConversationId) {
//       // For the case where you want to start a conversation first, call startWithProvider(providerId)
//       // This example assumes you already have a selected conversation; otherwise create it beforehand.
//       console.warn(
//         "No selected conversation. Create one with startConversation first.",
//       );
//       return;
//     }

//     // optimistic local message (client-generated id)
//     // const optimisticMsg = {
//     //   id: `local-${Date.now()}`,
//     //   senderId: myUserId,
//     //   content: file ? URL.createObjectURL(file) : content,
//     //   createdAt: new Date().toISOString(),
//     //   type: file ? (file.type.startsWith("image/") ? "image" : "file") : "text",
//     //   fileName: file?.name ?? null,
//     //   fileSize: file?.size ?? null,
//     // };

//     const optimisticMsg: ChatMessage = {
//       id: `local-${Date.now()}`,
//       senderId: myUserId,
//       content: file ? URL.createObjectURL(file) : content,
//       createdAt: new Date().toISOString(),
//       type: file ? (file.type.startsWith("image/") ? "image" : "file") : "text",
//       fileName: file?.name ?? null,
//       fileSize: file?.size ?? null,
//     };

//     // append local copy for instant UI feedback
//     dispatch(
//       appendLocalMessage({
//         conversationId: selectedConversationId,
//         message: optimisticMsg,
//       }),
//     );

//     try {
//       await sendMessage({
//         conversationId: selectedConversationId,
//         content: content || "",
//         file,
//       }).unwrap();
//       // RTK Query invalidation will cause getMessages to refetch and replace optimistic message if server returns authoritative messages.
//       // Optionally: refetchMessages();
//     } catch (err) {
//       console.error("send message failed", err);
//       // Optionally mark the optimistic message as failed in local state
//     }
//   };

//   return (
//     <div className="flex h-[calc(100vh-80px)] bg-gray-100">
//       <ConversationList conversations={conversations} loading={convLoading} />
//       <div className="flex flex-1 flex-col">
//         <div className="border-b border-[#BDBDBE] p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="font-semibold">
//                 {selectedConversationId
//                   ? (conversations.find((c) => c.id === selectedConversationId)
//                       ?.provider?.name ??
//                     conversations.find((c) => c.id === selectedConversationId)
//                       ?.user?.name)
//                   : "Select conversation"}
//               </div>
//             </div>
//             <div className="text-sm text-gray-500">
//               {messagesLoading ? "Loading messages..." : ""}
//             </div>
//           </div>
//         </div>

//         <MessageList messages={messages} myUserId={myUserId} />

//         <MessageInput onSend={handleSend} isLoading={sending} />
//       </div>
//     </div>
//   );
// }
