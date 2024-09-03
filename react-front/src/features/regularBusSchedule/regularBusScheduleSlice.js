import { createSlice } from "@reduxjs/toolkit";
import {
  getAllRgSchedules,
  getSchedulesByParibahanId,
} from "./regularBusScheduleApiSlice";
const regularSchedulesSlice = createSlice({
  name: "regularSchedules",
  initialState: {
    rgSchedules: [],
    paribahanRgSchedules: [],
    totalCount: 0,
    searchCount: 0,
    totalParCount: 0,
    searchParCount: 0,
    message: null,
    error: null,
    loader: false,
    parLoader: false,
  },
  reducers: {
    setRgScheduleMessageEmpty: (state) => {
      state.message = null;
      state.error = null;
      state.loader = false;
      state.parLoader = false;
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
      })
      .addCase(getSchedulesByParibahanId.rejected, (state, action) => {
        state.parLoader = false;
        state.error = action.error.message;
      })
      .addCase(getSchedulesByParibahanId.pending, (state) => {
        state.parLoader = true;
      })
      .addCase(getSchedulesByParibahanId.fulfilled, (state, action) => {
        state.parLoader = false;
        state.totalParCount = action.payload.count;
        state.searchParCount = action.payload.searchCount;
        state.paribahanRgSchedules = action.payload.schedules;
      });
  },
});

// Export Selector
export const rgSchedulesData = (state) => state.rgSchedules;

// Actions
export const { setRgScheduleMessageEmpty } = regularSchedulesSlice.actions;

// exports
export default regularSchedulesSlice.reducer;
