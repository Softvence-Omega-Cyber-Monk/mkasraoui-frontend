import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks/redux-hook";
import {
  setConversations,
  receiveMessage,
  upsertConversation,
  replaceLocalMessage,
} from "@/redux/features/chatmessage/chatSlice";
import type { ChatMessage, Conversation } from "@/redux/types/chat.types";
import { useSocket } from "@/services/Usesocket";

export default function useChatSocket(myUserId: string | null) {
  const dispatch = useAppDispatch();
  const socket = useSocket(myUserId || "");

  useEffect(() => {
    if (!myUserId) return;

    // Socket event listeners
    socket?.current?.on("conversations", (payload: Conversation[]) =>
      dispatch(setConversations(payload)),
    );
    socket?.current?.on("conversation:list", (payload: Conversation[]) =>
      dispatch(setConversations(payload)),
    );
    socket?.current?.on("conversation:updated", (conv: Conversation) =>
      dispatch(upsertConversation(conv)),
    );
    socket?.current?.on("message:new", (message: ChatMessage) =>
      dispatch(
        receiveMessage({ conversationId: message.conversationId, message }),
      ),
    );
    socket?.current?.on(
      "message:ack",
      ({ tempId, message }: { tempId?: string; message: ChatMessage }) => {
        if (tempId) {
          dispatch(
            replaceLocalMessage({
              conversationId: message.conversationId,
              tempId,
              newMessage: message,
            }),
          );
        } else {
          dispatch(
            receiveMessage({ conversationId: message.conversationId, message }),
          );
        }
      },
    );

    // return () => disconnectSocket();
  }, [myUserId, dispatch]);
}

// import { useEffect } from "react";
// import { initSocket, disconnectSocket } from "@/services/socket";
// import { useAppDispatch } from "@/redux/hooks/redux-hook";
// import {
//   setConversations,
//   receiveMessage,
//   upsertConversation,
//   replaceLocalMessage,
// } from "@/redux/features/chatmessage/chatSlice";
// import type { ChatMessage, Conversation } from "@/redux/types/chat.types";

// export default function useChatSocket(myUserId: string | null) {
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     if (!myUserId) return;

//     const socket = initSocket(myUserId);

//     // Listen for server events
//     socket.on("conversations", (payload: Conversation[]) => dispatch(setConversations(payload)));
//     socket.on("conversation:list", (payload: Conversation[]) => dispatch(setConversations(payload)));
//     socket.on("conversation:updated", (conv: Conversation) => dispatch(upsertConversation(conv)));
//     socket.on("message:new", (message: ChatMessage) =>
//       dispatch(receiveMessage({ conversationId: message.conversationId, message })),
//     );
//     socket.on("message:ack", (payload: { tempId?: string; message: ChatMessage }) => {
//       if (payload.tempId && payload.message) {
//         dispatch(
//           replaceLocalMessage({
//             conversationId: payload.message.conversationId,
//             tempId: payload.tempId,
//             newMessage: payload.message,
//           }),
//         );
//       } else if (payload.message) {
//         dispatch(receiveMessage({ conversationId: payload.message.conversationId, message: payload.message }));
//       }
//     });

//     return () => {
//       socket.off("conversations");
//       socket.off("conversation:list");
//       socket.off("conversation:updated");
//       socket.off("message:new");
//       socket.off("message:ack");
//       disconnectSocket();
//     };
//   }, [myUserId, dispatch]);
// }

// // src/hooks/useChatSocket.ts
// import { useEffect } from "react";
// import { initSocket, getSocket, disconnectSocket } from "@/services/socket";
// import { useAppDispatch } from "@/redux/hooks/redux-hook";
// import {
//   setConversations,
//   receiveMessage,
//   upsertConversation,
//   replaceLocalMessage,
// } from "@/redux/features/chatmessage/chatSlice";
// import type { ChatMessage, Conversation } from "@/redux/types/chat.types";

// export default function useChatSocket(myUserId: string | null) {
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     if (!myUserId) return;

//     const socket = initSocket(myUserId);

//     // common event names (server may use different names — adapt if needed)
//     socket.on("conversations", (payload: Conversation[]) => {
//       dispatch(setConversations(payload));
//     });
//     socket.on("conversation:list", (payload: Conversation[]) => {
//       dispatch(setConversations(payload));
//     });

//     socket.on("conversation:updated", (conv: Conversation) => {
//       dispatch(upsertConversation(conv));
//     });

//     // new message arrives from server
//     socket.on("message:new", (message: ChatMessage) => {
//       dispatch(receiveMessage({ conversationId: message.conversationId, message }));
//     });

//     // server acknowledges and returns stored message for previously-sent optimistic message
//     socket.on("message:ack", (payload: { tempId?: string; message: ChatMessage }) => {
//       if (payload.tempId && payload.message) {
//         dispatch(
//           replaceLocalMessage({
//             conversationId: payload.message.conversationId,
//             tempId: payload.tempId,
//             newMessage: payload.message,
//           }),
//         );
//       } else if (payload.message) {
//         // fallback: just insert message
//         dispatch(receiveMessage({ conversationId: payload.message.conversationId, message: payload.message }));
//       }
//     });

//     // cleanup on unmount or user change
//     return () => {
//       socket.off("conversations");
//       socket.off("conversation:list");
//       socket.off("conversation:updated");
//       socket.off("message:new");
//       socket.off("message:ack");
//       // optionally disconnect (if you want socket per-page)
//       disconnectSocket();
//     };
//   }, [myUserId, dispatch]);
// }
