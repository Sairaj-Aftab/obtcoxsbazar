import { createSlice } from "@reduxjs/toolkit";
import {
  createGuideInfo,
  getGuideInfo,
  updateGuideInfo,
} from "./guideInfoApiSlice";
const guideInfoSlice = createSlice({
  name: "guideInfo",
  initialState: {
    guideInfo: [],
    totalCount: 0,
    searchCount: 0,
    message: null,
    error: null,
    loader: false,
  },
  reducers: {
    setGuideInfoMessageEmpty: (state) => {
      state.message = null;
      state.error = null;
      state.loader = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGuideInfo.rejected, (state, action) => {
        // state.error = action.error.message;
        state.loader = false;
      })
      .addCase(getGuideInfo.pending, (state) => {
        state.loader = true;
      })
      .addCase(getGuideInfo.fulfilled, (state, action) => {
        state.loader = false;
        state.guideInfo = action.payload.guideInfo;
        state.totalCount = action.payload.count;
        state.searchCount = action.payload.searchCount;
      })
      .addCase(createGuideInfo.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(createGuideInfo.pending, (state) => {
        state.loader = true;
      })
      .addCase(createGuideInfo.fulfilled, (state, action) => {
        state.loader = false;
        state.guideInfo.push(action.payload.guideInfo);
        state.totalCount++;
        state.message = action.payload.message;
      })
      .addCase(updateGuideInfo.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
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
