 import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} from "@/redux/features/chatmessage/chatApi";
import {
  setSelectedConversation,
  appendLocalMessage,
  replaceLocalMessage,
} from "@/redux/features/chatmessage/chatSlice";
import type { ChatMessage, Conversation } from "@/redux/types/chat.types";
import useChatSocket from "@/hooks/useChatSocket";

import ConversationList from "./ConversationList";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
 
export default function ChatContainer({ isProvider = false }: { isProvider?: boolean }) {
  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector((s) => s.auth.user?.id) || "";
  const token = useAppSelector((s) => s.auth.token);
  const MY_USER_ID = currentUserId || token || "";

  const selectedConversationId = useAppSelector((s) => s.chat.selectedConversationId);
  const messagesFromSlice = useAppSelector((s) =>
    selectedConversationId ? s.chat.messagesByConversation[selectedConversationId] ?? [] : []
  );

  const { data: conversations = [] } = useGetConversationsQuery(undefined, { skip: !MY_USER_ID });
  const { data: fetchedMessages = [], isLoading, isFetching } = useGetMessagesQuery(
    selectedConversationId ? { conversationId: selectedConversationId } : ({} as any),
    { skip: !selectedConversationId }
  );

  // 🔹 API থেকে মেসেজগুলো প্রথমে store-এ append
  useEffect(() => {
    if (!selectedConversationId || !fetchedMessages.length) return;

    const localMessages = messagesFromSlice ?? [];
    const newMessages = fetchedMessages.filter(
      (msg) => !localMessages.some((local) => local.id === msg.id)
    );

    newMessages.forEach((msg) =>
      dispatch(appendLocalMessage({ conversationId: selectedConversationId, message: msg }))
    );
  }, [fetchedMessages, selectedConversationId, dispatch]);

  // 🔹 Socket
  const socket = useChatSocket(MY_USER_ID, isProvider);

  // 🔹 Join conversation room


  useEffect(() => {
    if (selectedConversationId && socket?.current?.connected) {
      socket.current.emit("joinConversation", selectedConversationId);
    }
  }, [selectedConversationId, socket]);


useEffect(() => {
  if (selectedConversationId && socket?.current?.connected) {
    console.log("Joining conversation:", selectedConversationId);
    socket.current.emit("joinConversation", selectedConversationId);
  }
}, [selectedConversationId, socket]);



  // 🔹 Handle incoming messages from Socket
  // useEffect(() => {
  //   if (!socket.current) return;

  //   const s = socket.current;

  //   const handleNewMessage = (msg: ChatMessage) => {
  //     dispatch(appendLocalMessage({ conversationId: msg.conversationId, message: msg }));

  //     if (msg.senderId !== MY_USER_ID) {
  //       toast(`New message: ${msg.content}`, { position: "bottom-right" });
  //     }
  //   };

  //   s.on("newMessage", handleNewMessage);

  //   return () => {
  //     s.off("newMessage", handleNewMessage);
  //   };
  // }, [socket, MY_USER_ID, dispatch]);


 

  const [sendMessage] = useSendMessageMutation();

  const getPartnerDetails = (conversation: Conversation) => {
    const partner = String(conversation.user?.id) === String(MY_USER_ID)
      ? conversation.provider
      : conversation.user;
    return { name: partner?.name || `User ${partner?.id?.slice(0, 4)}` || "Unknown" };
  };

  const conversationListProps = useMemo(() =>
    conversations?.map((c) => ({
      id: c.id,
      otherUserName: getPartnerDetails(c).name,
      lastMessage: c.lastMessagePreview || "No messages yet",
      unreadCount: c.unreadCount || 0,
    })), [conversations, MY_USER_ID]
  );



// const conversationListProps = useMemo(() => {
//   if (!Array.isArray(conversations)) return [];

//   return conversations.map((c) => ({
//     id: c.id,
//     otherUserName: getPartnerDetails(c).name,
//     lastMessage: c.lastMessagePreview || "No messages yet",
//     unreadCount: c.unreadCount || 0,
//   }));
// }, [conversations, MY_USER_ID]);


  const currentPartnerName = useMemo(() => {
    const currentConversation = conversations.find((c) => c.id === selectedConversationId);
    return currentConversation ? getPartnerDetails(currentConversation).name : "Select a chat";
  }, [conversations, selectedConversationId, MY_USER_ID]);


// const currentPartnerName = useMemo(() => {
//   if (!Array.isArray(conversations)) return "Select a chat";

//   const currentConversation = conversations.find(
//     (c) => c.id === selectedConversationId
//   );
//   return currentConversation ? getPartnerDetails(currentConversation).name : "Select a chat";
// }, [conversations, selectedConversationId, MY_USER_ID]);


  // 🔹 Send message handler
  const handleSendMessage = async (content: string, file?: File) => {
    if (!selectedConversationId || !MY_USER_ID || (!content.trim() && !file)) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: ChatMessage = {
      id: tempId,
      conversationId: selectedConversationId,
      senderId: MY_USER_ID,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "sending",
    };

    dispatch(appendLocalMessage({ conversationId: selectedConversationId, message: optimisticMessage }));

    try {
      const res = await sendMessage({ conversationId: selectedConversationId, content, file }).unwrap();
      const serverMessage = res?.data ?? res;

      if (serverMessage?.id) {
        dispatch(replaceLocalMessage({
          conversationId: selectedConversationId,
          tempId,
          newMessage: serverMessage as ChatMessage
        }));
      }
    } catch (err) {
      console.error("❌ Failed to send message:", err);
    }
  };

  return (
    <div className="flex h-[calc(100vh_-_100px)] border rounded-lg overflow-hidden shadow-xl">
      <ConversationList
        conversations={conversationListProps}
        selectedId={selectedConversationId ?? undefined}
        onSelect={(id) => dispatch(setSelectedConversation(id))}
      />
      <div className="flex flex-1 flex-col bg-gray-50">
        <div className="p-4 border-b bg-white font-semibold text-lg">{currentPartnerName}</div>
        
        {selectedConversationId && MY_USER_ID ? (
          <>
            <MessageList messages={messagesFromSlice} myUserId={MY_USER_ID} />
            <MessageInput onSend={handleSendMessage} disabled={isLoading || isFetching} />
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































// import { useEffect, useMemo } from "react";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
// import {
//   useGetConversationsQuery,
//   useGetMessagesQuery,
//   useSendMessageMutation,
// } from "@/redux/features/chatmessage/chatApi";
// import {
//   setSelectedConversation,
//   appendLocalMessage,
//   replaceLocalMessage,
// } from "@/redux/features/chatmessage/chatSlice";
// import type { ChatMessage, Conversation } from "@/redux/types/chat.types";
// import useChatSocket from "@/hooks/useChatSocket";

// import ConversationList from "./ConversationList";
// import MessageList from "./MessageList";
// import MessageInput from "./MessageInput";
// import toast from "react-hot-toast";

// export default function ChatContainer({ isProvider = false }: { isProvider?: boolean }) {
//   const dispatch = useAppDispatch();
//   const currentUserId = useAppSelector((s) => s.auth.user?.id) || "";
//   const token = useAppSelector((s) => s.auth.token);
//   const MY_USER_ID = currentUserId || token || "";

//   const selectedConversationId = useAppSelector((s) => s.chat.selectedConversationId);
//   const messagesFromSlice = useAppSelector((s) =>
//     selectedConversationId ? s.chat.messagesByConversation[selectedConversationId] ?? [] : []
//   );

//   const { data: conversations = [] } = useGetConversationsQuery(undefined, { skip: !MY_USER_ID });
//   const { data: fetchedMessages = [], isLoading, isFetching } = useGetMessagesQuery(
//     selectedConversationId ? { conversationId: selectedConversationId } : ({} as any),
//     { skip: !selectedConversationId }
//   );

//   // Merge fetched messages
//   useEffect(() => {
//     if (!selectedConversationId || !fetchedMessages.length) return;

//     const localMessages = messagesFromSlice ?? [];
//     const newMessages = fetchedMessages.filter(
//       (msg) => !localMessages.some((local) => local.id === msg.id || local.id.startsWith("temp-"))
//     );

//     newMessages.forEach((msg) =>
//       dispatch(appendLocalMessage({ conversationId: selectedConversationId, message: msg }))
//     );
//   }, [fetchedMessages, selectedConversationId, messagesFromSlice, dispatch]);

//   // Socket
//   const socket = useChatSocket(MY_USER_ID, isProvider);

//   // Join conversation room
//   useEffect(() => {
//     if (selectedConversationId && socket?.current?.connected) {
//       socket.current.emit("joinConversation", selectedConversationId);
//     }
//   }, [selectedConversationId, socket]);

//   const [sendMessage] = useSendMessageMutation();

//   // Partner helper
//   const getPartnerDetails = (conversation: Conversation) => {
//     const partner = String(conversation.user?.id) === String(MY_USER_ID)
//       ? conversation.provider
//       : conversation.user;
//     return { name: partner?.name || `User ${partner?.id?.slice(0, 4)}` || "Unknown" };
//   };

//   const conversationListProps = useMemo(() =>
//     conversations.map((c) => ({
//       id: c.id,
//       otherUserName: getPartnerDetails(c).name,
//       lastMessage: c.lastMessagePreview || "No messages yet",
//       unreadCount: c.unreadCount || 0,
//     })), [conversations, MY_USER_ID]
//   );

//   const currentPartnerName = useMemo(() => {
//     const currentConversation = conversations.find((c) => c.id === selectedConversationId);
//     return currentConversation ? getPartnerDetails(currentConversation).name : "Select a chat";
//   }, [conversations, selectedConversationId, MY_USER_ID]);

//   // Send message
//   const handleSendMessage = async (content: string, file?: File) => {
//     if (!selectedConversationId || !MY_USER_ID || (!content.trim() && !file)) return;

//     const tempId = `temp-${Date.now()}`;
//     const optimisticMessage: ChatMessage = {
//       id: tempId,
//       conversationId: selectedConversationId,
//       senderId: MY_USER_ID,
//       content,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       status: "sending",
//     };

//     dispatch(appendLocalMessage({ conversationId: selectedConversationId, message: optimisticMessage }));

//     try {
//       const res = await sendMessage({ conversationId: selectedConversationId, content, file }).unwrap();
//       const serverMessage = res?.data ?? res;

//       if (serverMessage?.id) {
//         dispatch(replaceLocalMessage({
//           conversationId: selectedConversationId,
//           tempId,
//           newMessage: serverMessage as ChatMessage
//         }));
//       }
//     } catch (err) {
//       console.error("❌ Failed to send message:", err);
//     }
//   };

//   // Toast for incoming messages
//   useEffect(() => {
//     if (!messagesFromSlice.length) return;
//     const lastMessage = messagesFromSlice[messagesFromSlice.length - 1];
//     if (lastMessage.senderId !== MY_USER_ID) {
//       toast(`New message: ${lastMessage.content}`, { position: "bottom-right" });
//     }
//   }, [messagesFromSlice, MY_USER_ID]);

//   return (
//     <div className="flex h-[calc(100vh_-_100px)] border rounded-lg overflow-hidden shadow-xl">
//       <ConversationList
//         conversations={conversationListProps}
//         selectedId={selectedConversationId ?? undefined}
//         onSelect={(id) => dispatch(setSelectedConversation(id))}
//       />
//       <div className="flex flex-1 flex-col bg-gray-50">
//         <div className="p-4 border-b bg-white font-semibold text-lg">{currentPartnerName}</div>
//         {selectedConversationId && MY_USER_ID ? (
//           <>
//             <MessageList messages={messagesFromSlice} myUserId={MY_USER_ID} />
//             <MessageInput onSend={handleSendMessage} disabled={isLoading || isFetching} />
//           </>
//         ) : (
//           <div className="flex flex-1 items-center justify-center text-gray-500">
//             {MY_USER_ID ? "Select a conversation to start chatting." : "Please log in to chat."}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }






























// // src/components/chat/ChatContainer.tsx

// import { useEffect, useMemo } from "react";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
// import {
//   useGetConversationsQuery,
//   useGetMessagesQuery,
//   useSendMessageMutation,
// } from "@/redux/features/chatmessage/chatApi";
// import {
//   setSelectedConversation,
//   appendLocalMessage,
//   replaceLocalMessage,
// } from "@/redux/features/chatmessage/chatSlice";
// import type { ChatMessage, Conversation } from "@/redux/types/chat.types";
// import useChatSocket from "@/hooks/useChatSocket";

// import ConversationList from "./ConversationList";
// import MessageList from "./MessageList";
// import MessageInput from "./MessageInput";

// export default function ChatContainer() {
//   const dispatch = useAppDispatch();

 
//   // --- Authenticated User ---
//   const currentUserId = useAppSelector((state) => state.auth.user?.id);
//   const MY_USER_ID = currentUserId || "";
//   console.log(MY_USER_ID, "MY_USER_ID");

//   // --- Redux State ---
//   const selectedConversationId = useAppSelector((s) => s.chat.selectedConversationId);
//   const messagesFromSlice = useAppSelector((s) =>
//     selectedConversationId ? s.chat.messagesByConversation[selectedConversationId] ?? [] : []
//   );

//   // --- RTK Query Hooks ---
//   const { data: conversations = [] } = useGetConversationsQuery(undefined, {
//     skip: !MY_USER_ID,
//   });
// console.log("🟢 Conversations from backend:", conversations);
 
//   const {
//     data: fetchedMessages = [],
//     isLoading: isMessagesLoading,
//     isFetching: isMessagesFetching,
//   } = useGetMessagesQuery(
//     selectedConversationId ? { conversationId: selectedConversationId } : ({} as any),
//     { skip: !selectedConversationId }
//   );


// console.log("🟢 Messages from backend for conversation", selectedConversationId, ":", fetchedMessages);
// console.log("Loading:", isMessagesLoading, "Fetching:", isMessagesFetching, );

//   // --- Merge fetched messages with local messages (optimistic ones) ---
//   useEffect(() => {
//     if (!selectedConversationId || !fetchedMessages.length) return;

//     const localMessages = messagesFromSlice ?? [];

//     // Filter fetched messages not already in localMessages
//     const newMessages = fetchedMessages.filter(
//       (msg) => !localMessages.some((local) => local.id === msg.id)
//     );

//     if (newMessages.length > 0) {
//       // Append new messages without overwriting optimistic ones
//       newMessages.forEach((msg) =>
//         dispatch(appendLocalMessage({ conversationId: selectedConversationId, message: msg }))
//       );
//     }
//   }, [fetchedMessages, selectedConversationId, dispatch, messagesFromSlice]);



//   const [sendMessage] = useSendMessageMutation();

//   // --- Realtime Socket Listener ---
//   // useChatSocket(MY_USER_ID);


//   // --- Partner Info Helper ---
//   const getPartnerDetails = (conversation: Conversation) => {
//     const partner =
//       String(conversation.user?.id) === String(MY_USER_ID)
//         ? conversation.provider
//         : conversation.user;

//     return {
//       name: partner?.name || `User ${partner?.id?.slice(0, 4)}` || "Unknown User",
//     };
//   };

//   const conversationListProps = useMemo(
//     () =>
//       conversations.map((c) => ({
//         id: c.id,
//         otherUserName: getPartnerDetails(c).name,
//         lastMessage: c.lastMessagePreview || "No messages yet",
//         unreadCount: c.unreadCount || 0,
//       })),
//     [conversations, MY_USER_ID]
//   );

//   const currentPartnerName = useMemo(() => {
//     const currentConversation = conversations.find((c) => c.id === selectedConversationId);
//     return currentConversation ? getPartnerDetails(currentConversation).name : "Select a Chat";
//   }, [conversations, selectedConversationId, MY_USER_ID]);

//   // --- Handle Message Sending ---
//   const handleSendMessage = async (content: string, file?: File) => {
//     if (!selectedConversationId || !MY_USER_ID || (!content.trim() && !file)) return;

//     // 1️⃣ Create optimistic message
//     const tempId = `temp-${Date.now()}`;
//     const optimisticMessage: ChatMessage = {
//       id: tempId,
//       conversationId: selectedConversationId,
//       senderId: MY_USER_ID,
//       content,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       status: "sending",
//     };

//     dispatch(appendLocalMessage({ conversationId: selectedConversationId, message: optimisticMessage }));

//     try {
//       // 2️⃣ Send to backend
//       const res = await sendMessage({ conversationId: selectedConversationId, content, file }).unwrap();
//       const serverMessage = res?.data ?? res;
//       console.log("Server response:", serverMessage);

//       // 3️⃣ Replace optimistic with server message
//       if (serverMessage?.id) {
//         dispatch(
//           replaceLocalMessage({
//             conversationId: selectedConversationId,
//             tempId,
//             newMessage: serverMessage as ChatMessage,
//           })
//         );
//       }
//     } catch (err) {
//       console.error("❌ Failed to send message:", err);
//     }
//   };

//   // --- Render ---
//   return (
//     <div className="flex h-[calc(100vh_-_100px)] border rounded-lg overflow-hidden shadow-xl">
//       {/* Left: Conversation List */}
//       <ConversationList
//         conversations={conversationListProps}
//         selectedId={selectedConversationId ?? undefined}
//         onSelect={(id) => dispatch(setSelectedConversation(id))}
//       />

//       {/* Right: Chat Area */}
//       <div className="flex flex-1 flex-col bg-gray-50">
//         <div className="p-4 border-b bg-white font-semibold text-lg">
//           {currentPartnerName}
//         </div>

//         {selectedConversationId && MY_USER_ID ? (
//           <>
//             <MessageList
//               messages={messagesFromSlice}
//               myUserId={MY_USER_ID}
//             />
//             <MessageInput
//               onSend={handleSendMessage}
//               disabled={isMessagesFetching || isMessagesLoading}
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



















 

// // src/components/chat/ChatContainer.tsx

// import { useEffect, useMemo } from "react";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
// import {
//   useGetConversationsQuery,
//   useGetMessagesQuery,
//   useSendMessageMutation,
// } from "@/redux/features/chatmessage/chatApi";
// import {
//   setConversationMessages,
//   setSelectedConversation,
//   appendLocalMessage,
//   replaceLocalMessage,
// } from "@/redux/features/chatmessage/chatSlice";
// import type { ChatMessage, Conversation } from "@/redux/types/chat.types";
// import useChatSocket from "@/hooks/useChatSocket";

// import ConversationList from "./ConversationList";
// import MessageList from "./MessageList";
// import MessageInput from "./MessageInput";

// export default function ChatContainer() {
//   const dispatch = useAppDispatch();

//   // --- Authenticated User ---
//   const currentUserId = useAppSelector((state) => state.auth.user?.id);
//   const MY_USER_ID = currentUserId || "";
// console.log(MY_USER_ID,"MY_USER_ID")
//   // --- Redux State ---
//   const selectedConversationId = useAppSelector((s) => s.chat.selectedConversationId);
//   const messagesFromSlice = useAppSelector((s) =>
//     selectedConversationId ? s.chat.messagesByConversation[selectedConversationId] ?? [] : []
//   );

//   // --- RTK Query Hooks ---
//   const { data: conversations = [] } = useGetConversationsQuery(undefined, {
//     skip: !MY_USER_ID,
//   });
//  console.log(conversations,"conversations")
//   const {
//     data: fetchedMessages = [],
//     isLoading: isMessagesLoading,
//     isFetching: isMessagesFetching,
//   } = useGetMessagesQuery(
//     selectedConversationId ? { conversationId: selectedConversationId } : ({} as any),
//     { skip: !selectedConversationId }
//   );
// console.log(fetchedMessages,"fetchedMessages")
//   // const [sendMessage] = useSendMessageMutation();
//   // --- Realtime Socket Listener ---
//   useChatSocket(MY_USER_ID);

//   // --- Sync messages only once when fetching (avoid overwriting optimistic ones) ---
//   useEffect(() => {
//     if (!selectedConversationId || !fetchedMessages.length) return;

//     // Only set if local store is empty (first load)
//     const localMessages = messagesFromSlice ?? [];
//     if (localMessages.length === 0) {
//       dispatch(setConversationMessages({ conversationId: selectedConversationId, messages: fetchedMessages }));
//     }
//   }, [fetchedMessages, selectedConversationId, dispatch, messagesFromSlice]);

//   // --- Partner Info Helper ---
//   const getPartnerDetails = (conversation: Conversation) => {
//     const partner =
//       String(conversation.user?.id) === String(MY_USER_ID)
//         ? conversation.provider
//         : conversation.user;

//     return {
//       name: partner?.name || `User ${partner?.id?.slice(0, 4)}` || "Unknown User",
//     };
//   };

//   const conversationListProps = useMemo(
//     () =>
//       conversations?.map((c) => ({
//         id: c.id,
//         otherUserName: getPartnerDetails(c).name,
//         lastMessage: c.lastMessagePreview || "No messages yet",
//         unreadCount: c.unreadCount || 0,
//       })),
//     [conversations, MY_USER_ID]
//   );

//   const currentPartnerName = useMemo(() => {
//     const currentConversation = conversations.find((c) => c.id === selectedConversationId);
//     return currentConversation ? getPartnerDetails(currentConversation).name : "Select a Chat";
//   }, [conversations, selectedConversationId, MY_USER_ID]);

// //   // --- Handle Message Sending ---
// //   const handleSendMessage = async (content: string, file?: File) => {
// //     if (!selectedConversationId || !MY_USER_ID || (!content.trim() && !file)) return;

// //     // 1️⃣ Create optimistic message (shows instantly on the right)
// //     const tempId = `temp-${Date.now()}`;
// //     const optimisticMessage: ChatMessage = {
// //       id: tempId,
// //       conversationId: selectedConversationId,
// //       senderId: MY_USER_ID,
// //       content,
// //       createdAt: new Date().toISOString(),
// //       updatedAt: new Date().toISOString(),
// //       status: "sending",
// //     };

// //     dispatch(appendLocalMessage({ conversationId: selectedConversationId, message: optimisticMessage }));

// //     try {
// //       // 2️⃣ Send to backend
// //       const res = await sendMessage({ conversationId: selectedConversationId, content, file }).unwrap();
// //       const serverMessage = res?.data ?? res;
// // console.log(res,"res")

// //       // 3️⃣ Replace optimistic with server message
// //       if (serverMessage?.id) {
// //         dispatch(
// //           replaceLocalMessage({
// //             conversationId: selectedConversationId,
// //             tempId,
// //             newMessage: serverMessage as ChatMessage,
// //           })
// //         );
// //       } else {
// //         console.warn("⚠️ Unexpected response:", res);
// //       }
// //     } catch (err) {
// //       console.error("❌ Failed to send message:", err);
// //     }
// //   };



// const [sendMessage] = useSendMessageMutation();

// const handleSendMessage = async (content: string, file?: File) => {
//   if (!selectedConversationId || !MY_USER_ID || (!content.trim() && !file)) return;

//   const tempId = `temp-${Date.now()}`;
//   const optimisticMessage: ChatMessage = {
//     id: tempId,
//     conversationId: selectedConversationId,
//     senderId: MY_USER_ID,
//     content,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     status: "sending",
//   };

//   dispatch(appendLocalMessage({ conversationId: selectedConversationId, message: optimisticMessage }));

//   try {
//     const res = await sendMessage({ conversationId: selectedConversationId, content, file }).unwrap();
//     const serverMessage = res?.data ?? res;
//     console.log(res,"res")

//     if (serverMessage?.id) {
//       dispatch(
//         replaceLocalMessage({
//           conversationId: selectedConversationId,
//           tempId,
//           newMessage: serverMessage as ChatMessage,
//         })
//       );
//     }
//   } catch (err) {
//     console.error("❌ Failed to send message:", err);
//   }
// };




//   // --- Render ---
//   return (
//     <div className="flex h-[calc(100vh_-_100px)] border rounded-lg overflow-hidden shadow-xl">
//       {/* Left: Conversation List */}
//       <ConversationList
//         conversations={conversationListProps}
//         selectedId={selectedConversationId ?? undefined}
//         onSelect={(id) => dispatch(setSelectedConversation(id))}
//       />

//       {/* Right: Chat Area */}
//       <div className="flex flex-1 flex-col bg-gray-50">
//         <div className="p-4 border-b bg-white font-semibold text-lg">
//           {currentPartnerName}
//         </div>

//         {selectedConversationId && MY_USER_ID ? (
//           <>
//             <MessageList
//               messages={messagesFromSlice}
//               myUserId={MY_USER_ID}
//             />
//             <MessageInput
//               onSend={handleSendMessage}
//               disabled={isMessagesFetching || isMessagesLoading}
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

















 








 

 





// // src/components/chat/ChatContainer.tsx

// import { useEffect, useMemo, useRef } from "react";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
// import {
//   useGetConversationsQuery,
//   useGetMessagesQuery,
//   useSendMessageMutation,
// } from "@/redux/features/chatmessage/chatApi";
// import {
//   setConversationMessages,
//   setSelectedConversation,
//   appendLocalMessage,
//   replaceLocalMessage,
// } from "@/redux/features/chatmessage/chatSlice";
// import type { ChatMessage, Conversation } from "@/redux/types/chat.types";

// // Import your components
// import ConversationList from "./ConversationList";
// import MessageList from "./MessageList";
// import MessageInput from "./MessageInput";

// // Placeholder for custom socket hook
// const useSocket = (userId: string) => {
//     // Implement your socket connection here
//     return useRef<any>(null);
// };


// export default function ChatContainer() {
//   const dispatch = useAppDispatch();
  
//   // 💡 FIX: Dynamically fetch the authenticated user's ID from the Auth slice.
//   // Assuming your state structure is: state.auth.user.id
//   const currentUserId = useAppSelector((state) => state.auth.user?.id);
//   const MY_USER_ID = currentUserId || ""; 

//   // --- Chat State ---
//   const selectedConversationId = useAppSelector((s) => s.chat.selectedConversationId);
//   const messagesFromSlice = useAppSelector((s) =>
//     selectedConversationId ? s.chat.messagesByConversation[selectedConversationId] ?? [] : [],
//   );

//   // --- RTK Query Hooks ---
//   // Ensure MY_USER_ID exists before fetching
//   const { data: conversations } = useGetConversationsQuery(undefined, { skip: !MY_USER_ID });
//   const { data: messages, isLoading: isMessagesLoading, isFetching: isMessagesFetching } = useGetMessagesQuery(
//     selectedConversationId ? { conversationId: selectedConversationId } : ({} as any),
//     { skip: !selectedConversationId },
//   );
//   const [sendMessage] = useSendMessageMutation();
// console.log(sendMessage)
//   useSocket(MY_USER_ID);

//   // --- Effects ---
//   useEffect(() => {
//     if (messages && selectedConversationId) {
//       dispatch(setConversationMessages({ conversationId: selectedConversationId, messages }));
//     }
//   }, [messages, selectedConversationId, dispatch]);


//   // --- Logic to get Partner Name ---
//   // This logic now relies on MY_USER_ID being correctly fetched.
//   const getPartnerDetails = (conversation: Conversation) => {
//     // Check if the current user is the 'user' or the 'provider' in the conversation
//     const partner = 
//         (String(conversation.user?.id) === String(MY_USER_ID)) 
//         ? conversation.provider 
//         : conversation.user;

//     return {
//         // Use partner's name or create a fallback name
//         name: partner?.name || `User ${partner?.id?.slice(0, 4)}` || "Unknown User",
//     };
//   };


//   // --- Memoized Data for Components ---
//   const conversationListProps = useMemo(() => {
//     return conversations?.map(c => ({
//         id: c.id,
//         otherUserName: getPartnerDetails(c).name,
//         lastMessage: c.lastMessagePreview || 'No messages yet', 
//         unreadCount: c.unreadCount || 0,
//     })) || [];
//   }, [conversations, MY_USER_ID]); // Dependency on MY_USER_ID added for safety

//   const currentPartnerName = useMemo(() => {
//     const currentConversation = conversations?.find(c => c.id === selectedConversationId);
//     return currentConversation ? getPartnerDetails(currentConversation).name : "Select a Chat";
//   }, [conversations, selectedConversationId, MY_USER_ID]);


//   // --- Handlers ---
//   const handleSelectConversation = (id: string) => {
//     dispatch(setSelectedConversation(id));
//   };
  
//   const handleSendMessage = (content: string, file?: File) => {
//     if (!selectedConversationId || !MY_USER_ID || (!content.trim() && !file)) return;

//     // 1. Optimistic Update (Crucial: Uses MY_USER_ID for immediate right alignment)
//     const tempId = `temp-${Date.now()}`;
//     const newMessage: ChatMessage = {
//       id: tempId,
//       senderId: MY_USER_ID, // This is the key to aligning the optimistic message to the right
//       content: content,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     };
//     dispatch(appendLocalMessage({ conversationId: selectedConversationId, message: newMessage }));

//     // 2. Send via RTK Mutation
//     sendMessage({ conversationId: selectedConversationId, content, file })
//       .unwrap()
//       .then((res) => {
//         console.log(res.data)
//         // 3. Replace Optimistic Message
//         if (res.data) {
//            dispatch(replaceLocalMessage({
//             conversationId: selectedConversationId,
//             tempId: tempId,
//             newMessage: res.data as ChatMessage, 
//           }));
//         }
//       })
//       .catch((err) => {
//         console.error("Failed to send message:", err);
//       });
//   };

//   // --- Render ---
//   return (
//     <div className="flex h-[calc(100vh_-_100px)] border rounded-lg overflow-hidden shadow-xl">
//       {/* 1. Conversation List */}
//       <ConversationList
//         conversations={conversationListProps}
//         selectedId={selectedConversationId ?? undefined}
//         onSelect={handleSelectConversation}
//       />

//       {/* 2. Chat Area */}
//       <div className="flex flex-1 flex-col bg-gray-50">
//         <div className="p-4 border-b bg-white font-semibold text-lg">
//           {currentPartnerName}
//         </div>
        
//         {selectedConversationId && MY_USER_ID ? (
//           <>
//             {/* Message Display */}
//             <MessageList 
//                 messages={messagesFromSlice}
//                 myUserId={MY_USER_ID} // Pass the dynamic, authenticated user ID
//             />
//             {/* Input */}
//             <MessageInput 
//                 onSend={handleSendMessage} 
//                 disabled={isMessagesFetching || isMessagesLoading}
//             />
//           </>
//         ) : (
//           <div className="flex flex-1 items-center justify-center text-gray-500">
//             {MY_USER_ID ? "Select a conversation to start chatting." : "Please log in to chat."}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// // src/components/chat/ChatContainer.tsx
// import { useEffect, useMemo, useRef } from "react";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
// import {
//   useGetConversationsQuery,
//   useGetMessagesQuery,
// } from "@/redux/features/chatmessage/chatApi";
// import {
//   setSelectedConversation,
//   appendLocalMessage,
//   replaceLocalMessage,
//   receiveMessage,
//   upsertConversation,
// } from "@/redux/features/chatmessage/chatSlice";
// import type { ChatMessage, Conversation } from "@/redux/types/chat.types";
// import useChatSocket from "@/hooks/useChatSocket";

// import ConversationList from "./ConversationList";
// import MessageList from "./MessageList";
// import MessageInput from "./MessageInput";

// export default function ChatContainer() {
//   const dispatch = useAppDispatch();

//   // --- Authenticated user ---
//   const currentUserId = useAppSelector((state) => state.auth.user?.id);
//   const MY_USER_ID = currentUserId || "";

//   // --- Redux state ---
//   const selectedConversationId = useAppSelector((s) => s.chat.selectedConversationId);
//   const messagesFromSlice = useAppSelector(
//     (s) =>
//       selectedConversationId
//         ? s.chat.messagesByConversation[selectedConversationId] ?? []
//         : []
//   );

//   // --- RTK Query hooks ---
//   const { data: conversations = [] } = useGetConversationsQuery(undefined, {
//     skip: !MY_USER_ID,
//   });

//   const {
//     data: fetchedMessages = [],
//     isLoading: isMessagesLoading,
//     isFetching: isMessagesFetching,
//   } = useGetMessagesQuery(
//     selectedConversationId ? { conversationId: selectedConversationId } : ({} as any),
//     { skip: !selectedConversationId }
//   );

//   // --- Socket setup ---
//   const socket = useChatSocket(MY_USER_ID);
//   const socketRef = useRef(socket);
//   socketRef.current = socket;

//   // --- Listen to real-time socket events ---
//   useEffect(() => {
//     if (!socket) return;

//     // ✅ New message arrived
//     socket.on("newMessage", (msg: ChatMessage) => {
//       dispatch(receiveMessage({ conversationId: msg.conversationId, message: msg }));
//     });

//     // ✅ Conversation updated (last message, unread count)
//     socket.on("conversationUpdated", (payload: any) => {
//       dispatch(
//         upsertConversation({
//           id: payload.conversationId,
//           lastMessagePreview: payload.lastMessage.content,
//           updatedAt: payload.lastMessage.createdAt,
//         })
//       );
//     });

//     // Cleanup on unmount
//     return () => {
//       socket.off("newMessage");
//       socket.off("conversationUpdated");
//     };
//   }, [socket, dispatch]);

//   // --- Merge fetched messages with local messages (avoid duplicates) ---
//   useEffect(() => {
//     if (!selectedConversationId || !fetchedMessages.length) return;

//     const localMessages = messagesFromSlice ?? [];
//     const newMessages = fetchedMessages.filter(
//       (msg) => !localMessages.some((local) => local.id === msg.id)
//     );

//     if (newMessages.length > 0) {
//       newMessages.forEach((msg) =>
//         dispatch(appendLocalMessage({ conversationId: selectedConversationId, message: msg }))
//       );
//     }
//   }, [fetchedMessages, selectedConversationId, messagesFromSlice, dispatch]);

//   // --- Partner info helper ---
//   const getPartnerDetails = (conversation: Conversation) => {
//     const partner =
//       String(conversation.user?.id) === String(MY_USER_ID)
//         ? conversation.provider
//         : conversation.user;

//     return {
//       name: partner?.name || `User ${partner?.id?.slice(0, 4)}` || "Unknown User",
//     };
//   };

//   // --- Conversations sidebar list ---
//   const conversationListProps = useMemo(
//     () =>
//       conversations.map((c) => ({
//         id: c.id,
//         otherUserName: getPartnerDetails(c).name,
//         lastMessage: c.lastMessagePreview || "No messages yet",
//         unreadCount: c.unreadCount || 0,
//       })),
//     [conversations, MY_USER_ID]
//   );

//   // --- Current chat header ---
//   const currentPartnerName = useMemo(() => {
//     const currentConversation = conversations.find((c) => c.id === selectedConversationId);
//     return currentConversation ? getPartnerDetails(currentConversation).name : "Select a Chat";
//   }, [conversations, selectedConversationId, MY_USER_ID]);

//   // --- Send message handler ---
//   const handleSendMessage = async (content: string, file?: File) => {
//     if (!selectedConversationId || !MY_USER_ID || (!content.trim() && !file)) return;

//     const tempId = `temp-${Date.now()}`;
//     const optimisticMessage: ChatMessage = {
//       id: tempId,
//       conversationId: selectedConversationId,
//       senderId: MY_USER_ID,
//       content,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       status: "sending",
//     };

//     dispatch(
//       appendLocalMessage({
//         conversationId: selectedConversationId,
//         message: optimisticMessage,
//       })
//     );

//     try {
//       // ✅ Use socket instead of REST API
//       socketRef.current?.emit("sendMessage", {
//         conversationId: selectedConversationId,
//         senderId: MY_USER_ID,
//         content,
//       });

//       // Optional: update optimistic status
//       dispatch(
//         replaceLocalMessage({
//           conversationId: selectedConversationId,
//           tempId,
//           newMessage: { ...optimisticMessage, status: "sent" },
//         })
//       );
//     } catch (err) {
//       console.error("❌ Failed to send message via socket:", err);
//     }
//   };

//   // --- Render ---
//   return (
//     <div className="flex h-[calc(100vh_-_100px)] border rounded-lg overflow-hidden shadow-xl">
//       {/* Left: Conversation list */}
//       <ConversationList
//         conversations={conversationListProps}
//         selectedId={selectedConversationId ?? undefined}
//         onSelect={(id) => dispatch(setSelectedConversation(id))}
//       />

//       {/* Right: Chat area */}
//       <div className="flex flex-1 flex-col bg-gray-50">
//         <div className="p-4 border-b bg-white font-semibold text-lg">
//           {currentPartnerName}
//         </div>

//         {selectedConversationId && MY_USER_ID ? (
//           <>
//             <MessageList messages={messagesFromSlice} myUserId={MY_USER_ID} />
//             <MessageInput
//               onSend={handleSendMessage}
//               disabled={isMessagesFetching || isMessagesLoading}
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
