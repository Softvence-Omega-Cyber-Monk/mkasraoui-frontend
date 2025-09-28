// src/redux/features/newsLetter/newsLetterSlice.ts
import { createSlice, type PayloadAction,  } from "@reduxjs/toolkit";
import type { Newsletter, PromotionalMailPayload } from "@/redux/types/newsLetter";

interface NewsLetterState {
  selectedNewsletter: Newsletter | null;
  promotionalMail: PromotionalMailPayload | null;
  isModalOpen: boolean;
}

const initialState: NewsLetterState = {
  selectedNewsletter: null,
  promotionalMail: null,
  isModalOpen: false,
};

const newsLetterSlice = createSlice({
  name: "newsLetter",
  initialState,
  reducers: {
    setSelectedNewsletter: (state, action: PayloadAction<Newsletter | null>) => {
      state.selectedNewsletter = action.payload;
    },
    setPromotionalMail: (state, action: PayloadAction<PromotionalMailPayload | null>) => {
      state.promotionalMail = action.payload;
    },
    setIsModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload;
    },
    resetNewsletterState: () => initialState,
  },
});

export const {
  setSelectedNewsletter,
  setPromotionalMail,
  setIsModalOpen,
  resetNewsletterState,
} = newsLetterSlice.actions;

export default newsLetterSlice.reducer;
