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
    authParibahanRgSchedules: [],
    totalCount: 0,
    searchCount: 0,
    totalAuthParCount: 0,
    searchAuthParCount: 0,
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
    getParibahanRgSchedules: (state, action) => {
      state.paribahanRgSchedules = state.rgSchedules.filter(
        (item) => item.paribahanUserId === action.payload
      );
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
        state.totalAuthParCount = action.payload.count;
        state.searchAuthParCount = action.payload.searchCount;
        state.authParibahanRgSchedules = action.payload.schedules;
      });
  },
});

// Export Selector
export const rgSchedulesData = (state) => state.rgSchedules;

// Actions
export const { getParibahanRgSchedules, setRgScheduleMessageEmpty } =
  regularSchedulesSlice.actions;

// exports
export default regularSchedulesSlice.reducer;
