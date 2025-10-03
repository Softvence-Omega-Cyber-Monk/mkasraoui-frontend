import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";


export function useSocket(userId: string) {
  const socketRef = useRef<Socket | null>(null);
  useEffect(() => {
    const socket = io("https://api.mafetefacile.com", {
      auth: { userId },
    });
    socketRef.current = socket;
    socket.on("connect", () => {
      console.log("Connected Socket io:", socket.id);
    });
  }, [userId]);


  socketRef.current?.on("connect", () =>
    console.debug("[socket] connected", socketRef.current?.id),
  );
  socketRef.current?.on("connect_error", (err) =>
    console.error("[socket] connect_error", err),
  );
  socketRef.current?.on("disconnect", (reason) =>
    console.debug("[socket] disconnected", reason),
  );
  return socketRef;
}
