/* eslint-disable @typescript-eslint/no-explicit-any */
import EmojiPicker from "emoji-picker-react";
import {
  AlertCircle,
  Image,
  Loader2,
  MoreHorizontal,
  Paperclip,
  Search,
  Send,
  Smile,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

// Types for TypeScript and API integration
interface Contact {
  id: number;
  name: string;
  avatar?: string;
  lastMessageDate: string;
  isOnline?: boolean;
  lastMessage?: string;
}

interface Message {
  id: number;
  senderId: number;
  content: string;
  timestamp: string;
  type: "text" | "image" | "file";
  isOwn: boolean;
  status?: "sending" | "sent" | "delivered" | "read" | "failed";
  fileName?: string;
  fileSize?: number;
}

// Custom hooks for static functionality
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Mock data with more realistic conversations
const mockContacts: Contact[] = [
  {
    id: 1,
    name: "Sophia Carter",
    avatar: "/api/placeholder/40/40",
    lastMessageDate: "12/12/23",
    isOnline: true,
    lastMessage: "Hi there! I'm planning a birthday party...",
  },
  {
    id: 2,
    name: "Liam Harper",
    avatar: "/api/placeholder/40/40",
    lastMessageDate: "12/11/23",
    isOnline: false,
    lastMessage: "Thanks for your help!",
  },
  {
    id: 3,
    name: "Olivia Bennett",
    avatar: "/api/placeholder/40/40",
    lastMessageDate: "12/10/23",
    isOnline: true,
    lastMessage: "See you tomorrow",
  },
  {
    id: 4,
    name: "Noah Foster",
    avatar: "/api/placeholder/40/40",
    lastMessageDate: "12/09/23",
    isOnline: false,
    lastMessage: "Great idea!",
  },
  {
    id: 5,
    name: "Ava Morgan",
    avatar: "/api/placeholder/40/40",
    lastMessageDate: "12/08/23",
    isOnline: true,
    lastMessage: "Perfect timing",
  },
  {
    id: 6,
    name: "Ethan Hayes",
    avatar: "/api/placeholder/40/40",
    lastMessageDate: "12/07/23",
    isOnline: false,
    lastMessage: "Let me check",
  },
  {
    id: 7,
    name: "Isabella Reed",
    avatar: "/api/placeholder/40/40",
    lastMessageDate: "12/06/23",
    isOnline: true,
    lastMessage: "Sounds good!",
  },
  {
    id: 8,
    name: "Jackson Cole",
    avatar: "/api/placeholder/40/40",
    lastMessageDate: "12/05/23",
    isOnline: false,
    lastMessage: "No problem",
  },
];

const mockMessages: { [key: number]: Message[] } = {
  1: [
    {
      id: 1,
      senderId: 1,
      content:
        "Hi there! I'm planning a birthday party for my daughter on July 20th and I'm looking for a caterer. My budget is around $500. Can you help?",
      timestamp: "2:30 PM",
      type: "text",
      isOwn: false,
      status: "read",
    },
    {
      id: 2,
      senderId: 0,
      content:
        "Hi Sophia, I'd be happy to help! Could you tell me more about the party? How many guests are you expecting?",
      timestamp: "2:35 PM",
      type: "text",
      isOwn: true,
      status: "read",
    },
    {
      id: 3,
      senderId: 1,
      content:
        "We're expecting about 15 kids and 10 adults. It's going to be at our backyard from 3 PM to 6 PM.",
      timestamp: "2:38 PM",
      type: "text",
      isOwn: false,
      status: "read",
    },
    {
      id: 4,
      senderId: 0,
      content:
        "Here's a menu with a variety of options. Let me know what you think!",
      timestamp: "2:42 PM",
      type: "text",
      isOwn: true,
      status: "read",
    },
  ],
  2: [
    {
      id: 10,
      senderId: 2,
      content: "Hey! How's the project going?",
      timestamp: "1:15 PM",
      type: "text",
      isOwn: false,
      status: "read",
    },
    {
      id: 11,
      senderId: 0,
      content: "Going well! Just finished the design phase.",
      timestamp: "1:20 PM",
      type: "text",
      isOwn: true,
      status: "read",
    },
  ],
  3: [
    {
      id: 20,
      senderId: 3,
      content: "Don't forget about tomorrow's meeting!",
      timestamp: "10:30 AM",
      type: "text",
      isOwn: false,
      status: "read",
    },
  ],
};

// Avatar component
const Avatar: React.FC<{
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg";
  isOnline?: boolean;
}> = ({ src, name, size = "md", isOnline }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div className="relative">
      <div
        className={`${sizeClasses[size]} flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white`}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const sibling = e.currentTarget.nextElementSibling as HTMLElement;
              if (sibling) sibling.textContent = getInitials(name);
            }}
          />
        ) : (
          getInitials(name)
        )}
      </div>
      {isOnline && (
        <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
      )}
    </div>
  );
};

