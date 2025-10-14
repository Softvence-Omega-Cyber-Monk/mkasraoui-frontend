
// src/redux/features/chatmessage/chatSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ChatMessage, Conversation } from "@/redux/types/chat.types";

interface ChatState {
  selectedConversationId: string | null;
  messagesByConversation: Record<string, ChatMessage[]>;
  conversations: Conversation[];
}

const initialState: ChatState = {
  selectedConversationId: null,
  messagesByConversation: {},
  conversations: [],
};

const dedupeAndSort = (arr: ChatMessage[]) =>
  Array.from(new Map(arr.map((m) => [m.id, m])).values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedConversation(state, action: PayloadAction<string | null>) {
      state.selectedConversationId = action.payload;
    },

    setConversations(state, action: PayloadAction<Conversation[]>) {
      state.conversations = action.payload;
    },

    upsertConversation(state, action: PayloadAction<Conversation>) {
      const idx = state.conversations.findIndex((c) => c.id === action.payload.id);
      if (idx >= 0) state.conversations[idx] = action.payload;
      else state.conversations.unshift(action.payload);
    },

    setConversationMessages(
      state,
      action: PayloadAction<{ conversationId: string; messages: ChatMessage[] }>,
    ) {
      state.messagesByConversation[action.payload.conversationId] = dedupeAndSort(
        action.payload.messages,
      );
    },

    appendLocalMessage(
      state,
      action: PayloadAction<{ conversationId: string; message: ChatMessage }>,
    ) {
      const arr = state.messagesByConversation[action.payload.conversationId] ?? [];
      arr.push(action.payload.message);
      state.messagesByConversation[action.payload.conversationId] = dedupeAndSort(arr);
    },

    receiveMessage(
      state,
      action: PayloadAction<{ conversationId: string; message: ChatMessage }>,
    ) {
      const arr = state.messagesByConversation[action.payload.conversationId] ?? [];
      arr.push(action.payload.message);
      state.messagesByConversation[action.payload.conversationId] = dedupeAndSort(arr);

      // bump unread count on conversation if needed
      const c = state.conversations.find((x) => x.id === action.payload.conversationId);
      if (c) c.unreadCount = (c.unreadCount ?? 0) + 1;
    },

    replaceLocalMessage(
      state,
      action: PayloadAction<{
        conversationId: string;
        tempId: string;
        newMessage: ChatMessage;
      }>,
    ) {
      const arr = state.messagesByConversation[action.payload.conversationId] ?? [];
      const newArr = arr.map((m) => (m.id === action.payload.tempId ? action.payload.newMessage : m));
      state.messagesByConversation[action.payload.conversationId] = dedupeAndSort(newArr);
      console.log(newArr,"replaceLocalMessage")
    },

    markConversationRead(state, action: PayloadAction<{ conversationId: string }>) {
      const c = state.conversations.find((x) => x.id === action.payload.conversationId);
      if (c) c.unreadCount = 0;
    },

    clearConversationMessages(state, action: PayloadAction<{ conversationId: string }>) {
      delete state.messagesByConversation[action.payload.conversationId];
    },
  },
});

export const {
  setSelectedConversation,
  setConversations,
  upsertConversation,
  setConversationMessages,
  appendLocalMessage,
  receiveMessage,
  replaceLocalMessage,
  markConversationRead,
  clearConversationMessages,
} = chatSlice.actions;

export default chatSlice.reducer;

