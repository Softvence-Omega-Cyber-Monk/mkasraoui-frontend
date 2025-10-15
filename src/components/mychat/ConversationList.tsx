

"use client";
import { useState, useEffect } from "react";

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

export default function ConversationList({ conversations, selectedId, onSelect }: Props) {
  console.log(conversations,"conversations");
  const [search, setSearch] = useState("");
  const [unreadMap, setUnreadMap] = useState<Record<string, number>>({});

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
    // Clear unread for selected conversation
    setUnreadMap((prev) => ({ ...prev, [id]: 0 }));
  };

  const filteredConversations = conversations
    .filter((c) => (c.otherUserName || c.id).toLowerCase().includes(search.toLowerCase()))
    // Ensure selected conversation is always on top
    .sort((a, b) => (a.id === selectedId ? -1 : b.id === selectedId ? 1 : 0));

  return (
    <div className="w-64 border-r border-[#DBE0E5] flex flex-col">
      {/* Search */}
      <div className="p-2 border-b border-[#DBE0E5]">
        <input
          type="text"
          placeholder="Search conversations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-[#DBE0E5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Conversation List */}
      <div className="overflow-y-auto flex-1">
        {filteredConversations.length === 0 ? (
          <div className="text-gray-400 p-4">No conversations found</div>
        ) : (
          filteredConversations.map((c) => {
            const isUnread = unreadMap[c.id] && unreadMap[c.id] > 0;
            const isSelected = c.id === selectedId;

            return (
              <div
                key={c.id}
                className={`p-3 cursor-pointer hover:bg-gray-100 transition-colors ${
                  isSelected ? "bg-blue-100" : ""
                }`}
                onClick={() => handleSelect(c.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium">{c.otherUserName || c.id}</div>
                  {isUnread && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {unreadMap[c.id]}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 truncate mt-1">{c.lastMessage || ""}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}


