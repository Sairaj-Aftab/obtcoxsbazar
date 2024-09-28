import { createSlice } from "@reduxjs/toolkit"; // These API functions need to be created
import { getVisitorStats, updateVisitorCount } from "./visitorCountApiSlice";

const visitorCountSlice = createSlice({
  name: "visitorCount",
  initialState: {
    visitorStats: {
      daily: 0,
      monthly: 0,
      yearly: 0,
      total: 0,
    },
    message: null,
    error: null,
    loader: false,
  },
  reducers: {
    setMessageEmpty: (state) => {
      state.message = null;
      state.error = null;
      state.loader = false;
    },
  },
  extraReducers: (builder) => {
    // Handle getVisitorStats actions
    builder
      .addCase(getVisitorStats.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(getVisitorStats.pending, (state) => {
        state.loader = true;
      })
      .addCase(getVisitorStats.fulfilled, (state, action) => {
        state.visitorStats = action.payload;
        state.loader = false;
      })
      .addCase(updateVisitorCount.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(updateVisitorCount.pending, (state) => {
        state.loader = true;
      })
      .addCase(updateVisitorCount.fulfilled, (state) => {
        state.loader = false;
      });
  },
});

// Export Selector
export const visitorCountData = (state) => state.visitorCount;

// Actions
export const { setMessageEmpty } = visitorCountSlice.actions;

// Exports
export default visitorCountSlice.reducer;
