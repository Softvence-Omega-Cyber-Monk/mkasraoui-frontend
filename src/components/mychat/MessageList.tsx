 

// src/components/chat/MessageList.tsx

import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/redux/types/chat.types";

interface MessageListProps {
  messages: ChatMessage[];
  myUserId: string;
}

export default function MessageList({ messages, myUserId }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
console.log(messages,myUserId,"from massagelist")
  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
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
            className={`flex w-full ${
              isMine ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] break-words rounded-2xl px-4 py-2 shadow-sm ${
                isMine
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
              }`}
            >
              <p className="whitespace-pre-wrap text-[15px] leading-snug">
                {msg.content}
              </p>

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






// // src/components/chat/MessageList.tsx
// import { useEffect, useRef } from "react";
// import type { ChatMessage } from "@/redux/types/chat.types";

// interface Props {
//   messages: ChatMessage[];
//   myUserId: string; // The ID of the currently logged-in user
// }

// export default function MessageList({ messages, myUserId }: Props) {
//   const bottomRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     // Scroll to the bottom whenever messages array changes
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   if (messages.length === 0) {
//     return (
//       <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 text-gray-400">
//         Start the conversation!
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 overflow-y-auto p-6 bg-gray-50 min-h-0">
//       <div className="space-y-3">
//         {messages.map((m) => {
//           // Determine if the message belongs to the current user
//           const isOwn = String(m.senderId) === String(myUserId);
          
//           return (
//             <div 
//               key={m.id} 
//               className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
//             >
//               <div
//                 className={`rounded-2xl px-4 py-2 max-w-[70%] shadow-sm ${
//                   isOwn
//                     ? "bg-blue-600 text-white rounded-br-none" // Right alignment, primary color
//                     : "bg-white border rounded-bl-none" // Left alignment, white/border color
//                 }`}
//               >
//                 {/* Check for file/image here if you have fileUrl in ChatMessage type */}
//                 {m.content}
                
//                 <div className="text-xs mt-1 text-right opacity-70">
//                   {m.createdAt
//                     ? new Date(m.createdAt).toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })
//                     : ""}
//                   {/* You could add a status icon (sent/read/etc) here */}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//       <div ref={bottomRef} />
//     </div>
//   );
// }















// // src/components/chat/MessageList.tsx (No Changes Needed)

// import { useEffect, useRef } from "react";
// import type { ChatMessage } from "@/redux/types/chat.types";

// interface Props {
//   messages: ChatMessage[];
//   myUserId: string; // The ID of the currently logged-in user
// }

// export default function MessageList({ messages, myUserId }: Props) {
//   const bottomRef = useRef<HTMLDivElement | null>(null);
// console.log(messages,myUserId, "from massagelist")
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // ... (omitting message length check for brevity) ...

//   return (
//     <div className="flex-1 overflow-y-auto p-6 bg-gray-50 min-h-0">
//       <div className="space-y-3">
//         {messages.map((m) => {
//           // The critical check: is the message sender ID equal to the logged-in user ID?
//           const isOwn = String(m.senderId) === String(myUserId);
          
//           return (
//             <div 
//               key={m.id} 
//               className={`flex ${isOwn ? "justify-end" : "justify-start"}`} // ALIGNMENT HERE
//             >
//               <div
//                 className={`rounded-2xl px-4 py-2 max-w-[70%] shadow-sm ${
//                   isOwn
//                     ? "bg-blue-600 text-white rounded-br-none" // Right alignment color
//                     : "bg-white border rounded-bl-none" // Left alignment color
//                 }`}
//               >
//                 {m.content}
                
//                 <div className="text-xs mt-1 text-right opacity-70">
//                   {m.createdAt
//                     ? new Date(m.createdAt).toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })
//                     : ""}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//       <div ref={bottomRef} />
//     </div>
//   );
// }