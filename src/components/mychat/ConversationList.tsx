



"use client";
import { useState, useEffect } from "react";
import {
  MdKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";

interface Conversation {
  id: string;
  otherUserName?: string;
  lastMessage?: string;
  unreadCount?: number;
}

interface Props {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export default function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: Props) {
  const [search, setSearch] = useState("");
  const [unreadMap, setUnreadMap] = useState<Record<string, number>>({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768); // md breakpoint
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Reset collapse when resizing to desktop
  useEffect(() => {
    if (!isMobile) setIsCollapsed(false);
  }, [isMobile]);

  // Track unread counts
  useEffect(() => {
    const map: Record<string, number> = {};
    conversations.forEach((c) => {
      if (c.unreadCount && c.unreadCount > 0) {
        map[c.id] = c.unreadCount;
      }
    });
    setUnreadMap(map);
  }, [conversations]);

  const handleSelect = (id: string) => {
    onSelect(id);
    setUnreadMap((prev) => ({ ...prev, [id]: 0 }));
    if (isMobile) setIsCollapsed(true); // auto-collapse on mobile after selecting
  };

  const filteredConversations = conversations
    .filter((c) =>
      (c.otherUserName || c.id)
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => (a.id === selectedId ? -1 : b.id === selectedId ? 1 : 0));

  return (
    <div
      className={`relative border-r border-[#DBE0E5] flex flex-col transition-all duration-300 ${
        isMobile && isCollapsed ? "w-0 " : "w-64  "
      }`}
    >
      {/* Collapse Toggle Button (only visible on mobile) */}
      {isMobile && (
        <div className="absolute top-3 left-98 z-10">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="bg-white border border-gray-300 rounded-full shadow-md p-1 hover:bg-gray-100 transition"
          >
            {isCollapsed ? (
              <MdOutlineKeyboardDoubleArrowRight className="text-xl" />
            ) : (
              <MdKeyboardDoubleArrowLeft className="text-xl" />
            )}
          </button>
        </div>
      )}

      {/* Search Bar */}
      {(!isMobile || !isCollapsed) && (
        <div className="p-2 border-b border-[#DBE0E5]">
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border border-[#DBE0E5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      )}

      {/* Conversation List */}
      <div className={`overflow-y-auto flex-1 ${isCollapsed ? "p-2" : ""}`}>
        {filteredConversations.length === 0 ? (
          !isCollapsed && (
            <div className="text-gray-400 p-4">No conversations found</div>
          )
        ) : (
          filteredConversations.map((c) => {
            const isUnread = unreadMap[c.id] && unreadMap[c.id] > 0;
            const isSelected = c.id === selectedId;

            return (
              <div
                key={c.id}
                className={`p-3 cursor-pointer rounded-md transition-colors ${
                  isSelected ? "bg-blue-100" : "hover:bg-gray-100"
                } ${isCollapsed ? "flex justify-center" : ""}`}
                onClick={() => handleSelect(c.id)}
              >
                {!isCollapsed ? (
                  <div className="flex justify-between items-center w-full">
                    <div className="font-medium truncate">
                      {c.otherUserName || c.id}
                    </div>
                    {isUnread && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {unreadMap[c.id]}
                      </span>
                    )}
                  </div>
                ) : (
                  // Collapsed mode shows just unread bubble if exists
                  isUnread && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {unreadMap[c.id]}
                    </span>
                  )
                )}

                {!isCollapsed && (
                  <div className="text-sm text-gray-500 truncate mt-1">
                    {c.lastMessage || ""}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}












// "use client";
// import { useState, useEffect } from "react";
// import { MdKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

// interface Conversation {
//   id: string;
//   otherUserName?: string;
//   lastMessage?: string;
//   unreadCount?: number;
// }

// interface Props {
//   conversations: Conversation[];
//   selectedId?: string;
//   onSelect: (id: string) => void;
// }

// export default function ConversationList({ conversations, selectedId, onSelect }: Props) {
//   const [search, setSearch] = useState("");
//   const [unreadMap, setUnreadMap] = useState<Record<string, number>>({});
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   // Track unread counts
//   useEffect(() => {
//     const map: Record<string, number> = {};
//     conversations.forEach((c) => {
//       if (c.unreadCount && c.unreadCount > 0) {
//         map[c.id] = c.unreadCount;
//       }
//     });
//     setUnreadMap(map);
//   }, [conversations]);

//   const handleSelect = (id: string) => {
//     onSelect(id);
//     setUnreadMap((prev) => ({ ...prev, [id]: 0 }));
//   };

//   const filteredConversations = conversations
//     .filter((c) => (c.otherUserName || c.id).toLowerCase().includes(search.toLowerCase()))
//     .sort((a, b) => (a.id === selectedId ? -1 : b.id === selectedId ? 1 : 0));

//   return (
//     <div
//       className={`relative border-r border-[#DBE0E5] flex flex-col transition-all duration-300 ${
//         isCollapsed ? "w-16" : "w-64"
//       }`}
//     >
//       {/* Collapse Toggle Button */}
//       <div className="absolute top-3 md:hidden -right-4 z-10">
//         <button
//           onClick={() => setIsCollapsed(!isCollapsed)}
//           className="bg-white border border-gray-300 rounded-full shadow-md p-1 hover:bg-gray-100 transition"
//         >
//           {isCollapsed ? (
//             <MdOutlineKeyboardDoubleArrowRight className="text-xl" />
//           ) : (
//             <MdKeyboardDoubleArrowLeft className="text-xl" />
//           )}
//         </button>
//       </div>

//       {/* Search Bar */}
//       {!isCollapsed && (
//         <div className="p-2 border-b border-[#DBE0E5]">
//           <input
//             type="text"
//             placeholder="Search conversations..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full p-2 border border-[#DBE0E5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//         </div>
//       )}

//       {/* Conversation List */}
//       <div className={`overflow-y-auto flex-1 ${isCollapsed ? "p-2" : ""}`}>
//         {filteredConversations.length === 0 ? (
//           !isCollapsed && <div className="text-gray-400 p-4">No conversations found</div>
//         ) : (
//           filteredConversations.map((c) => {
//             const isUnread = unreadMap[c.id] && unreadMap[c.id] > 0;
//             const isSelected = c.id === selectedId;

//             return (
//               <div
//                 key={c.id}
//                 className={`p-3 cursor-pointer rounded-md transition-colors ${
//                   isSelected
//                     ? "bg-blue-100"
//                     : "hover:bg-gray-100"
//                 } ${isCollapsed ? "flex justify-center" : ""}`}
//                 onClick={() => handleSelect(c.id)}
//               >
//                 {!isCollapsed ? (
//                   <div className="flex justify-between items-center w-full">
//                     <div className="font-medium truncate">{c.otherUserName || c.id}</div>
//                     {isUnread && (
//                       <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
//                         {unreadMap[c.id]}
//                       </span>
//                     )}
//                   </div>
//                 ) : (
//                   // Collapsed mode shows just unread bubble if exists
//                   isUnread && (
//                     <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
//                       {unreadMap[c.id]}
//                     </span>
//                   )
//                 )}

//                 {!isCollapsed && (
//                   <div className="text-sm text-gray-500 truncate mt-1">
//                     {c.lastMessage || ""}
//                   </div>
//                 )}
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// }
















// "use client";
// import { useState, useEffect } from "react";

// interface Conversation {
//   id: string;
//   otherUserName?: string;
//   lastMessage?: string;
//   unreadCount?: number;
// }

// interface Props {
//   conversations: Conversation[];
//   selectedId?: string;
//   onSelect: (id: string) => void;
// }

// export default function ConversationList({ conversations, selectedId, onSelect }: Props) {
//   console.log(conversations,"conversations");
//   const [search, setSearch] = useState("");
//   const [unreadMap, setUnreadMap] = useState<Record<string, number>>({});

//   // Track unread counts
//   useEffect(() => {
//     const map: Record<string, number> = {};
//     conversations.forEach((c) => {
//       if (c.unreadCount && c.unreadCount > 0) {
//         map[c.id] = c.unreadCount;
//       }
//     });
//     setUnreadMap(map);
//   }, [conversations]);

//   const handleSelect = (id: string) => {
//     onSelect(id);
//     // Clear unread for selected conversation
//     setUnreadMap((prev) => ({ ...prev, [id]: 0 }));
//   };

//   const filteredConversations = conversations
//     .filter((c) => (c.otherUserName || c.id).toLowerCase().includes(search.toLowerCase()))
//     // Ensure selected conversation is always on top
//     .sort((a, b) => (a.id === selectedId ? -1 : b.id === selectedId ? 1 : 0));

//   return (
//     <div className="w-64 border-r border-[#DBE0E5] flex flex-col">
//       {/* Search */}
//       <div className="p-2 border-b border-[#DBE0E5]">
//         <input
//           type="text"
//           placeholder="Search conversations..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full p-2 border border-[#DBE0E5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//       </div>

//       {/* Conversation List */}
//       <div className="overflow-y-auto flex-1">
//         {filteredConversations.length === 0 ? (
//           <div className="text-gray-400 p-4">No conversations found</div>
//         ) : (
//           filteredConversations.map((c) => {
//             const isUnread = unreadMap[c.id] && unreadMap[c.id] > 0;
//             const isSelected = c.id === selectedId;

//             return (
//               <div
//                 key={c.id}
//                 className={`p-3 cursor-pointer hover:bg-gray-100 transition-colors ${
//                   isSelected ? "bg-blue-100" : ""
//                 }`}
//                 onClick={() => handleSelect(c.id)}
//               >
//                 <div className="flex justify-between items-center">
//                   <div className="font-medium">{c.otherUserName || c.id}</div>
//                   {isUnread && (
//                     <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
//                       {unreadMap[c.id]}
//                     </span>
//                   )}
//                 </div>
//                 <div className="text-sm text-gray-500 truncate mt-1">{c.lastMessage || ""}</div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// }