// Contact list item
const ContactItem: React.FC<{
  contact: Contact;
  isActive: boolean;
  onClick: () => void;
}> = ({ contact, isActive, onClick }) => (
  <div
    className={`mx-1 flex cursor-pointer items-center space-x-4 rounded-xl p-4 transition-all duration-200 ${
      isActive ? "bg-blue-50 shadow-sm" : "hover:bg-gray-50"
    }`}
    onClick={onClick}
  >
    <Avatar
      name={contact.name}
      src={contact.avatar}
      isOnline={contact.isOnline}
      size="md"
    />
    <div className="min-w-0 flex-1">
      <p
        className={`truncate text-sm font-semibold ${isActive ? "text-blue-900" : "text-gray-900"}`}
      >
        {contact.name}
      </p>
      <p className="mt-0.5 truncate text-xs text-gray-500">
        {contact.lastMessage || contact.lastMessageDate}
      </p>
    </div>
  </div>
);

// Message bubble
const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const getStatusIcon = () => {
    switch (message.status) {
      case "sending":
        return <Loader2 className="h-3 w-3 animate-spin text-gray-400" />;
      case "failed":
        return <AlertCircle className="h-3 w-3 text-red-400" />;
      default:
        return null;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div
      className={`flex ${message.isOwn ? "justify-end" : "justify-start"} mb-6`}
    >
      <div className="flex max-w-md items-end space-x-3 lg:max-w-lg">
        {!message.isOwn && <Avatar name="Contact" size="sm" />}
        <div
          className={`rounded-2xl px-5 py-3 shadow-sm ${
            message.isOwn
              ? "rounded-br-lg bg-blue-600 text-white"
              : "rounded-bl-lg border border-gray-100 bg-white text-gray-900"
          }`}
        >
          {message.type === "image" ? (
            <img
              src={message.content}
              alt="Uploaded"
              className="max-w-xs rounded-lg"
              loading="lazy"
            />
          ) : message.type === "file" ? (
            <div className="flex items-center space-x-2">
              <Paperclip className="h-4 w-4" />
              <div>
                <a
                  href={message.content}
                  className="text-sm text-blue-500 underline hover:text-blue-600"
                  download={message.fileName}
                >
                  {message.fileName || "Download File"}
                </a>
                {message.fileSize && (
                  <p className="text-xs text-gray-500">
                    {formatFileSize(message.fileSize)}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm leading-relaxed">{message.content}</p>
          )}
          <div className="mt-1 flex items-center justify-between">
            <span
              className={`text-xs ${message.isOwn ? "text-blue-100" : "text-gray-500"}`}
            >
              {message.timestamp}
            </span>
            {message.isOwn && getStatusIcon()}
          </div>
        </div>
        {message.isOwn && <Avatar name="You" size="sm" />}
      </div>
    </div>
  );
};

// Chat header
const ChatHeader: React.FC<{ contact: Contact | null }> = ({ contact }) => {
  if (!contact) return null;

  return (
    <div className="flex items-center justify-between border-b border-gray-100 bg-white p-6">
      <div className="flex items-center space-x-4">
        <Avatar
          name={contact.name}
          src={contact.avatar}
          size="lg"
          isOnline={contact.isOnline}
        />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {contact.name}
          </h2>
          <p className="text-sm text-gray-500">
            {contact.isOnline ? "Active now" : "Last seen recently"}
          </p>
        </div>
      </div>
      <button className="rounded-lg p-2 transition-colors hover:bg-gray-50">
        <MoreHorizontal className="h-5 w-5 text-gray-400" />
      </button>
    </div>
  );
};

// Message input
const MessageInput: React.FC<{
  onSendMessage: (
    message: string,
    type?: "text" | "image" | "file",
    file?: File,
  ) => void;
  isLoading?: boolean;
}> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const handleSend = useCallback(() => {
    if (message.trim() && !isLoading) {
      onSendMessage(message, "text");
      setMessage("");
    }
  }, [message, isLoading, onSendMessage]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, type: "file" | "image") => {
      const file = e.target.files?.[0];
      if (file) {
        onSendMessage(file.name, type, file);
        e.target.value = ""; // Reset input
      }
    },
    [onSendMessage],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleEmojiClick = useCallback((emojiObject: any) => {
    setMessage((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  }, []);

  const toggleEmojiPicker = useCallback(() => {
    setShowEmojiPicker((prev) => !prev);
  }, []);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <div className="border-t border-gray-100 bg-white p-6">
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="absolute bottom-20 left-6 z-50">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width={350}
            height={400}
          />
        </div>
      )}

      <div className="flex items-center space-x-3">
        {/* Hidden inputs */}
        <input
          type="file"
          ref={fileInputRef}
          hidden
          onChange={(e) => handleFileUpload(e, "file")}
          accept=".pdf,.doc,.docx,.txt,.xlsx,.xls"
        />
        <input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          hidden
          onChange={(e) => handleFileUpload(e, "image")}
        />

        {/* Action buttons */}
        <div className="flex items-center space-x-1">
          <button
            className="rounded-lg p-2 transition-colors hover:bg-gray-50"
            onClick={toggleEmojiPicker}
            disabled={isLoading}
          >
            <Smile className="h-5 w-5 text-gray-400" />
          </button>
          <button
            className="rounded-lg p-2 transition-colors hover:bg-gray-50"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <Paperclip className="h-5 w-5 text-gray-400" />
          </button>
          <button
            className="rounded-lg p-2 transition-colors hover:bg-gray-50"
            onClick={() => imageInputRef.current?.click()}
            disabled={isLoading}
          >
            <Image className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Input field */}
        <div className="flex flex-1 items-center space-x-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send quick message..."
            className="flex-1 rounded-xl border-0 bg-gray-50 px-5 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className="rounded-xl bg-blue-600 p-3 text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Main component
const ChatMessage: React.FC = () => {
  const [selectedContactId, setSelectedContactId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [messages, setMessages] = useState<{ [key: number]: Message[] }>(
    mockMessages,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Handle search functionality
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      const filtered = mockContacts.filter((contact) =>
        contact.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
      );
      setContacts(filtered);
    } else {
      setContacts(mockContacts);
    }
  }, [debouncedSearchQuery]);

  const selectedContact = contacts.find((c) => c.id === selectedContactId);
  const currentMessages = messages[selectedContactId] || [];

  const handleSendMessage = async (
    content: string,
    type: "text" | "image" | "file" = "text",
    file?: File,
  ) => {
    setIsLoading(true);
    setError(null);

    // Create new message
    const newMessage: Message = {
      id: Date.now(),
      senderId: 0,
      content:
        file && (type === "image" || type === "file")
          ? URL.createObjectURL(file)
          : content,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type,
      isOwn: true,
      status: "sending",
      fileName: file?.name,
      fileSize: file?.size,
    };

    // Add message immediately
    setMessages((prev) => ({
      ...prev,
      [selectedContactId]: [...(prev[selectedContactId] || []), newMessage],
    }));

    // Simulate sending delay
    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [selectedContactId]: prev[selectedContactId].map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "sent" as const } : msg,
        ),
      }));
      setIsLoading(false);

      // Simulate auto-reply for demo (only for Sophia Carter)
      if (selectedContactId === 1) {
        setTimeout(() => {
          const autoReply: Message = {
            id: Date.now() + 1,
            senderId: selectedContactId,
            content: "Thanks for your message! I'll get back to you shortly.",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            type: "text",
            isOwn: false,
            status: "read",
          };

          setMessages((prev) => ({
            ...prev,
            [selectedContactId]: [
              ...(prev[selectedContactId] || []),
              autoReply,
            ],
          }));
        }, 1000);
      }
    }, 1000);
  };

  return (
    <div className="flex h-[calc(100vh_-_130px)] bg-white">
      {/* Sidebar */}
      <div className="flex w-80 flex-col border-r border-gray-100 bg-white">
        <div className="border-b border-gray-100 p-6">
          <div className="relative">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-xl border-0 bg-gray-50 py-3 pr-4 pl-12 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2">
          {contacts.length === 0 ? (
            <div className="mt-8 text-center text-gray-500">
              <p className="text-sm">No contacts found</p>
            </div>
          ) : (
            contacts.map((contact) => (
              <ContactItem
                key={contact.id}
                contact={contact}
                isActive={contact.id === selectedContactId}
                onClick={() => setSelectedContactId(contact.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-1 flex-col bg-gray-50">
        <ChatHeader contact={selectedContact || null} />

        {error && (
          <div className="border-b border-red-100 bg-red-50 px-6 py-2">
            <div className="flex items-center space-x-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {currentMessages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center text-gray-500">
                <p className="mb-2 text-lg">No messages yet</p>
                <p className="text-sm">
                  Send a message to start the conversation
                </p>
              </div>
            </div>
          ) : (
            currentMessages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}
        </div>

        <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatMessage;
