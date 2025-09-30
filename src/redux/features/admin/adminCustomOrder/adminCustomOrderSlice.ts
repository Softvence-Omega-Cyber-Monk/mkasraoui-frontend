import type { CustomOrder } from "@/redux/types/adminCustom.type";
import { createSlice, type PayloadAction,  } from "@reduxjs/toolkit";

// Slice state type
interface AdminCustomOrderState {
  selectedOrder: CustomOrder| null;
  filterStatus: string | null; // for filtering orders by status (optional)
  isModalOpen: boolean; // for edit/view modal (optional)
}

const initialState: AdminCustomOrderState = {
  selectedOrder: null,
  filterStatus: null,
  isModalOpen: false,
};

const adminCustomOrderSlice = createSlice({
  name: "adminCustomOrders",
  initialState,
  reducers: {
    setSelectedOrder: (state, action: PayloadAction<CustomOrder | null>) => {
      state.selectedOrder = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<string | null>) => {
      state.filterStatus = action.payload;
    },
    openModal: (state) => {
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.selectedOrder = null; // reset on close
    },
  },
});

export const {
  setSelectedOrder,
  setFilterStatus,
  openModal,
  closeModal,
} = adminCustomOrderSlice.actions;

export default adminCustomOrderSlice.reducer;
