import type { IProviderReview } from "@/redux/types/review.type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ProviderReviewState {
  reviews: IProviderReview[];
}

const initialState: ProviderReviewState = {
  reviews: [],
};

const providerReviewSlice = createSlice({
  name: "providerReview",
  initialState,
  reducers: {
    setReviews: (state, action: PayloadAction<IProviderReview[]>) => {
      state.reviews = action.payload;
    },
    addReview: (state, action: PayloadAction<IProviderReview>) => {
      state.reviews.push(action.payload);
    },
  },
});

export const { setReviews, addReview } = providerReviewSlice.actions;
export default providerReviewSlice.reducer;
