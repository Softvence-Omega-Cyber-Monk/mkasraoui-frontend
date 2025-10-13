import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

type Message = { user: string; text: string; self?: boolean };

export function useSocket(token?: string) {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // if (!token) return;

 const SOCKET_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || "https://api.mafetefacile.com/socket.io";
const token = "YOUR_AUTH_TOKEN"; // replace with your actual token

// Force polling for now to avoid WebSocket handshake issues
const transports = ["polling"];  ["websocket", "polling"]  

const socket = io(SOCKET_ENDPOINT, {
  transports,
  auth: { token },
  forceNew: true,
  timeout: 20000,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  withCredentials: true,
});

    socketRef.current = socket;

    // Event listeners
    socket.on("connect", () => {
      setConnected(true);
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message || err);
    });

    socket.io?.on?.("error", (e: any) => {
      console.error("⚠️ Engine/manager error:", e);
    });

    socket.on("disconnect", (reason) => {
      setConnected(false);
      console.warn("⚠️ Socket disconnected:", reason);
    });

    socket.on("message", (msg: Message) => {
      console.log("📩 Received message:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      console.log("🧹 Socket disconnected cleanly");
    };
  }, [token]);

  const sendMessage = useCallback((text: string, user: string) => {
    if (!socketRef.current) return;
    const msg: Message = { user, text };
    console.log("📤 Sending message:", msg);
    socketRef.current.emit("message", msg);
    setMessages((prev) => [...prev, { ...msg, self: true }]);
  }, []);

  return { socket: socketRef.current, connected, messages, sendMessage };
}


// import { useEffect, useRef, useState, useCallback } from "react";
// import { io, Socket } from "socket.io-client";

// export function useSocket(token?: string) {
//   const socketRef = useRef<Socket | null>(null);
//   const [messages, setMessages] = useState<{ user: string; text: string; self?: boolean }[]>([]);
//   const [connected, setConnected] = useState(false);

//   useEffect(() => {
//     if (!token) return;

//     const forcePolling = String(import.meta.env.VITE_FORCE_POLLING || "false").toLowerCase() === "true";
//     const transports = forcePolling ? ["polling"] : ["polling", "websocket"];

//     const socket = io(import.meta.env.VITE_SOCAKET_URL  , {
//       transports,
//       auth: { token },
//        forceNew: true,
//       timeout: 20000,
//       reconnection: true,
//       reconnectionAttempts: 10,
//       reconnectionDelay: 1000,
//       withCredentials: true,
//     });

//     socketRef.current = socket;
 

// socket.current.on("connect", () => console.log("✅ Connected:", socket.current?.id));
// socket.current.on("connect_error", (err) => console.error("❌ Connect error:", err));
// socket.current.on("disconnect", (reason) => console.warn("⚠️ Disconnected:", reason));


//     socket.on("connect", () => {
//       setConnected(true);
//       console.log("✅ Socket connected:", socket.id);
//     });

//     socket.on("connect_error", (err) => {
//       console.error("❌ Socket connection error:", err.message || err);
//     });

//     socket.io?.on?.("error", (e: any) => {
//       console.error("⚠️ Engine/manager error:", e);
//     });

//     socket.on("disconnect", (reason) => {
//       setConnected(false);
//       console.warn("⚠️ Socket disconnected:", reason);
//     });

//     socket.on("message", (msg: { user: string; text: string }) => {
//       console.log("📩 Received message:", msg); // ✅ Log incoming message
//       setMessages((prev) => [...prev, msg]);
//     });

//     return () => {
//       socket.disconnect();
//       socketRef.current = null;
//       console.log("🧹 Socket disconnected cleanly");
//     };
//   }, [token]);

//   const sendMessage = useCallback((text: string, user: string) => {
//     if (!socketRef.current) return;
//     const msg = { user, text };
//     console.log("📤 Sending message:", msg); // ✅ Log outgoing message
//     socketRef.current.emit("message", msg);
//     setMessages((prev) => [...prev, { ...msg, self: true }]);
//   }, []);

//   return { socket: socketRef.current, connected, messages, sendMessage };
// }
















// // // src/services/useSocket.ts
// // import { useEffect, useRef } from "react";
// // import { io, Socket } from "socket.io-client";

// // export function useSocket(token?: string) {
// //   const socketRef = useRef<Socket | null>(null);

// //   useEffect(() => {
// //     if (!token) return;

// //     const forcePolling = String(import.meta.env.VITE_FORCE_POLLING || "false").toLowerCase() === "true";
// //     const transports = forcePolling ? ["polling"] : ["polling", "websocket"];

// //     const socket = io(import.meta.env.VITE_API_ENDPOINT || "https://api.mafetefacile.com", {
// //       transports, // fallback for proxies/CDNs
// //       auth: { token },
// //       timeout: 20000,
// //       reconnection: true,
// //       reconnectionAttempts: 10,
// //       reconnectionDelay: 1000,
// //       withCredentials: true,
// //     });

// //     socketRef.current = socket;

// //     socket.on("connect", () => {
// //       console.log("✅ Socket connected:", socket.id);
// //     });

// //     socket.on("connect_error", (err) => {
// //       console.error("❌ Socket connection error:", err.message || err);
// //     });

// //     socket.io?.on?.("error", (e: any) => {
// //       console.error("⚠️ Engine/manager error:", e);
// //     });

// //     socket.on("disconnect", (reason) => {
// //       console.warn("⚠️ Socket disconnected:", reason);
// //     });

// //     return () => {
// //       socket.disconnect();
// //       socketRef.current = null;
// //       console.log("🧹 Socket disconnected cleanly");
// //     };
// //   }, [token]);

// //   return socketRef;
// // }


 