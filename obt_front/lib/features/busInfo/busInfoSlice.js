import { createSlice } from "@reduxjs/toolkit";
import { createBusInfo, getBusInfo, updateBusInfo } from "./busInfoApiSlice";
const busInfoSlice = createSlice({
  name: "busInfo",
  initialState: {
    busInfo: null,
    totalCount: null,
    message: null,
    error: null,
    loader: false,
  },
  reducers: {
    setBusInfoMessageEmpty: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBusInfo.rejected, (state, action) => {
        // state.error = action.error.message;
      })
      .addCase(getBusInfo.pending, (state) => {
        state.loader = true;
      })
      .addCase(getBusInfo.fulfilled, (state, action) => {
        state.loader = false;
        state.busInfo = action.payload.busInfo;
      })
      .addCase(createBusInfo.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(createBusInfo.pending, (state) => {
        state.loader = true;
      })
      .addCase(createBusInfo.fulfilled, (state, action) => {
        state.loader = false;
        state.busInfo = state.busInfo ?? [];
        state.busInfo.push(action.payload.busInfo);
        state.message = action.payload.message;
      })
      .addCase(updateBusInfo.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateBusInfo.pending, (state) => {
        state.loader = true;
      })
      .addCase(updateBusInfo.fulfilled, (state, action) => {
        state.loader = false;
        const infoIndex = state.busInfo.findIndex(
          (info) => info.id === action.payload.busInfo.id
        );
        if (infoIndex !== -1) {
          state.busInfo[infoIndex] = action.payload.busInfo;
        }
        state.message = action.payload.message;
      });
  },
});

// Export Selector
export const busInfoData = (state) => state.busInfo;

// Actions
export const { setBusInfoMessageEmpty } = busInfoSlice.actions;

// exports
export default busInfoSlice.reducer;
