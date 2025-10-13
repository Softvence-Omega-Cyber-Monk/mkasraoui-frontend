
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAppDispatch } from "@/redux/hooks/redux-hook";
import { receiveMessage, replaceLocalMessage } from "@/redux/features/chatmessage/chatSlice";
import type { ChatMessage } from "@/redux/types/chat.types";
import toast from "react-hot-toast";

export default function useChatSocket(userId?: string, isProvider?: boolean) {
  const dispatch = useAppDispatch();
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId || !import.meta.env.VITE_API_ENDPOINT) return;

    const endpoint = import.meta.env.VITE_API_ENDPOINT;
    const transports = ["polling", "websocket"]; // Try websocket first, fallback to polling

    const s = io(endpoint, {
      transports,
      auth: { userId, isProvider },
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 20000,
      forceNew: true,
    });

    socket.current = s;

    /** ✅ Connection events */
    s.on("connect", () => {
      console.log("✅ Connected to socket:", s.id);
    });

    s.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err?.message || err);
    });

    s.on("disconnect", (reason) => {
      console.warn("⚠️ Disconnected:", reason);
    });

    /** ✅ Listen for new messages */
    s.on("newMessage", (msg: ChatMessage) => {
      dispatch(receiveMessage({ conversationId: msg.conversationId, message: msg }));
      if (msg.senderId !== userId) {
        toast(`💬 New message: ${msg.content}`, { position: "bottom-right" });
      }
    });

    /** ✅ Listen for message acknowledgments */
    s.on("message:ack", ({ tempId, message }) => {
      if (tempId) {
        dispatch(
          replaceLocalMessage({
            conversationId: message.conversationId,
            tempId,
            newMessage: message,
          })
        );
      } else {
        dispatch(receiveMessage({ conversationId: message.conversationId, message }));
      }
    });

    /** ✅ Cleanup on unmount */
    return () => {
      s.off("newMessage");
      s.off("message:ack");
      s.disconnect();
      socket.current = null;
      console.log("🧹 Socket disconnected cleanly");
    };
  }, [userId, isProvider, dispatch]);

  return socket;
}
















// import { useEffect, useRef } from "react";
// import { useAppDispatch } from "@/redux/hooks/redux-hook";
// import { receiveMessage, replaceLocalMessage } from "@/redux/features/chatmessage/chatSlice";
// import { io, Socket } from "socket.io-client";
// import type { ChatMessage } from "@/redux/types/chat.types";
// import toast from "react-hot-toast";

// export default function useChatSocket(userId?: string, isProvider?: boolean) {
//   const dispatch = useAppDispatch();
//   const socket = useRef<Socket | null>(null);

//   useEffect(() => {
//    if (!userId || !import.meta.env.VITE_API_ENDPOINT) return;

//     const endpoint =
//       import.meta.env.VITE_SOCKET_URL  || "https://api.mafetefacile.com";

//     const forcePolling =
//       String(import.meta.env.VITE_FORCE_POLLING || "false").toLowerCase() ===
//       "true";
//     const transports = forcePolling ? ["polling"] : ["polling", "websocket"];

//     socket.current = io(endpoint, {
//       transports,
//       auth: { userId, isProvider },
//     });

//     const s = socket.current;
//     socket.current.on("connect", () => console.log("✅ Connected:", socket.current?.id));
// socket.current.on("connect_error", (err) => console.error("❌ Connect error:", err));
// socket.current.on("disconnect", (reason) => console.warn("⚠️ Disconnected:", reason));
//     if (!s) return;

//     const attachListeners = () => {
//       // 🔹 Handle new messages
//       s.on("newMessage", (msg: ChatMessage) => {
//         dispatch(receiveMessage({ conversationId: msg.conversationId, message: msg }));

//         if (msg.senderId !== userId) {
//           console.log("msg.senderId !== userId")
//           toast(`💬 New message: ${msg.content}`, { position: "bottom-right" });
//         }
//       });

//       // 🔹 Handle message acknowledgment
//       s.on("message:ack", ({ tempId, message }) => {
//         if (tempId) {
//           dispatch(
//             replaceLocalMessage({
//               conversationId: message.conversationId,
//               tempId,
//               newMessage: message,
//             })
//           );
//         } else {
//           dispatch(receiveMessage({ conversationId: message.conversationId, message }));
//         }
//       });
//     };

