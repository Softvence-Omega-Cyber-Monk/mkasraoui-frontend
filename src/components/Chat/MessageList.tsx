import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/redux/types/chat.types";


interface Props {
  messages: ChatMessage[];
  myUserId: string;
}


export default function MessageList({ messages, myUserId }: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);


  return (
    <div className="flex-1 overflow-y-auto p-6" ref={scrollRef}>
      {messages.length === 0 ? (
        <div className="text-center text-gray-400">
          No messages yet. Send the first message.
        </div>
      ) : (
        messages.map((m) => {
          // ✅ Compare IDs properly
          const isOwn = String(m.senderId) === String(myUserId);


          return (
            <div
              key={m.id}
              className={`mb-4 flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-xl p-3 ${
                  isOwn ? "bg-blue-600 text-white" : "border bg-white"
                }`}
              >
                {m.type === "image" ? (
                  <img
                    src={m.content}
                    alt="img"
                    className="max-w-full rounded"
                  />
                ) : m.type === "file" ? (
                  <a
                    href={m.content}
                    download={m.fileName}
                    className="text-sm underline"
                  >
                    {m.fileName ?? "Download file"}
                  </a>
                ) : (
                  <div className="whitespace-pre-wrap">{m.content}</div>
                )}
                <div className="mt-1 text-right text-xs opacity-70">
                  {m.createdAt
                    ? new Date(m.createdAt).toLocaleTimeString()
                    : ""}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
