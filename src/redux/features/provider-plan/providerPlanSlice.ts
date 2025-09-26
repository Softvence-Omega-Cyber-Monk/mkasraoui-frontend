// src/redux/features/providerPlan/providerPlanSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ProviderPlan {
  id: string;
  name: string;
  features: string[];
  price_id: string;
  price: number;
  is_active: boolean;
  plan_duration: "YEARLY" | "MONTHLY";
  created_at: string;
  updated_at: string;
}

export type ProviderPlanResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: ProviderPlan[];
};

interface ProviderPlanState {
  providerPlans: ProviderPlan[];
}

const initialState: ProviderPlanState = {
  providerPlans: [],
};

const providerPlanSlice = createSlice({
  name: "providerPlan",
  initialState,
  reducers: {
    setProviderPlans: (state, action: PayloadAction<ProviderPlan[]>) => {
      state.providerPlans = action.payload;
    },
  },
});

export const { setProviderPlans } = providerPlanSlice.actions;
export default providerPlanSlice.reducer;
