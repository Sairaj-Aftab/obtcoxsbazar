import { createSlice } from "@reduxjs/toolkit";
import {
  createDriverInfo,
  deleteDriverInfo,
  getAllDriverInfo,
  getDriverInfo,
  updateDriverInfo,
} from "./driverInfoApiSlice";

const driverInfoSlice = createSlice({
  name: "driverInfo",
  initialState: {
    driverInfo: null,
    totalCount: null,
    userDriverInfo: null,
    error: null,
    message: null,
    success: false,
    loader: false,
  },
  reducers: {
    setDriverInfoMessageEmpty: (state, action) => {
      state.error = null;
      state.message = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllDriverInfo.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(getAllDriverInfo.rejected, (state, action) => {
        //   state.error = action.error.message;
        state.loader = false;
      })
      .addCase(getAllDriverInfo.fulfilled, (state, action) => {
        state.driverInfo = action.payload.driverInfo;
        state.totalCount = action.payload.totalCount;
        state.success = true;
        state.loader = false;
      })
      .addCase(getDriverInfo.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(getDriverInfo.rejected, (state, action) => {
        //   state.error = action.error.message;
        state.loader = false;
      })
      .addCase(getDriverInfo.fulfilled, (state, action) => {
        state.userDriverInfo = action.payload.driverInfo;
        state.success = true;
        state.loader = false;
      })
      .addCase(createDriverInfo.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(createDriverInfo.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(createDriverInfo.fulfilled, (state, action) => {
        state.success = true;
        state.loader = false;
        state.message = action.payload.message;

        state.driverInfo = state.driverInfo ?? [];
        state.driverInfo.push(action.payload.driverInfo);
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
      })
      .addCase(deleteDriverInfo.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(deleteDriverInfo.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(deleteDriverInfo.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.driverInfo = state.driverInfo.filter(
          (item) => item.id !== action.payload.driverInfo.id
        );

        state.loader = false;
      });
  },
});

export const driverInfoData = (state) => state.driverInfo;

// Actions
export const { setDriverInfoMessageEmpty } = driverInfoSlice.actions;

// exports
export default driverInfoSlice.reducer;
