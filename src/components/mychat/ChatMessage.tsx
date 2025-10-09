import { useState, useEffect, useCallback, useRef } from "react";
import io from "socket.io-client";
import { AlertCircle, Paperclip, Image, Send, Smile, Search } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

// Types
interface Contact { id: number; name: string; avatar?: string; isOnline?: boolean; lastMessage?: string; }
interface Message { id: number; senderId: number; content: string; timestamp: string; type: "text" | "image" | "file"; isOwn: boolean; status?: "sending" | "sent" | "failed"; fileName?: string; fileSize?: number; }

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => { const handler = setTimeout(() => setDebouncedValue(value), delay); return () => clearTimeout(handler); }, [value, delay]);
  return debouncedValue;
};

// Avatar component
const Avatar: React.FC<{ src?: string; name: string; size?: "sm" | "md" | "lg"; isOnline?: boolean; }> = ({ src, name, size = "md", isOnline }) => {
  const sizeClasses = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" };
  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase();
  return (
    <div className="relative">
      <div className={`${sizeClasses[size]} flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white`}>
        {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : getInitials(name)}
      </div>
      {isOnline && <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>}
    </div>
  );
};

// ContactItem
const ContactItem: React.FC<{ contact: Contact; isActive: boolean; onClick: () => void; }> = ({ contact, isActive, onClick }) => (
  <div className={`mx-1 flex cursor-pointer items-center space-x-4 rounded-xl p-4 transition-all duration-200 ${isActive ? "bg-blue-50 shadow-sm" : "hover:bg-gray-50"}`} onClick={onClick}>
    <Avatar name={contact.name} src={contact.avatar} isOnline={contact.isOnline} size="md" />
    <div className="min-w-0 flex-1">
      <p className={`truncate text-sm font-semibold ${isActive ? "text-blue-900" : "text-gray-900"}`}>{contact.name}</p>
      <p className="mt-0.5 truncate text-xs text-gray-500">{contact.lastMessage}</p>
    </div>
  </div>
);

