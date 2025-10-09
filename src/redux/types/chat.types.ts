// src/redux/features/chat/chat.types.ts

export type MessageType = "text" | "image" | "file";

export interface ChatUser {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  profile_image?: string | null;
  address?: string | null;
}

export interface ChatMessage {
  id: string;
  conversationId: string; // ✅ Add this
  senderId: string;
  content: string;
  createdAt: string; // keep required
  updatedAt?: string;
  status?: "sending" | "sent" | "failed";
  type?: MessageType; // optional
  fileName?: string | null;
  fileSize?: number | null;
}


export interface Conversation {
  id: string;
  userId: string;
  providerId: string;
  createdAt?: string;
  updatedAt?: string;
  lastMessagePreview?: string;
  user?: ChatUser | null;
  provider?: ChatUser | null;
  messages?: ChatMessage[]; // can be undefined, but better default []
  unreadCount?: number;
}


// // src/redux/features/chat/chat.types.ts
// export type MessageType = "text" | "image" | "file";

// export interface ChatUser {
//   id: string;
//   name?: string | null;
//   email?: string | null;
//   phone?: string | null;
//   profile_image?: string | null;
//   address?: string | null;
// }

// export interface ChatMessage {
//   id: string;
//   senderId: string;
//   content: string;
//   createdAt?: string;
//   type?: MessageType;
//   fileName?: string | null;
//   fileSize?: number | null;
// }

// export interface Conversation {
//   id: string;
//   userId: string;
//   providerId: string;
//   createdAt?: string;
//   updatedAt?: string;
//   user?: ChatUser | null;
//   provider?: ChatUser | null;
//   messages?: ChatMessage[] | null;
//   unreadCount?: number;
// }

// /**
//  * NOTE:
//  * Your API responses (per swagger) were wrapped like:
//  * { statusCode, success, message, data: { meta, data: [...] } }
//  * The chatApi below extracts the `.data` portion so query results look like:
//  * useGetConversationsQuery() => result.data = { meta, data: Conversation[] }
//  * useGetMessagesQuery({conversationId}) => result.data = { meta, data: ChatMessage[] }
//  */
