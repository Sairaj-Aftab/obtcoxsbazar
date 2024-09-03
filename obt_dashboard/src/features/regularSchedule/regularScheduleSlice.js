import { createSlice } from "@reduxjs/toolkit";
import {
  createSchedule,
  deleteSchedule,
  getAllRgSchedules,
  updateSchedule,
} from "./regularScheduleApiSlice";
const regularSchedulesSlice = createSlice({
  name: "regularSchedules",
  initialState: {
    rgSchedules: [],
    totalCount: 0,
    searchCount: 0,
    message: null,
    error: null,
    loader: false,
  },
  reducers: {
    setRgScheduleMessageEmpty: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSchedule.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(createSchedule.pending, (state) => {
        state.loader = true;
      })
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.loader = false;
        state.rgSchedules.unshift(action.payload.busSchedule);
        state.totalCount++;
        state.message = action.payload.message;
      })
      .addCase(updateSchedule.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(updateSchedule.pending, (state) => {
        state.loader = true;
      })
      .addCase(updateSchedule.fulfilled, (state, action) => {
        state.rgSchedules[
          state.rgSchedules.findIndex(
            (data) => data.id == action.payload.busSchedule.id
          )
        ] = action.payload.busSchedule;
        state.message = action.payload.message;
        state.loader = false;
      })
      .addCase(getAllRgSchedules.rejected, (state, action) => {
        state.loader = false;
        state.error = action.error.message;
      })
      .addCase(getAllRgSchedules.pending, (state) => {
        state.loader = true;
      })
      .addCase(getAllRgSchedules.fulfilled, (state, action) => {
        state.loader = false;
        state.totalCount = action.payload.count;
        state.searchCount = action.payload.searchCount;
        state.rgSchedules = action.payload.schedules;
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
        state.rgSchedules = state.rgSchedules.filter(
          (item) => item.id !== action.payload.schedule.id
        );
        state.totalCount--;
      });
  },
});

// Export Selector
export const rgSchedulesData = (state) => state.rgSchedules;

// Actions
export const { setRgScheduleMessageEmpty } = regularSchedulesSlice.actions;

// exports
export default regularSchedulesSlice.reducer;
