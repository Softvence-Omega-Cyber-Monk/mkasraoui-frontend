// src/redux/features/admin/adminOrder/adminOrderSlice.ts
import type { OrderResponse } from "@/redux/types/adminOder.type";
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

// Define state type
interface AdminOrderState {
  orders: OrderResponse[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminOrderState = {
  orders: [],
  isLoading: false,
  error: null,
};

// Async thunk to fetch orders
export const fetchOrders = createAsyncThunk(
  "adminOrders/fetchOrders",
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    thunkAPI,
  ) => {
    try {
      const response = await axios.get(`/orders?page=${page}&limit=${limit}`);
      return response.data.data.orders as OrderResponse[];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders",
      );
    }
  },
);

// Async thunk to update order status
export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async ({ id, status }: { id: string; status: string }, thunkAPI) => {
    try {
      const response = await axios.patch(`/orders/${id}/status`, { status });
      return response.data as OrderResponse;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update order status",
      );
    }
  },
);

export const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch orders
    builder.addCase(fetchOrders.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      fetchOrders.fulfilled,
      (state, action: PayloadAction<OrderResponse[]>) => {
        state.isLoading = false;
        state.orders = action.payload;
      },
    );
    builder.addCase(
      fetchOrders.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      },
    );

    // Update order status
    builder.addCase(updateOrderStatus.pending, (state) => {
      state.error = null;
    });
    builder.addCase(
      updateOrderStatus.fulfilled,
      (state, action: PayloadAction<OrderResponse>) => {
        const index = state.orders.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) state.orders[index] = action.payload;
      },
    );
    builder.addCase(
      updateOrderStatus.rejected,
      (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      },
    );
  },
});

export default adminOrderSlice.reducer;
