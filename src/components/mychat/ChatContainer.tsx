

"use client";
import { useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
import {
  useStartConversationMutation,
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} from "@/redux/features/chatmessage/chatApi";
import {
  setSelectedConversation,
  appendLocalMessage,
} from "@/redux/features/chatmessage/chatSlice";
import type { ChatMessage, Conversation } from "@/redux/types/chat.types";
import { useChatSocket } from "@/hooks/useChatSocket";
import ConversationList from "./ConversationList";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatContainer({ isProvider = false }: { isProvider?: boolean }) {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const providerId = searchParams.get("providerId");
  const providerName = searchParams.get("providerName") || "Provider";

  const MY_USER_ID = useAppSelector((s) => s.auth.user?.id) || "";
  const token = useAppSelector((s) => s.auth.token);

  const selectedConversationId = useAppSelector((s) => s.chat.selectedConversationId);
  const messagesByConversation = useAppSelector((s) => s.chat.messagesByConversation ?? {});
  const messagesFromSlice = selectedConversationId
    ? messagesByConversation[selectedConversationId] ?? []
    : [];

  const { data: conversations = [] } = useGetConversationsQuery(undefined, { skip: !MY_USER_ID });
  console.log(conversations,"conversations");
  const { data: fetchedMessages = [], isLoading, isFetching } = useGetMessagesQuery(
    selectedConversationId ? { conversationId: selectedConversationId } : ({} as any),
    { skip: !selectedConversationId }
  );

  const [startConversation] = useStartConversationMutation();
  const [sendMessageMutation] = useSendMessageMutation();

  const { socket, connected, sendMessage: sendSocketMessage } = useChatSocket({
    userId: MY_USER_ID,
    token: token || undefined,
    isProvider,
  });

  // 🔹 Auto-start conversation with provider
  useEffect(() => {
    if (!providerId || !MY_USER_ID) return;

    const existing = conversations.find(
      (c) => String(c.provider?.id) === String(providerId)
    );
    if (existing) {
      dispatch(setSelectedConversation(existing.id));
      return;
    }

    const tempId = `temp-${providerId}`;
    dispatch(setSelectedConversation(tempId));

    (async () => {
      try {
        console.log("Starting conversation with provider:", providerId);
        const res = await startConversation({ providerId }).unwrap();
        console.log("Backend started conversation:", res);
        if (res?.data?.id) {
          dispatch(setSelectedConversation(res.data.id));
        }
      } catch (err) {
        console.error("Backend failed to start conversation, using temp:", err);
      }
    })();
  }, [providerId, MY_USER_ID, conversations, startConversation, dispatch]);

  // // 🔹 Auto-select provider conversation if none selected
  // const providerConversation = useMemo(() => {
  //   if (!providerId) return null;

  //   const existing = conversations.find((c) => String(c.provider?.id) === String(providerId));
  //   if (existing) return existing;

  //   return {
  //     id: `temp-${providerId}`,
  //     provider: { id: providerId, name: providerName },
  //     user: { id: MY_USER_ID },
  //     lastMessagePreview: "Start a conversation",
  //     unreadCount: 0,
  //   };
  // }, [conversations, providerId, providerName, MY_USER_ID]);


const providerConversation = useMemo<Conversation | null>(() => {
  if (!providerId) return null;

  const existing = conversations.find((c) => String(c.provider?.id) === String(providerId));
  if (existing) return existing;

  return {
    id: `temp-${providerId}`,
    userId: MY_USER_ID,               // ✅ Added
    providerId: providerId,           // ✅ Added
    provider: { id: providerId, name: providerName },
    user: { id: MY_USER_ID },
    lastMessagePreview: "Start a conversation",
    unreadCount: 0,
  };
}, [conversations, providerId, providerName, MY_USER_ID]);




  useEffect(() => {
    if (!selectedConversationId && providerConversation) {
      dispatch(setSelectedConversation(providerConversation.id));
    }
  }, [providerConversation, selectedConversationId, dispatch]);

  // 🔹 Merge API messages into Redux
  useEffect(() => {
    if (!selectedConversationId || !fetchedMessages?.length) return;

    const localMessages = messagesFromSlice ?? [];
    const newMessages = fetchedMessages.filter(
      (msg) => !localMessages.some((local) => local.id === msg.id)
    );
    newMessages.forEach((msg) =>
      dispatch(appendLocalMessage({ conversationId: selectedConversationId, message: msg }))
    );
  }, [fetchedMessages, selectedConversationId, messagesFromSlice, dispatch]);

  // 🔹 Join socket room when conversation changes
  useEffect(() => {
    if (selectedConversationId && connected) {
      console.log("Joining socket room:", selectedConversationId);
      socket?.emit("joinConversation", selectedConversationId);
    }
  }, [selectedConversationId, connected, socket]);

  const getPartnerDetails = (conversation: Conversation) => {
    const partner =
      String(conversation.user?.id) === String(MY_USER_ID)
        ? conversation.provider
        : conversation.user;
    return { name: partner?.name || `User ${partner?.id?.slice(0, 4)}` || "Unknown" };
  };

  // const conversationListProps = useMemo(() => {
  //   let list = Array.isArray(conversations)
  //     ? conversations.map((c) => ({
  //         id: c.id,
  //         otherUserName: getPartnerDetails(c).name,
  //         lastMessage: c.lastMessagePreview || "No messages yet",
  //         unreadCount: c.unreadCount || 0,
  //       }))
  //     : [];

  //   if (providerConversation && !list.some((c) => c.id === providerConversation.id)) {
  //     list = [
  //       {
  //         id: providerConversation.id,
  //         otherUserName: providerConversation.provider?.name || "Provider",
  //         lastMessage: providerConversation.lastMessagePreview || "No messages yet",
  //         unreadCount: providerConversation.unreadCount || 0,
  //       },
  //       ...list,
  //     ];
  //   }

  //   return list;
  // }, [conversations, providerConversation]);




  const conversationListProps = useMemo(() => {
  // ✅ Map backend conversations
  const listFromBackend = Array.isArray(conversations)
    ? conversations.map((c) => ({
        id: c.id,
        providerId: c.provider?.id,
        otherUserName: getPartnerDetails(c).name,
        lastMessage: c.lastMessagePreview || "No messages yet",
        unreadCount: c.unreadCount || 0,
      }))
    : [];

  // ✅ Add temp provider conversation only if it doesn't already exist for same provider
  const alreadyExists = listFromBackend.some(
    (c) => String(c.providerId) === String(providerId)
  );

  const finalList = alreadyExists
    ? listFromBackend
    : [
        {
          id: providerConversation?.id ?? "",
          providerId: providerId,
          otherUserName: providerConversation?.provider?.name || "Provider",
          lastMessage: providerConversation?.lastMessagePreview || "No messages yet",
          unreadCount: providerConversation?.unreadCount || 0,
        },
        ...listFromBackend,
      ];

  // ✅ Remove any accidental duplicates by providerId
  const uniqueByProvider = finalList.filter(
    (v, i, a) =>
      i === a.findIndex((t) => String(t.providerId) === String(v.providerId))
  );

  return uniqueByProvider;
}, [conversations, providerConversation, providerId]);

  const currentPartnerName = useMemo(() => {
    const currentConversation = [...conversations, providerConversation].find(
      (c) => c?.id === selectedConversationId
    );

    
    return currentConversation ? getPartnerDetails(currentConversation  ).name : "Select a chat";
  }, [conversations, selectedConversationId, providerConversation, MY_USER_ID]);

  // 🔹 File to Base64 helper
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  // 🔹 Send message handler (socket + backend)
  const handleSendMessage = useCallback(
    async (content: string, file?: File) => {
      if (!selectedConversationId || !MY_USER_ID || (!content.trim() && !file)) return;

      let fileBase64: string | undefined;
      if (file) fileBase64 = await fileToBase64(file);

      const tempId = `temp-msg-${Date.now()}`;
      const optimisticMessage: ChatMessage = {
        id: tempId,
        conversationId: selectedConversationId,
        senderId: MY_USER_ID,
        content: file ? "[image]" : content,
        fileUrl: file ? URL.createObjectURL(file) : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "sending",
      };

      dispatch(
        appendLocalMessage({ conversationId: selectedConversationId, message: optimisticMessage })
      );

      // Send via socket
      sendSocketMessage({ ...optimisticMessage, fileUrl: fileBase64 });

      // Also send to backend
      // try {
      //   const res = await sendMessageMutation({ conversationId: selectedConversationId, content, file }).unwrap();
      //   console.log("Backend message sent:", res);
      // } catch (err) {
      //   console.error("Failed to send message to backend:", err);
      // }
    },
    [selectedConversationId, MY_USER_ID, dispatch, sendSocketMessage, sendMessageMutation]
  );

  return (
    <div className="flex h-[calc(100vh_-_100px)] border border-[#DBE0E5] rounded-lg overflow-hidden shadow-xl bg-white">
      <ConversationList
        conversations={conversationListProps}
        selectedId={selectedConversationId ?? undefined}
        onSelect={(id) => dispatch(setSelectedConversation(id))}
      />

      <div className="flex flex-1 flex-col bg-gray-50">
        <div className="p-4 border-b border-[#DBE0E5] bg-white font-semibold text-lg">
          {currentPartnerName}
          {connected ? (
            <span className="ml-2 text-green-500 text-sm">(online)</span>
          ) : (
            <span className="ml-2 text-gray-400 text-sm">(offline)</span>
          )}
        </div>

        {selectedConversationId && MY_USER_ID ? (
          <>
            <MessageList messages={messagesFromSlice ?? []} myUserId={MY_USER_ID} />
            <MessageInput
              onSend={(msg, file) => handleSendMessage(msg, file)}
              disabled={isLoading || isFetching}
            />
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-500">
            {MY_USER_ID ? "Select a conversation to start chatting." : "Please log in to chat."}
          </div>
        )}
      </div>
    </div>
  );
}






















// "use client";
// import { useEffect, useMemo } from "react";
// import { useSearchParams } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
// import {
//   useGetConversationsQuery,
//   useGetMessagesQuery,
//   useStartConversationMutation,
// } from "@/redux/features/chatmessage/chatApi";
// import {
//   setSelectedConversation,
//   appendLocalMessage,
// } from "@/redux/features/chatmessage/chatSlice";
// import type { ChatMessage, Conversation } from "@/redux/types/chat.types";
// import { useChatSocket } from "@/hooks/useChatSocket";
// import ConversationList from "./ConversationList";
// import MessageList from "./MessageList";
// import MessageInput from "./MessageInput";

// export default function ChatContainer({ isProvider = false }: { isProvider?: boolean }) {
//   const dispatch = useAppDispatch();
//   const [searchParams] = useSearchParams();
//   const providerId = searchParams.get("providerId");
//   // const providerName = searchParams.get("providerName") || "Provider";
//    // 🔹 User info
//   const MY_USER_ID = useAppSelector((s) => s.auth.user?.id) || "";
//   const token = useAppSelector((s) => s.auth.token);

//   // 🔹 Selected conversation & messages
//   const selectedConversationId = useAppSelector((s) => s.chat.selectedConversationId);
//   const messagesByConversation = useAppSelector((s) => s.chat.messagesByConversation ?? {});
//   const messagesFromSlice = selectedConversationId
//     ? messagesByConversation[selectedConversationId] ?? []
//     : [];

//   // 🔹 Fetch conversations
//   const { data: conversations = [] } = useGetConversationsQuery(undefined, {
//     skip: !MY_USER_ID,
//   });

//   // 🔹 Fetch messages for selected conversation
//   const { data: fetchedMessages = [], isLoading, isFetching } = useGetMessagesQuery(
//     selectedConversationId ? { conversationId: selectedConversationId } : ({} as any),
//     { skip: !selectedConversationId }
//   );

//   // 🔹 Start conversation mutation
//   const [startConversation] = useStartConversationMutation();

//   // 🔹 Setup socket
//   const { socket, connected, sendMessage: sendSocketMessage } = useChatSocket({
//     userId: MY_USER_ID,
//     token: token || undefined,
//     isProvider,
//   });

//   // 🔹 Create temporary conversation for provider if none exists
//   // const providerConversation = useMemo(() => {
//   //   if (!providerId) return null;

//   //   const existing = conversations.find(
//   //     (c) => String(c.provider?.id) === String(providerId)
//   //   );

//   //   if (existing) return existing;

//   //   // Temporary conversation
//   //   return {
//   //     id: "temp-" + providerId,
//   //     provider: { id: providerId, name: providerName },
//   //     user: null,
//   //     lastMessagePreview: "Start a conversation",
//   //     unreadCount: 0,
//   //   } as Conversation;
//   // }, [conversations, providerId, providerName]);


 
// const providerName = searchParams.get("providerName") || "Provider";

// const providerConversation = useMemo(() => {
//   if (!providerId) return null;

//   const existing = conversations.find(
//     (c) => String(c.provider?.id) === String(providerId)
//   );

//   if (existing) return existing;

//   // Temporary conversation with actual provider name
//   return {
//     id: "temp-" + providerId,
//     provider: { id: providerId, name: providerName },
//     user: null,
//     lastMessagePreview: "Start a conversation",
//     unreadCount: 0,
//   } as Conversation;
// }, [conversations, providerId, providerName]);


// // 🟢 Automatically start conversation when providerId is passed
// useEffect(() => {
//   const createConversationIfNeeded = async () => {
//     if (!providerId || !MY_USER_ID) return;

//     // Check if conversation already exists in DB
//     const existing = conversations.find(
//       (c) => String(c.provider?.id) === String(providerId)
//     );

//     if (existing) {
//       // Already exists — select it
//       dispatch(setSelectedConversation(existing.id));
//       return;
//     }

//     try {
//       // Start a new conversation on backend
//       const res = await startConversation({ providerId }).unwrap();
//       if (res?.data?.id) {
//         dispatch(setSelectedConversation(res.data.id));
//       }
//     } catch (err) {
//       console.error("Error starting conversation:", err);
//     }
//   };

//   createConversationIfNeeded();
// }, [providerId, MY_USER_ID, conversations, startConversation, dispatch]);


//   // 🔹 Auto-select provider conversation if not selected
//   useEffect(() => {
//     if (!selectedConversationId && providerConversation) {
//       dispatch(setSelectedConversation(providerConversation.id));
//     }
//   }, [providerConversation, selectedConversationId, dispatch]);

//   // 🔹 Merge API messages into Redux
//   useEffect(() => {
//     if (!selectedConversationId || !fetchedMessages?.length) return;

//     const localMessages = messagesFromSlice ?? [];
//     const newMessages = fetchedMessages.filter(
//       (msg) => !localMessages.some((local) => local.id === msg.id)
//     );

//     newMessages.forEach((msg) =>
//       dispatch(appendLocalMessage({ conversationId: selectedConversationId, message: msg }))
//     );
//   }, [fetchedMessages, selectedConversationId, messagesFromSlice, dispatch]);

//   // 🔹 Join socket room when conversation changes
//   useEffect(() => {
//     if (selectedConversationId && connected) {
//       socket?.emit("joinConversation", selectedConversationId);
//     }
//   }, [selectedConversationId, connected, socket]);

//   // 🔹 Helper to get chat partner
//   const getPartnerDetails = (conversation: Conversation) => {
//     const partner =
//       String(conversation.user?.id) === String(MY_USER_ID)
//         ? conversation.provider
//         : conversation.user;
//     return { name: partner?.name || `User ${partner?.id?.slice(0, 4)}` || "Unknown" };
//   };

//   // 🔹 Build conversation list props
//   const conversationListProps = useMemo(() => {
//     let list = Array.isArray(conversations)
//       ? conversations.map((c) => ({
//           id: c.id,
//           otherUserName: getPartnerDetails(c).name,
//           lastMessage: c.lastMessagePreview || "No messages yet",
//           unreadCount: c.unreadCount || 0,
//         }))
//       : [];

//     // Add provider conversation if not in list
//     if (providerConversation && !list.some((c) => c.id === providerConversation.id)) {
//       list = [
//         {
//           id: providerConversation.id,
//           otherUserName: providerConversation.provider?.name || "Provider",
//           lastMessage: providerConversation.lastMessagePreview||"No messages yet",
//           unreadCount: providerConversation.unreadCount || 0,
//         },
//         ...list,
//       ];
//     }

//     return list;
//   }, [conversations, providerConversation]);

//   const currentPartnerName = useMemo(() => {
//     const currentConversation = [...conversations, providerConversation].find(
//       (c) => c?.id === selectedConversationId
//     );
//     return currentConversation ? getPartnerDetails(currentConversation).name : "Select a chat";
//   }, [conversations, selectedConversationId, providerConversation, MY_USER_ID]);

//   // 🔹 File to Base64 helper
//   const fileToBase64 = (file: File): Promise<string> =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result as string);
//       reader.onerror = (error) => reject(error);
//     });

//   // 🔹 Send message handler
//   const handleSendMessage = async (content: string, file?: File) => {
//     if (!selectedConversationId || !MY_USER_ID || (!content.trim() && !file)) return;

//     let fileBase64: string | undefined;
//     if (file) fileBase64 = await fileToBase64(file);

//     const tempId = `temp-${Date.now()}`;
//     const optimisticMessage: ChatMessage = {
//       id: tempId,
//       conversationId: selectedConversationId,
//       senderId: MY_USER_ID,
//       content: file ? "[image]" : content,
//       fileUrl: file ? URL.createObjectURL(file) : undefined,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       status: "sending",
//     };

//     dispatch(
//       appendLocalMessage({ conversationId: selectedConversationId, message: optimisticMessage })
//     );

//     sendSocketMessage({
//       ...optimisticMessage,
//       fileUrl: fileBase64,
//     });
//   };

//   // 🔹 Render
//   return (
//     <div className="flex h-[calc(100vh_-_100px)] border rounded-lg overflow-hidden shadow-xl bg-white">
//       {/* Sidebar */}
//       <ConversationList
//         conversations={conversationListProps}
//         selectedId={selectedConversationId ?? undefined}
//         onSelect={(id) => dispatch(setSelectedConversation(id))}
//       />

//       {/* Main Chat */}
//       <div className="flex flex-1 flex-col bg-gray-50">
//         <div className="p-4 border-b bg-white font-semibold text-lg">
//           {currentPartnerName}
//           {connected ? (
//             <span className="ml-2 text-green-500 text-sm">(online)</span>
//           ) : (
//             <span className="ml-2 text-gray-400 text-sm">(offline)</span>
//           )}
//         </div>

//         {selectedConversationId && MY_USER_ID ? (
//           <>
//             <MessageList messages={messagesFromSlice ?? []} myUserId={MY_USER_ID} />
//             <MessageInput
//               onSend={(msg, file) => handleSendMessage(msg, file)}
//               disabled={isLoading || isFetching}
//             />
//           </>
//         ) : (
//           <div className="flex flex-1 items-center justify-center text-gray-500">
//             {MY_USER_ID
//               ? "Select a conversation to start chatting."
//               : "Please log in to chat."}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



