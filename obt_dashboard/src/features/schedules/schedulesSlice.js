import { createSlice } from "@reduxjs/toolkit";
import { deleteSchedule, getAllSchedules } from "./schedulesApiSlice";
const schedulesSlice = createSlice({
  name: "schedules",
  initialState: {
    schedules: null,
    totalScheduleCount: null,
    message: null,
    error: null,
    loader: false,
  },
  reducers: {
    setMessageEmpty: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllSchedules.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getAllSchedules.pending, (state) => {
        state.loader = true;
      })
      .addCase(getAllSchedules.fulfilled, (state, action) => {
        state.loader = false;
        state.totalScheduleCount = action.payload.count;
        state.schedules = action.payload.schedules;
      })
      .addCase(deleteSchedule.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteSchedule.pending, (state) => {
        state.loader = true;
      })
      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.loader = false;
        state.message = action.payload.message;
        state.schedules = state.schedules.filter(
          (item) => item.id !== action.payload.schedule.id
        );
      });
  },
});

// Export Selector
export const schedulesData = (state) => state.schedules;

// Actions
export const { setMessageEmpty } = schedulesSlice.actions;

// exports
export default schedulesSlice.reducer;
