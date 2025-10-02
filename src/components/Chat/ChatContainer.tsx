import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
import useChatSocket from "@/hooks/useChatSocket";
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} from "@/redux/features/chatmessage/chatApi";
import {
  setConversationMessages,
  markConversationRead,
  upsertConversation,
  appendLocalMessage,
} from "@/redux/features/chatmessage/chatSlice";
import ConversationList from "./ConversationList";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import type { ChatMessage, Conversation } from "@/redux/types/chat.types";
import { useSocket } from "@/services/Usesocket";

export default function ChatContainer({ myUserId }: { myUserId: string }) {
  const socket = useSocket(myUserId || "");
  const dispatch = useAppDispatch();
  const selectedConversationId = useAppSelector(
    (s) => s.chat.selectedConversationId,
  );

  // Initialize socket connection
  useChatSocket(myUserId);

  // Fetch conversations
  const { data: conversationsData } = useGetConversationsQuery();
  const conversations: Conversation[] = conversationsData ?? [];

  // Mutation to POST message
  const [sendMessage] = useSendMessageMutation();

  // Fetch messages
  const { data: messagesData, refetch: refetchMessages } = useGetMessagesQuery(
    selectedConversationId
      ? { conversationId: selectedConversationId }
      : ({} as any),
    { skip: !selectedConversationId },
  );
  const messages: ChatMessage[] = messagesData ?? [];

  // Save API messages to Redux
  useEffect(() => {
    if (messages.length && selectedConversationId) {
      dispatch(
        setConversationMessages({
          conversationId: selectedConversationId,
          messages,
        }),
      );
    }
  }, [messages, selectedConversationId, dispatch]);

  // Upsert conversations into Redux
  useEffect(() => {
    conversations.forEach((c) => dispatch(upsertConversation(c)));
  }, [conversations, dispatch]);

  // Messages from Redux slice
  const messagesFromSlice = useAppSelector((s) =>
    selectedConversationId
      ? (s.chat.messagesByConversation[selectedConversationId] ?? [])
      : [],
  );

  // Combine messages
  const combinedMessages: ChatMessage[] = useMemo(() => {
    const map = new Map<string, ChatMessage>();
    [...messages, ...messagesFromSlice].forEach((m) => map.set(m.id, m));
    return Array.from(map.values()).sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }, [messages, messagesFromSlice]);

  // Socket join & listen
  useEffect(() => {
    if (!selectedConversationId) return;

    socket?.current?.emit("conversation:join", {
      conversationId: selectedConversationId,
    });
    socket?.current?.emit("conversation:read", {
      conversationId: selectedConversationId,
    });
    dispatch(markConversationRead({ conversationId: selectedConversationId }));
    refetchMessages();

    const handleNewMessage = (message: ChatMessage) => {
      if (message.conversationId === selectedConversationId) {
        dispatch(
          appendLocalMessage({
            conversationId: selectedConversationId,
            message,
          }),
        );
      }
    };

    socket?.current?.on("message:new", handleNewMessage);

    return () => {
      socket?.current?.off("message:new", handleNewMessage);
    };
  }, [selectedConversationId, dispatch, refetchMessages]);

  // Send message handler
  const handleSend = async (content: string, file?: File) => {
    if (!selectedConversationId) return;

    const optimisticMsg: ChatMessage = {
      id: `local-${Date.now()}`,
      senderId: myUserId,
      conversationId: selectedConversationId,
      content: file ? URL.createObjectURL(file) : content,
      createdAt: new Date().toISOString(),
      type: file ? (file.type.startsWith("image/") ? "image" : "file") : "text",
      fileName: file?.name ?? null,
      fileSize: file?.size ?? null,
    };

    // Show optimistic message immediately
    dispatch(
      appendLocalMessage({
        conversationId: selectedConversationId,
        message: optimisticMsg,
      }),
    );

    try {
      let fileMeta = undefined;

      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch(
          `${import.meta.env.VITE_API_ENDPOINT}/uploads`,
          {
            method: "POST",
            body: fd,
            credentials: "include",
          },
        );
        if (!res.ok) throw new Error("Upload failed");
        const json = await res.json();
        fileMeta = json.data;
      }

      // Send message to backend
      const newMessage = await sendMessage({
        conversationId: selectedConversationId,
        content,
        file: fileMeta,
      }).unwrap();

      // Replace optimistic message with backend response
      dispatch(
        appendLocalMessage({
          conversationId: selectedConversationId,
          message: newMessage,
        }),
      );

      // Emit via socket for real-time update
      const socket = useSocket(myUserId || "");
      socket?.current?.emit("message:send", {
        conversationId: selectedConversationId,
        content,
        file: fileMeta ?? null,
        tempId: optimisticMsg.id,
      });
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  return (
    <div className="flex h-full">
      <ConversationList conversations={conversations} />
      <div className="flex flex-1 flex-col">
        <MessageList messages={combinedMessages} myUserId={myUserId} />
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
}

/* Part-1 */

// // src/components/Chat/ChatContainer.tsx
// import { useEffect, useMemo } from "react";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
// import useChatSocket from "@/hooks/useChatSocket";
// import {
//   useGetConversationsQuery,
//   useGetMessagesQuery,
//   useSendMessageMutation,
// } from "@/redux/features/chatmessage/chatApi";
// import {
//   setConversationMessages,
//   markConversationRead,
//   upsertConversation,
//   appendLocalMessage,
// } from "@/redux/features/chatmessage/chatSlice";
// import ConversationList from "./ConversationList";
// import MessageList from "./MessageList";
// import MessageInput from "./MessageInput";
// import type { ChatMessage, Conversation } from "@/redux/types/chat.types";
// import { useSocket } from "@/services/Usesocket";

// export default function ChatContainer({ myUserId }: { myUserId: string }) {
//   const dispatch = useAppDispatch();

//   // ✅ single socket instance
//   const socket = useSocket(myUserId || "");

//   const selectedConversationId = useAppSelector(
//     (s) => s.chat.selectedConversationId,
//   );

//   // ✅ setup socket listeners
//   useChatSocket(myUserId);

//   // ✅ fetch conversations
//   const { data: conversationsData } = useGetConversationsQuery();
//   const conversations: Conversation[] = conversationsData ?? [];

//   // ✅ mutation to send message
//   const [sendMessage] = useSendMessageMutation();

//   // ✅ fetch messages
//   const { data: messagesData, refetch: refetchMessages } = useGetMessagesQuery(
//     selectedConversationId
//       ? { conversationId: selectedConversationId }
//       : ({} as any),
//     { skip: !selectedConversationId },
//   );
//   const messages: ChatMessage[] = messagesData ?? [];

//   // ✅ save API messages into Redux
//   useEffect(() => {
//     if (messages.length && selectedConversationId) {
//       dispatch(
//         setConversationMessages({
//           conversationId: selectedConversationId,
//           messages,
//         }),
//       );
//     }
//   }, [messages, selectedConversationId, dispatch]);

//   // ✅ keep conversations synced in Redux
//   useEffect(() => {
//     conversations.forEach((c) => dispatch(upsertConversation(c)));
//   }, [conversations, dispatch]);

//   // ✅ messages from Redux slice
//   const messagesFromSlice = useAppSelector((s) =>
//     selectedConversationId
//       ? (s.chat.messagesByConversation[selectedConversationId] ?? [])
//       : [],
//   );

//   // ✅ merge API + local messages
//   const combinedMessages: ChatMessage[] = useMemo(() => {
//     const map = new Map<string, ChatMessage>();
//     [...messages, ...messagesFromSlice].forEach((m) =>
//       map.set(m.id ?? `temp-${Math.random()}`, m),
//     );
//     return Array.from(map.values()).sort(
//       (a, b) =>
//         new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
//     );
//   }, [messages, messagesFromSlice]);

//   // ✅ socket join + read events
//   useEffect(() => {
//     if (!selectedConversationId) return;

//     socket?.current?.emit("conversation:join", {
//       conversationId: selectedConversationId,
//     });
//     socket?.current?.emit("conversation:read", {
//       conversationId: selectedConversationId,
//     });

//     dispatch(markConversationRead({ conversationId: selectedConversationId }));
//     refetchMessages();

//     const handleNewMessage = (message: ChatMessage) => {
//       if (message.conversationId === selectedConversationId) {
//         dispatch(
//           appendLocalMessage({
//             conversationId: selectedConversationId,
//             message,
//           }),
//         );
//       }
//     };

//     socket?.current?.on("message:new", handleNewMessage);

//     return () => {
//       socket?.current?.off("message:new", handleNewMessage);
//     };
//   }, [selectedConversationId, dispatch, refetchMessages, socket]);

//   // ✅ send message handler
//   const handleSend = async (content: string, file?: File) => {
//     if (!selectedConversationId) return;

//     const optimisticMsg: ChatMessage = {
//       id: `local-${Date.now()}`,
//       senderId: myUserId,
//       conversationId: selectedConversationId,
//       content: file ? URL.createObjectURL(file) : content,
//       createdAt: new Date().toISOString(),
//       type: file ? (file.type.startsWith("image/") ? "image" : "file") : "text",
//       fileName: file?.name ?? null,
//       fileSize: file?.size ?? null,
//     };

//     // optimistic update
//     dispatch(
//       appendLocalMessage({
//         conversationId: selectedConversationId,
//         message: optimisticMsg,
//       }),
//     );

//     try {
//       let fileMeta = undefined;

//       // ✅ file upload
//       if (file) {
//         const fd = new FormData();
//         fd.append("file", file);
//         const res = await fetch(
//           `${import.meta.env.VITE_API_ENDPOINT}/uploads`,
//           {
//             method: "POST",
//             body: fd,
//             credentials: "include",
//           },
//         );
//         if (!res.ok) throw new Error("Upload failed");
//         const json = await res.json();
//         fileMeta = json.data;
//       }

//       // ✅ send message API
//       const newMessage = await sendMessage({
//         conversationId: selectedConversationId,
//         content,
//         file: fileMeta,
//       }).unwrap();

//       // replace optimistic with server message
//       dispatch(
//         appendLocalMessage({
//           conversationId: selectedConversationId,
//           message: newMessage,
//         }),
//       );

//       // ✅ real-time emit
//       socket?.current?.emit("message:send", {
//         conversationId: selectedConversationId,
//         content,
//         file: fileMeta ?? null,
//         tempId: optimisticMsg.id,
//       });
//     } catch (err) {
//       console.error("Send failed:", err);
//     }
//   };

//   return (
//     <div className="flex h-full">
//       <ConversationList conversations={conversations} />
//       <div className="flex flex-1 flex-col">
//         <MessageList messages={combinedMessages} myUserId={myUserId} />
//         <MessageInput onSend={handleSend} />
//       </div>
//     </div>
//   );
// }
