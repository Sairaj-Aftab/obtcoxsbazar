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
    totalCount: null,
    message: null,
    error: null,
    loader: false,
  },
  reducers: {
    setDriverInfoMessageEmpty: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDriverInfo.rejected, (state, action) => {
        // state.error = action.error.message;
      })
      .addCase(getDriverInfo.pending, (state) => {
        state.loader = true;
      })
      .addCase(getDriverInfo.fulfilled, (state, action) => {
        state.loader = false;
        state.driverInfo = action.payload.driverInfo;
      })
      .addCase(createDriverInfo.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(createDriverInfo.pending, (state) => {
        state.loader = true;
      })
      .addCase(createDriverInfo.fulfilled, (state, action) => {
        state.loader = false;
        state.driverInfo = state.driverInfo ?? [];
        state.driverInfo.push(action.payload.driverInfo);
        state.message = action.payload.message;
      })
      .addCase(updateDriverInfo.rejected, (state, action) => {
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
