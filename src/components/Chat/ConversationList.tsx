// src/components/Chat/ConversationList.tsx
import { setSelectedConversation } from "@/redux/features/chatmessage/chatSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
import type { Conversation } from "@/redux/types/chat.types";
import { useSocket } from "@/services/Usesocket";

interface Props {
  conversations: Conversation[];
  loading?: boolean;
}

export default function ConversationList({ conversations, loading }: Props) {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((s) => s.chat.selectedConversationId);

  const handleClick = (id: string) => {
    dispatch(setSelectedConversation(id));
    try {
      const socket = useSocket(id);
      socket?.current?.emit("conversation:join", { conversationId: id });
    } catch (e) {
      // socket not ready or not connected
    }
  };

  return (
    <div className="w-80 border-r border-[#BDBDBE] bg-white">
      <div className="border-b border-[#BDBDBE] p-4">
        <h3 className="font-semibold">Conversations</h3>
      </div>
      <div className="h-[calc(100vh-120px)] overflow-y-auto">
        {loading ? (
          <div className="p-4 text-sm text-gray-500">Loading...</div>
        ) : (
          conversations.map((c) => {
            const partner = c.provider?.id === c.userId ? c.user : c.provider;
            return (
              <div
                key={c.id}
                onClick={() => handleClick(c.id)}
                className={`cursor-pointer p-4 hover:bg-gray-50 ${selected === c.id ? "bg-blue-50" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {partner?.name ?? "Unknown"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {partner?.address ?? partner?.email ?? ""}
                    </div>
                  </div>
                  {c.unreadCount ? (
                    <div className="ml-3 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                      {c.unreadCount}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// // src/components/Chat/ConversationList.tsx

// import { setSelectedConversation } from "@/redux/features/chatmessage/chatSlice";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
// import type { Conversation } from "@/redux/types/chat.types";

// interface Props {
//   conversations: Conversation[];
//   loading?: boolean;
// }

// export default function ConversationList({ conversations, loading }: Props) {
//   const dispatch = useAppDispatch();
//   const selected = useAppSelector((s) => s.chat.selectedConversationId);

//   return (
//     <div className="w-80 border-r border-[#BDBDBE] bg-white">
//       <div className="border-b border-[#BDBDBE] p-4">
//         <h3 className="font-semibold">Conversations</h3>
//       </div>
//       <div className="h-[calc(100vh-120px)] overflow-y-auto">
//         {loading ? (
//           <div className="p-4 text-sm text-gray-500">Loading...</div>
//         ) : (
//           conversations.map((c) => {
//             const partner = c.provider?.id === c.userId ? c.user : c.provider;
//             return (
//               <div
//                 key={c.id}
//                 onClick={() => dispatch(setSelectedConversation(c.id))}
//                 className={`cursor-pointer p-4 hover:bg-gray-50 ${selected === c.id ? "bg-blue-50" : ""}`}
//               >
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <div className="font-medium">
//                       {partner?.name ?? "Unknown"}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       {partner?.address ?? partner?.email ?? ""}
//                     </div>
//                   </div>
//                   {c.unreadCount ? (
//                     <div className="ml-3 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
//                       {c.unreadCount}
//                     </div>
//                   ) : null}
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// }
