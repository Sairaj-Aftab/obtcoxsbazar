import { createSlice } from "@reduxjs/toolkit";
import {
  createBusInfo,
  deleteBusInfo,
  getAllBusInfo,
  getBusInfo,
  updateBusInfo,
} from "./busInfoApiSlice";

const busInfoSlice = createSlice({
  name: "notice",
  initialState: {
    busInfo: [],
    userBusInfo: [],
    totalCount: 0,
    searchCount: 0,
    error: null,
    message: null,
    success: false,
    loader: false,
  },
  reducers: {
    setBusInfoMessageEmpty: (state, action) => {
      state.error = null;
      state.message = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllBusInfo.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(getAllBusInfo.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(getAllBusInfo.fulfilled, (state, action) => {
        state.busInfo = action.payload.busInfo;
        state.totalCount = action.payload.totalCount;
        state.searchCount = action.payload.searchCount;
        state.success = true;
        state.loader = false;
      })
      .addCase(getBusInfo.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(getBusInfo.rejected, (state, action) => {
        //   state.error = action.error.message;
        state.loader = false;
      })
      .addCase(getBusInfo.fulfilled, (state, action) => {
        state.userBusInfo = action.payload.busInfo;
        state.success = true;
        state.loader = false;
      })
      .addCase(createBusInfo.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(createBusInfo.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(createBusInfo.fulfilled, (state, action) => {
        state.success = true;
        state.loader = false;
        state.message = action.payload.message;
        state.busInfo.push(action.payload.busInfo);
        state.totalCount++;
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
      })
      .addCase(deleteBusInfo.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(deleteBusInfo.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(deleteBusInfo.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.busInfo = state.busInfo.filter(
          (item) => item.id !== action.payload.busInfo.id
        );

        state.loader = false;
        state.totalCount--;
      });
  },
});

export const busInfoData = (state) => state.busInfo;

// Actions
export const { setBusInfoMessageEmpty } = busInfoSlice.actions;

// exports
export default busInfoSlice.reducer;
