import { createSlice } from "@reduxjs/toolkit";
import {
  createGuideInfo,
  getGuideInfo,
  updateGuideInfo,
} from "./guideInfoApiSlice";
const guideInfoSlice = createSlice({
  name: "guideInfo",
  initialState: {
    guideInfo: null,
    totalCount: null,
    message: null,
    error: null,
    loader: false,
  },
  reducers: {
    setGuideInfoMessageEmpty: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGuideInfo.rejected, (state, action) => {
        // state.error = action.error.message;
      })
      .addCase(getGuideInfo.pending, (state) => {
        state.loader = true;
      })
      .addCase(getGuideInfo.fulfilled, (state, action) => {
        state.loader = false;
        state.guideInfo = action.payload.guideInfo;
      })
      .addCase(createGuideInfo.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(createGuideInfo.pending, (state) => {
        state.loader = true;
      })
      .addCase(createGuideInfo.fulfilled, (state, action) => {
        state.loader = false;
        state.guideInfo = state.guideInfo ?? [];
        state.guideInfo.push(action.payload.guideInfo);
        state.message = action.payload.message;
      })
      .addCase(updateGuideInfo.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateGuideInfo.pending, (state) => {
        state.loader = true;
      })
      .addCase(updateGuideInfo.fulfilled, (state, action) => {
        state.loader = false;
        const infoIndex = state.guideInfo.findIndex(
          (info) => info.id === action.payload.guideInfo.id
        );
        if (infoIndex !== -1) {
          state.guideInfo[infoIndex] = action.payload.guideInfo;
        }
        state.message = action.payload.message;
      });
  },
});

// Export Selector
export const guideInfoData = (state) => state.guideInfo;

// Actions
export const { setGuideInfoMessageEmpty } = guideInfoSlice.actions;

// exports
export default guideInfoSlice.reducer;
