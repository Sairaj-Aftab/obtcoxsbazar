import { createSlice } from "@reduxjs/toolkit";
import {
  deleteSchedule,
  getAllSchedules,
  getTodaysSchedule,
} from "./schedulesApiSlice";
const schedulesSlice = createSlice({
  name: "schedules",
  initialState: {
    schedules: [],
    todaySchedule: [],
    totalScheduleCount: 0,
    searchCount: 0,
    todayTotalCount: 0,
    todaySearchCount: 0,
    message: null,
    error: null,
    loader: false,
    todayLoader: false,
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
        state.loader = false;
      })
      .addCase(getAllSchedules.pending, (state) => {
        state.loader = true;
      })
      .addCase(getAllSchedules.fulfilled, (state, action) => {
        state.loader = false;
        state.totalScheduleCount = action.payload.count;
        state.searchCount = action.payload.searchCount;
        state.schedules = action.payload.schedules;
      })
      .addCase(getTodaysSchedule.rejected, (state, action) => {
        // state.error = action.error.message;
        state.todayLoader = false;
      })
      .addCase(getTodaysSchedule.pending, (state) => {
        state.todayLoader = true;
      })
      .addCase(getTodaysSchedule.fulfilled, (state, action) => {
        state.todayLoader = false;
        state.todayTotalCount = action.payload.count;
        state.todaySearchCount = action.payload.searchCount;
        state.todaySchedule = action.payload.schedules;
      })
      .addCase(deleteSchedule.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
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
        state.totalScheduleCount--;
      });
  },
});

// Export Selector
export const schedulesData = (state) => state.schedules;

// Actions
export const { setMessageEmpty } = schedulesSlice.actions;

// exports
export default schedulesSlice.reducer;
