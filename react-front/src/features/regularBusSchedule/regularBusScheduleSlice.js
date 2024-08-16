import { createSlice } from "@reduxjs/toolkit";
import { getAllRgSchedules } from "./regularBusScheduleApiSlice";
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
      state.loader = false;
    },
  },
  extraReducers: (builder) => {
    builder
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
      });
  },
});

// Export Selector
export const rgSchedulesData = (state) => state.rgSchedules;

// Actions
export const { setRgScheduleMessageEmpty } = regularSchedulesSlice.actions;

// exports
export default regularSchedulesSlice.reducer;