//     if (s.connected) attachListeners();
//     else s.on("connect", attachListeners);

//     return () => {
//       s.off("newMessage");
//       s.off("message:ack");
//       s.off("connect", attachListeners);
//       s.disconnect();
     
//     };
//   }, [userId, isProvider, dispatch]);

//   return socket;
// }




 



// import { useEffect, useRef } from "react";
// import { useAppDispatch } from "@/redux/hooks/redux-hook";
// import { receiveMessage, replaceLocalMessage } from "@/redux/features/chatmessage/chatSlice";
// import { io, Socket } from "socket.io-client";
// import type { ChatMessage } from "@/redux/types/chat.types";
// import toast from "react-hot-toast";

// export default function useChatSocket(userId?: string, isProvider?: boolean) {
//   const dispatch = useAppDispatch();
//   const socket = useRef<Socket | null>(null);

//   useEffect(() => {
//     if (!userId || !import.meta.env.VITE_API_ENDPOINT) return;

//     // Connect socket with auth info
//     const endpoint = import.meta.env.VITE_API_ENDPOINT || "https://api.mafetefacile.com";
//     const forcePolling = String(import.meta.env.VITE_FORCE_POLLING || "false").toLowerCase() === "true";
//     const transports = forcePolling ? ["polling"] : ["polling", "websocket"];

//     // assign the created socket to the ref (do not shadow the ref variable)
//     socket.current = io(endpoint, {
//       transports,
//       auth: { userId, isProvider }, // avoid polling issues
//     });

//     const s = socket.current;
//     if (!s) return;
 
//     const attachListeners = () => {
//       s.on("newMessage", (msg: ChatMessage) => {
//         dispatch(receiveMessage({ conversationId: msg.conversationId, message: msg }));

//         if (msg.senderId !== userId) {
//           toast(`New message: ${msg.content}`, { position: "bottom-right" });
//         }
//       });

 


//       s.on("message:ack", ({ tempId, message }) => {
//         if (tempId) {
//           dispatch(
//             replaceLocalMessage({
//               conversationId: message.conversationId,
//               tempId,
//               newMessage: message,
//             })
//           );
//         } else {
//           dispatch(receiveMessage({ conversationId: message.conversationId, message }));
//         }
//       });
//     };

//     if (s.connected) attachListeners();
//     else s.on("connect", attachListeners);

//     return () => {
//       s.off("newMessage");
//       s.off("message:ack");
//       s.off("connect", attachListeners);
//       s.disconnect();
//     };
//   }, [userId, isProvider, dispatch]);

//   return socket;
// }










// // src/hooks/useChatSocket.ts
// import { useEffect } from "react";
// import { useAppDispatch } from "@/redux/hooks/redux-hook";
// import {
//   setConversations,
//   receiveMessage,
//   upsertConversation,
//   replaceLocalMessage,
// } from "@/redux/features/chatmessage/chatSlice";
// import { useSocket } from "../services/Usesocket";
// import type { ChatMessage, Conversation } from "@/redux/types/chat.types";

// export default function useChatSocket(token?: string) {
//   const dispatch = useAppDispatch();
//   const socket = useSocket(token);

//   useEffect(() => {
//     const s = socket.current;
//     if (!s) return;

//     // Attach listeners only once socket is connected
//     const attachListeners = () => {
//       s.on("conversations", (payload: Conversation[]) =>
//         dispatch(setConversations(payload))
//       );
//       s.on("conversation:list", (payload: Conversation[]) =>
//         dispatch(setConversations(payload))
//       );
//       s.on("conversation:updated", (conv: Conversation) =>
//         dispatch(upsertConversation(conv))
//       );
//       s.on("message:new", (msg: ChatMessage) =>
//         dispatch(receiveMessage({ conversationId: msg.conversationId, message: msg }))
//       );
//       s.on(
//         "message:ack",
//         ({ tempId, message }: { tempId?: string; message: ChatMessage }) => {
//           if (tempId) {
//             dispatch(
//               replaceLocalMessage({
//                 conversationId: message.conversationId,
//                 tempId,
//                 newMessage: message,
//               })
//             );
//           } else {
//             dispatch(
//               receiveMessage({ conversationId: message.conversationId, message })
//             );
//           }
//         }
//       );
//     };

