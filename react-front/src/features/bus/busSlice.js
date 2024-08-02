import { createSlice } from "@reduxjs/toolkit";
import { getAllBusServices, getBusInfoData } from "./busApiSlice";
const busSlice = createSlice({
  name: "bus",
  initialState: {
    bus: null,
    busInfo: null,
    message: null,
    error: null,
    loader: false,
  },
  reducers: {
    setMessageEmpty: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllBusServices.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getAllBusServices.pending, (state) => {
        state.loader = true;
      })
      .addCase(getAllBusServices.fulfilled, (state, action) => {
        state.loader = false;
        state.bus = action.payload.paribahanUsers;
      })
      .addCase(getBusInfoData.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getBusInfoData.pending, (state) => {
        state.loader = true;
      })
      .addCase(getBusInfoData.fulfilled, (state, action) => {
        state.loader = false;
        state.busInfo = action.payload.paribahanUser;
      });
  },
});

// Export Selector
export const busData = (state) => state.bus;

// Actions
export const { setMessageEmpty } = busSlice.actions;

// exports
export default busSlice.reducer;
