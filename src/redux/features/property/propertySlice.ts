// src/redux/features/property/propertySlice.ts
import type { Provider } from "@/redux/types/property.type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface PropertyState {
  selectedProvider: Provider | null;
}

const initialState: PropertyState = {
  selectedProvider: null,
};

const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    setSelectedProvider: (state, action: PayloadAction<Provider | null>) => {
      state.selectedProvider = action.payload;
    },
  },
});

export const { setSelectedProvider } = propertySlice.actions;
export default propertySlice.reducer;
