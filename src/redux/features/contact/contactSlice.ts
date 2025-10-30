import type { TContact } from "@/redux/types/contact.type";
import { createSlice, type PayloadAction,  } from "@reduxjs/toolkit";

interface ContactState {
  contactData: TContact | null;
}

const initialState: ContactState = {
  contactData: null,
};

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    setContactData: (state, action: PayloadAction<TContact>) => {
      state.contactData = action.payload;
    },
    clearContactData: (state) => {
      state.contactData = null;
    },
  },
});

export const { setContactData, clearContactData } = contactSlice.actions;
export default contactSlice.reducer;
