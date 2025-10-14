

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAppDispatch } from "@/redux/hooks/redux-hook";
import { receiveMessage, replaceLocalMessage } from "@/redux/features/chatmessage/chatSlice";
import type { ChatMessage } from "@/redux/types/chat.types";
import toast from "react-hot-toast";

interface UseChatSocketProps {
  userId?: string;
  token?: string;
  isProvider?: boolean;
  onNewMessage?: (msg: ChatMessage) => void; // 👈 added callback
}

export function useChatSocket({ userId, token, isProvider, onNewMessage }: UseChatSocketProps) {
  const dispatch = useAppDispatch();
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!userId || !token) {
      console.warn("⚠️ Missing userId or token. Socket not initialized.");
      return;
    }
    const endpoint = import.meta.env.VITE_API_ENDPOINT;
    if (!endpoint) {
      console.error("❌ VITE_API_ENDPOINT is not defined.");
      return;
    }

    console.log("🔌 Connecting to socket at:", endpoint);
    const socket = io(endpoint, {
      transports: ["websocket", "polling"],
      auth: { userId, token, isProvider },
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      withCredentials: true,
    });

    socketRef.current = socket;

    // 🔹 Connection events
    socket.on("connect", () => {
      setConnected(true);
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err?.message || err);
    });

    socket.on("disconnect", (reason) => {
      setConnected(false);
      console.warn("⚠️ Socket disconnected:", reason);
    });

    // 🔹 Receive new messages
    socket.on("newMessage", (msg: ChatMessage) => {
      if (msg.senderId === userId) return; // Ignore self messages

      console.log("📩 New message received:", msg);
      dispatch(receiveMessage({ conversationId: msg.conversationId, message: msg }));

      // 👇 Notify parent for unread badge update
      if (onNewMessage) onNewMessage(msg);

      toast(`💬 New message: ${msg.content}`, { position: "bottom-right" });
    });

    // 🔹 Message acknowledgment
    socket.on("message:ack", ({ tempId, message }: { tempId?: string; message: ChatMessage }) => {
      if (!tempId) return;
      console.log("📬 Message ack received:", message);
      dispatch(
        replaceLocalMessage({
          conversationId: message.conversationId,
          tempId,
          newMessage: message,
        })
      );
    });

    return () => {
      console.log("🧹 Cleaning up socket...");
      socket.off("newMessage");
      socket.off("message:ack");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, token, isProvider, dispatch, onNewMessage]);

  // 🔹 Send message via socket
  const sendMessage = useCallback((msg: ChatMessage) => {
    if (!socketRef.current) {
      console.warn("⚠️ Cannot send message: socket not connected");
      return;
    }
    console.log("📤 Sending message via socket:", msg);
    socketRef.current.emit("sendMessage", msg);
  }, []);

  return { socket: socketRef.current, connected, sendMessage };
}


