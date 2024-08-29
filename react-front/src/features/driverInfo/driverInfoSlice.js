import { createSlice } from "@reduxjs/toolkit";
import {
  createDriverInfo,
  getDriverInfo,
  updateDriverInfo,
} from "./driverInfoApiSlice";
const driverInfoSlice = createSlice({
  name: "driverInfo",
  initialState: {
    driverInfo: null,
    totalCount: 0,
    searchCount: 0,
    message: null,
    error: null,
    loader: false,
  },
  reducers: {
    setDriverInfoMessageEmpty: (state) => {
      state.message = null;
      state.error = null;
      state.loader = false;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getDriverInfo.fulfilled, (state, action) => {
        state.loader = false;
        state.driverInfo = action.payload.driverInfo;
        state.totalCount = action.payload.count;
        state.searchCount = action.payload.searchCount;
      })
      .addCase(createDriverInfo.rejected, (state, action) => {
        state.loader = false;
        state.error = action.error.message;
      })
      .addCase(createDriverInfo.pending, (state) => {
        state.loader = true;
      })
      .addCase(createDriverInfo.fulfilled, (state, action) => {
        state.loader = false;
        state.driverInfo = state.driverInfo ?? [];
        state.driverInfo.unshift(action.payload.driverInfo);
        state.totalCount++;
        state.message = action.payload.message;
      })
      .addCase(updateDriverInfo.rejected, (state, action) => {
        state.loader = false;
        state.error = action.error.message;
      })
      .addCase(updateDriverInfo.pending, (state) => {
        state.loader = true;
      })
      .addCase(updateDriverInfo.fulfilled, (state, action) => {
        state.loader = false;
        const infoIndex = state.driverInfo.findIndex(
          (info) => info.id === action.payload.driverInfo.id
        );
        if (infoIndex !== -1) {
          state.driverInfo[infoIndex] = action.payload.driverInfo;
        }
        state.message = action.payload.message;
      });
  },
});

// Export Selector
export const driverInfoData = (state) => state.driverInfo;

// Actions
export const { setDriverInfoMessageEmpty } = driverInfoSlice.actions;

// exports
export default driverInfoSlice.reducer;
