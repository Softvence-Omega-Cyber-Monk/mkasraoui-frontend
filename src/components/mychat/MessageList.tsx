import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/redux/types/chat.types";

interface MessageListProps {
  messages: ChatMessage[];
  myUserId: string;

}
export default function MessageList({ messages, myUserId }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-gray-400">
        No messages yet. Start chatting!
      </div>
    );
  }
  return (
    <div className="flex flex-1 flex-col p-4 space-y-2 overflow-y-auto bg-gray-50">
      {messages.map((msg) => {
        const isMine = String(msg.senderId) === String(myUserId);

        return (
          <div
            key={msg.id}
            className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] break-words rounded-2xl px-4 py-2 shadow-sm ${
                isMine
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
              }`}
            >
              {/* Render image if fileUrl exists */}
              {msg.fileUrl ? (
                <img
                  src={msg.fileUrl}
                  alt="uploaded"
                  className="max-w-full max-h-60 rounded-lg mb-1 object-contain"
                />
              ) : (
                <p className="whitespace-pre-wrap text-[15px] leading-snug">
                  {msg.content}
                </p>
              )}

              <div className="flex justify-end mt-1 text-[11px] text-gray-300">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {msg.id?.startsWith("temp-") && (
                  <span className="ml-2 italic text-gray-200">Sending...</span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}
 
