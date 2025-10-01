// src/redux/features/chat/chatSlice.ts
import type { ChatMessage } from "@/redux/types/chat.types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  selectedConversationId: string | null;
  // local optimistic messages cache (optional)
  messagesByConversation: Record<string, ChatMessage[]>;
}

const initialState: ChatState = {
  selectedConversationId: null,
  messagesByConversation: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedConversation(state, action: PayloadAction<string | null>) {
      state.selectedConversationId = action.payload;
    },
    setConversationMessages(
      state,
      action: PayloadAction<{
        conversationId: string;
        messages: ChatMessage[];
      }>,
    ) {
      state.messagesByConversation[action.payload.conversationId] =
        action.payload.messages;
    },
    appendLocalMessage(
      state,
      action: PayloadAction<{ conversationId: string; message: ChatMessage }>,
    ) {
      const arr =
        state.messagesByConversation[action.payload.conversationId] || [];
      arr.push(action.payload.message);
      state.messagesByConversation[action.payload.conversationId] = arr;
    },
    clearConversationMessages(
      state,
      action: PayloadAction<{ conversationId: string }>,
    ) {
      delete state.messagesByConversation[action.payload.conversationId];
    },
  },
});

export const {
  setSelectedConversation,
  setConversationMessages,
  appendLocalMessage,
  clearConversationMessages,
} = chatSlice.actions;
export default chatSlice.reducer;
