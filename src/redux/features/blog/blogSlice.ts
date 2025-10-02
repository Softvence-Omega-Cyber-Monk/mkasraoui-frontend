
// src/redux/features/blog/blogSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Blog } from "@/redux/types/blog.type";

interface BlogState {
  selectedBlog: Blog | null;
}

const initialState: BlogState = {
  selectedBlog: null,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setSelectedBlog(state, action: PayloadAction<Blog | null>) {
      state.selectedBlog = action.payload;
    },
    clearSelectedBlog(state) {
      state.selectedBlog = null;
    },
  },
});

export const { setSelectedBlog, clearSelectedBlog } = blogSlice.actions;
export default blogSlice.reducer;

