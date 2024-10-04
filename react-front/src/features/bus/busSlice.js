import { createSlice } from "@reduxjs/toolkit";
import { getAllBusServices, getBusInfoData } from "./busApiSlice";
const busSlice = createSlice({
  name: "bus",
  initialState: {
    bus: [],
    busInfo: null,
    totalReviewCount: 0,
    averageRating: 0,
    message: null,
    error: null,
    busLoader: false,
    busInfoLoader: false,
  },
  reducers: {
    setMessageEmpty: (state) => {
      state.message = null;
      state.error = null;
      state.busLoader = false;
      state.busInfoLoader = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllBusServices.rejected, (state, action) => {
        state.error = action.error.message;
        state.busLoader = false;
      })
      .addCase(getAllBusServices.pending, (state) => {
        state.busLoader = true;
      })
      .addCase(getAllBusServices.fulfilled, (state, action) => {
        state.busLoader = false;
        state.bus = action.payload.paribahanUsers;
      })
      .addCase(getBusInfoData.rejected, (state, action) => {
        state.error = action.error.message;
        state.busInfoLoader = false;
      })
      .addCase(getBusInfoData.pending, (state) => {
        state.busInfoLoader = true;
      })
      .addCase(getBusInfoData.fulfilled, (state, action) => {
        state.busInfoLoader = false;
        state.busInfo = action.payload.paribahanUser;
        state.busInfo = {
          ...state.busInfo,
          totalReviewCount: action.payload.totalReviewCount,
          averageRating: action.payload.averageRating,
        };
      });
  },
});

// Export Selector
export const busData = (state) => state.bus;

// Actions
export const { setMessageEmpty } = busSlice.actions;

// exports
export default busSlice.reducer;
