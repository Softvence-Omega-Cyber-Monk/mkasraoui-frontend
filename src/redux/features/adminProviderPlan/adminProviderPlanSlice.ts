import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Plan } from "@/redux/types/adminProviderPlan.type";
import { adminProviderPlanApi } from "./adminProviderPlanApi";

interface PlanState {
  plans: Plan[];
  selectedPlan: Plan | null;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  message: string;
}

const initialState: PlanState = {
  plans: [],
  selectedPlan: null,
  isLoading: false,
  error: null,
  isSuccess: false,
  message: "",
};

const adminProviderPlanSlice = createSlice({
  name: "adminProviderPlan",
  initialState,
  reducers: {
    resetPlanState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.isSuccess = false;
      state.message = "";
      state.selectedPlan = null;
    },
    setSelectedPlan: (state, action: PayloadAction<Plan | null>) => {
      state.selectedPlan = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      adminProviderPlanApi.endpoints.getAdminProviderPlans.matchPending,
      (state) => {
        state.isLoading = true;
      },
    );
    builder.addMatcher(
      adminProviderPlanApi.endpoints.getAdminProviderPlans.matchFulfilled,
      (state, action) => {
        state.isLoading = false;
        state.plans = action.payload.data;
      },
    );
    builder.addMatcher(
      adminProviderPlanApi.endpoints.getAdminProviderPlans.matchRejected,
      (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch plans";
      },
    );
  },
});

export const { resetPlanState, setSelectedPlan } =
  adminProviderPlanSlice.actions;
export default adminProviderPlanSlice.reducer;
