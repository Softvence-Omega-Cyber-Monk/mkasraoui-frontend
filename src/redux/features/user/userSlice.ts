// src/redux/features/user/userSlice.ts

import { createSlice, type PayloadAction,  } from "@reduxjs/toolkit";
import type { User } from "@/redux/types/user.type";

interface UserState {
  selectedUser: User | null;
}

const initialState: UserState = {
  selectedUser: null,
};

const userSlice = createSlice({
  name: "userLocal",
  initialState,
  reducers: {
    setSelectedUser(state, action: PayloadAction<User | null>) {
      state.selectedUser = action.payload;
    },
    clearSelectedUser(state) {
      state.selectedUser = null;
    },
  },
});

export const { setSelectedUser, clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;
