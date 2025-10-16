
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Activity } from "../../types/activity.type";

interface ActivityState {
  selectedActivity: Activity | null;
}

const initialState: ActivityState = {
  selectedActivity: null,
};

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    setSelectedActivity(state, action: PayloadAction<Activity | null>) {
      state.selectedActivity = action.payload;
    },
    clearSelectedActivity(state) {
      state.selectedActivity = null;
    },
  },
});

export const { setSelectedActivity, clearSelectedActivity } =
  activitySlice.actions;

export default activitySlice.reducer;




















// import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

 


// import type { Activity } from "../../types/activity.type";

// interface ActivityState {
//   selectedActivity: Activity | null;
// }

// const initialState: ActivityState = {
//   selectedActivity: null,
// };

// const activitySlice = createSlice({
//   name: "activity",
//   initialState,
//   reducers: {
//     setSelectedActivity(state, action: PayloadAction<Activity | null>) {
//       state.selectedActivity = action.payload;
//     },
//     clearSelectedActivity(state) {
//       state.selectedActivity = null;
//     },
//   },
// });

// export const { setSelectedActivity, clearSelectedActivity } =
//   activitySlice.actions;
// export default activitySlice.reducer;