// MessageBubble
const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const getStatusIcon = () => {
    switch (message.status) { case "sending": return <Send className="h-3 w-3 animate-spin text-gray-400" />; case "failed": return <AlertCircle className="h-3 w-3 text-red-400" />; default: return null; }
  };
  return (
    <div className={`flex ${message.isOwn ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`rounded-2xl px-4 py-2 ${message.isOwn ? "bg-blue-600 text-white" : "bg-white border text-gray-900"}`}>
        {message.content}
        <div className="mt-1 text-xs text-right">{message.timestamp}</div>
        {message.isOwn && getStatusIcon()}
      </div>
    </div>
  );
};

// MessageInput
const MessageInput: React.FC<{ onSendMessage: (msg: string, type?: "text" | "image" | "file", file?: File) => void; isLoading?: boolean; }> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState(""); const [showEmoji, setShowEmoji] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null); const imageRef = useRef<HTMLInputElement>(null); const emojiRef = useRef<HTMLDivElement>(null);

  const handleSend = useCallback(() => { if (message.trim() && !isLoading) { onSendMessage(message, "text"); setMessage(""); } }, [message, isLoading, onSendMessage]);
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>, type: "file" | "image") => { const file = e.target.files?.[0]; if (file) { onSendMessage(file.name, type, file); e.target.value = ""; } }, [onSendMessage]);
  const handleEmojiClick = useCallback((emojiObj: any) => { setMessage(prev => prev + emojiObj.emoji); setShowEmoji(false); }, []);
  const toggleEmoji = useCallback(() => setShowEmoji(prev => !prev), []);
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }, [handleSend]);

  useEffect(() => {
    const handler = (event: MouseEvent) => { if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) setShowEmoji(false); };
    if (showEmoji) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showEmoji]);

  return (
    <div className="border-t border-gray-100 p-4 relative">
      {showEmoji && <div ref={emojiRef} className="absolute bottom-16 left-4 z-50"><EmojiPicker onEmojiClick={handleEmojiClick} width={300} height={400} /></div>}
      <div className="flex items-center space-x-2">
        <input type="file" ref={fileRef} hidden onChange={e => handleFileUpload(e, "file")} />
        <input type="file" accept="image/*" ref={imageRef} hidden onChange={e => handleFileUpload(e, "image")} />
        <button onClick={toggleEmoji}><Smile className="h-5 w-5 text-gray-400" /></button>
        <button onClick={() => fileRef.current?.click()}><Paperclip className="h-5 w-5 text-gray-400" /></button>
        <button onClick={() => imageRef.current?.click()}><Image className="h-5 w-5 text-gray-400" /></button>
        <input value={message} onChange={e => setMessage(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type a message..." className="flex-1 rounded-xl border px-4 py-2 text-sm focus:outline-none" disabled={isLoading} />
        <button onClick={handleSend} disabled={!message.trim() || isLoading} className="bg-blue-600 p-2 rounded-xl text-white"><Send className="h-5 w-5" /></button>
      </div>
    </div>
  );
};

// Main ChatMessage component
const ChatMessage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState(""); const debouncedSearch = useDebounce(search, 300);
  const [socket, setSocket] = useState<any>(null); const [isLoading, setIsLoading] = useState(false);

  // Fetch contacts
  useEffect(() => {
    fetch("/api/contacts").then(r => r.json()).then(data => { console.log("✅ Contacts:", data); setContacts(data); if (!selectedId && data[0]) setSelectedId(data[0].id); }).catch(console.error);
  }, []);

  // Fetch messages for selected contact
  useEffect(() => {
    if (!selectedId) return;
    fetch(`/api/messages?contactId=${selectedId}`).then(r => r.json()).then(data => { console.log("💬 Messages:", data); setMessages(data); }).catch(console.error);
  }, [selectedId]);

  // Setup socket
  useEffect(() => {
  const socketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_ENDPOINT || "https://api.mafetefacile.com";
  const forcePolling = String(import.meta.env.VITE_FORCE_POLLING || "false").toLowerCase() === "true";
  const transports = forcePolling ? ["polling"] : ["polling", "websocket"];
  const s = io(socketUrl, { transports });
    setSocket(s);
    s.on("connect", () => console.log("⚡ Socket connected"));
    s.on("newMessage", (msg: Message) => {
      console.log("📩 New message via socket:", msg);
      if (msg.senderId === selectedId) setMessages((prev) => [...prev, msg]);
    });

    // proper cleanup: disconnect socket when dependencies change/unmount
    return () => {
      try {
        s.disconnect();
      } catch (e) {
        console.warn("Socket disconnect failed:", e);
      }
    };
  }, [selectedId]);

  const handleSendMessage = async (content: string, type: "text" | "image" | "file" = "text", file?: File) => {
    if (!selectedId) return;
    setIsLoading(true);
    const newMsg: Message = { id: Date.now(), senderId: 0, content: file ? URL.createObjectURL(file) : content, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), type, isOwn: true, status: "sending", fileName: file?.name, fileSize: file?.size };
    setMessages(prev => [...prev, newMsg]);

    try {
      const res = await fetch("/api/messages", { method: "POST", body: JSON.stringify({ ...newMsg, contactId: selectedId }), headers: { "Content-Type": "application/json" } });
      const saved = await res.json();
      console.log("🚀 Message saved:", saved);
      setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...saved, isOwn: true } : m));
      socket?.emit("sendMessage", saved);
    } catch (err) {
      console.error("❌ Send error:", err);
      setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: "failed" } : m));
    } finally { setIsLoading(false); }
  };

  const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(debouncedSearch.toLowerCase()));

  return (
    <div className="flex h-[calc(100vh_-_130px)] bg-white">
      {/* Sidebar */}
      <div className="flex w-80 flex-col border-r border-gray-100 bg-white">
        <div className="border-b border-gray-100 p-4 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input className="w-full rounded-xl border-0 bg-gray-50 py-2 pl-10 pr-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map(c => <ContactItem key={c.id} contact={c} isActive={c.id === selectedId} onClick={() => setSelectedId(c.id)} />)}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-1 flex-col bg-gray-50">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map(m => <MessageBubble key={m.id} message={m} />)}
        </div>
        <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatMessage;
