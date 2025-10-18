import type { IDiyBoxActivityReview } from "@/redux/types/IDiyBoxActivityReview.type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface DiyBoxActivityReviewState {
  reviews: IDiyBoxActivityReview[];
}

const initialState: DiyBoxActivityReviewState = {
  reviews: [],
};

const diyBoxActivityReviewSlice = createSlice({
  name: "diyBoxActivityReview",
  initialState,
  reducers: {
    setDiyBoxActivityReviews: (
      state,
      action: PayloadAction<IDiyBoxActivityReview[]>
    ) => {
      state.reviews = action.payload;
    },
    addDiyBoxActivityReview: (
      state,
      action: PayloadAction<IDiyBoxActivityReview>
    ) => {
      state.reviews.push(action.payload);
    },
    removeDiyBoxActivityReview: (state, action: PayloadAction<string>) => {
      state.reviews = state.reviews.filter(
        (review) => review.id !== action.payload
      );
    },
  },
});

export const {
  setDiyBoxActivityReviews,
  addDiyBoxActivityReview,
  removeDiyBoxActivityReview,
} = diyBoxActivityReviewSlice.actions;

export default diyBoxActivityReviewSlice.reducer;
