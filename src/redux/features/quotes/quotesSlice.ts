// src/redux/features/quotes/quotesSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { QuoteResponse } from "@/redux/types/quotes.type";
import { quotesApi } from "./quotesApi";

interface QuotesState {
  quotes: QuoteResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: QuotesState = {
  quotes: [],
  loading: false,
  error: null,
};

const quotesSlice = createSlice({
  name: "quotes",
  initialState,
  reducers: {
    addQuote(state, action: PayloadAction<QuoteResponse>) {
      state.quotes.push(action.payload);
    },
    removeQuote(state, action: PayloadAction<string>) {
      state.quotes = state.quotes.filter((q) => q.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      quotesApi.endpoints.createQuote.matchFulfilled,
      (state, action: PayloadAction<{ data: QuoteResponse }>) => {
        state.quotes.push(action.payload.data);
        state.loading = false;
        state.error = null;
      },
    );
  },
});

export const { addQuote, removeQuote } = quotesSlice.actions;
export default quotesSlice.reducer;

