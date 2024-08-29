import { createSlice } from "@reduxjs/toolkit";
import {
  createGuideInfo,
  deleteGuideInfo,
  getAllGuideInfo,
  getGuideInfo,
  updateGuideInfo,
} from "./guideInfoApiSlice";

const guideInfoSlice = createSlice({
  name: "guideInfo",
  initialState: {
    guideInfo: [],
    userGuideInfo: [],
    totalCount: 0,
    searchCount: 0,
    error: null,
    message: null,
    success: false,
    loader: false,
  },
  reducers: {
    setGuideInfoMessageEmpty: (state) => {
      state.error = null;
      state.message = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllGuideInfo.pending, (state) => {
        state.loader = true;
      })
      .addCase(getAllGuideInfo.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(getAllGuideInfo.fulfilled, (state, action) => {
        state.guideInfo = action.payload.guideInfo;
        state.totalCount = action.payload.totalCount;
        state.searchCount = action.payload.searchCount;
        state.success = true;
        state.loader = false;
      })
      .addCase(getGuideInfo.pending, (state) => {
        state.loader = true;
      })
      .addCase(getGuideInfo.rejected, (state) => {
        // state.error = action.error.message;
        state.loader = false;
      })
      .addCase(getGuideInfo.fulfilled, (state, action) => {
        state.userGuideInfo = action.payload.guideInfo;
        state.success = true;
        state.loader = false;
      })
      .addCase(createGuideInfo.pending, (state) => {
        state.loader = true;
      })
      .addCase(createGuideInfo.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(createGuideInfo.fulfilled, (state, action) => {
        state.success = true;
        state.loader = false;
        state.message = action.payload.message;
        state.guideInfo.unshift(action.payload.guideInfo);
        state.totalCount++;
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
      })
      .addCase(deleteGuideInfo.pending, (state) => {
        state.loader = true;
      })
      .addCase(deleteGuideInfo.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(deleteGuideInfo.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.guideInfo = state.guideInfo.filter(
          (item) => item.id !== action.payload.guideInfo.id
        );
        state.totalCount--;

        state.loader = false;
      });
  },
});

export const guideInfoData = (state) => state.guideInfo;

// Actions
export const { setGuideInfoMessageEmpty } = guideInfoSlice.actions;

// exports
export default guideInfoSlice.reducer;