//     if (s.connected) {
//       attachListeners();
//     } else {
//       s.on("connect", attachListeners);
//     }

//     return () => {
//       s.off("conversations");
//       s.off("conversation:list");
//       s.off("conversation:updated");
//       s.off("message:new");
//       s.off("message:ack");
//       s.off("connect", attachListeners);
//     };
//   }, [dispatch, socket]);
// }


















// import { useEffect } from "react";
// import { useAppDispatch } from "@/redux/hooks/redux-hook";
// import {
//   setConversations,
//   receiveMessage,
//   upsertConversation,
//   replaceLocalMessage,
// } from "@/redux/features/chatmessage/chatSlice";
// import { useSocket } from "../services//Usesocket";
// import type { ChatMessage, Conversation } from "@/redux/types/chat.types";

// export default function useChatSocket(myUserId: string | null) {
//   const dispatch = useAppDispatch();
//   const socket = useSocket(myUserId || "");

//   useEffect(() => {
//     if (!myUserId || !socket.current) return;

//     const s = socket.current;

//     s.on("conversations", (payload: Conversation[]) =>
//       dispatch(setConversations(payload))
//     );
//     s.on("conversation:list", (payload: Conversation[]) =>
//       dispatch(setConversations(payload))
//     );
//     s.on("conversation:updated", (conv: Conversation) =>
//       dispatch(upsertConversation(conv))
//     );
//     s.on("message:new", (msg: ChatMessage) =>
//       dispatch(receiveMessage({ conversationId: msg.conversationId, message: msg }))
//     );
//     s.on("message:ack", ({ tempId, message }: { tempId?: string; message: ChatMessage }) => {
//       if (tempId) {
//         dispatch(
//           replaceLocalMessage({
//             conversationId: message.conversationId,
//             tempId,
//             newMessage: message,
//           })
//         );
//       } else {
//         dispatch(
//           receiveMessage({ conversationId: message.conversationId, message })
//         );
//       }
//     });

//     // Cleanup listeners when unmounted
//     return () => {
//       s.off("conversations");
//       s.off("conversation:list");
//       s.off("conversation:updated");
//       s.off("message:new");
//       s.off("message:ack");
//     };
//   }, [myUserId, dispatch, socket]);
// }
















// import { useEffect } from "react";
// import { useAppDispatch } from "@/redux/hooks/redux-hook";
// import {
//   setConversations,
//   receiveMessage,
//   upsertConversation,
//   replaceLocalMessage,
// } from "@/redux/features/chatmessage/chatSlice";
// import type { ChatMessage, Conversation } from "@/redux/types/chat.types";
// import { useSocket } from "@/services/Usesocket";


// export default function useChatSocket(myUserId: string | null) {
//   const dispatch = useAppDispatch();
//   const socket = useSocket(myUserId || "");


//   useEffect(() => {
//     if (!myUserId) return;


//     // Socket event listeners
//     socket?.current?.on("conversations", (payload: Conversation[]) =>
//       dispatch(setConversations(payload)),
//     );
//     socket?.current?.on("conversation:list", (payload: Conversation[]) =>
//       dispatch(setConversations(payload)),
//     );
//     socket?.current?.on("conversation:updated", (conv: Conversation) =>
//       dispatch(upsertConversation(conv)),
//     );
//     socket?.current?.on("message:new", (message: ChatMessage) =>
//       dispatch(
//         receiveMessage({ conversationId: message.conversationId, message }),
//       ),
//     );
//     socket?.current?.on(
//       "message:ack",
//       ({ tempId, message }: { tempId?: string; message: ChatMessage }) => {
//         if (tempId) {
//           dispatch(
//             replaceLocalMessage({
//               conversationId: message.conversationId,
//               tempId,
//               newMessage: message,
//             }),
//           );
//         } else {
//           dispatch(
//             receiveMessage({ conversationId: message.conversationId, message }),
//           );
//         }
//       },
//     );


//     // return () => disconnectSocket();
//   }, [myUserId, dispatch]);
// }
