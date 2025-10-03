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
