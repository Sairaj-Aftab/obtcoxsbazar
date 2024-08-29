import { createSlice } from "@reduxjs/toolkit";
import {
  createAuthNotice,
  deleteAuthNotice,
  getAllParibahanNotice,
  getAuthNotice,
} from "./noticeApiSlice";

const noticeSlice = createSlice({
  name: "notice",
  initialState: {
    paribahanNotices: null,
    authNotices: null,
    error: null,
    message: null,
    success: false,
    loader: false,
  },
  reducers: {
    setNoticeMessageEmpty: (state) => {
      state.error = null;
      state.message = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllParibahanNotice.pending, (state) => {
        state.loader;
      })
      .addCase(getAllParibahanNotice.rejected, (state) => {
        //   state.error = action.error.message;
        state.loader = false;
      })
      .addCase(getAllParibahanNotice.fulfilled, (state, action) => {
        state.paribahanNotices = action.payload.notices;
        state.success = true;
        state.loader = false;
      })
      .addCase(getAuthNotice.pending, (state) => {
        state.loader = true;
      })
      .addCase(getAuthNotice.rejected, (state) => {
        //   state.error = action.error.message;
        state.loader = false;
      })
      .addCase(getAuthNotice.fulfilled, (state, action) => {
        state.authNotices = action.payload.notices;
        state.success = true;
        state.loader = false;
      })
      .addCase(createAuthNotice.pending, (state) => {
        state.loader = true;
      })
      .addCase(createAuthNotice.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(createAuthNotice.fulfilled, (state, action) => {
        state.success = true;
        state.loader = false;
        state.message = action.payload.message;

        state.authNotices = state.authNotices ?? [];
        state.authNotices.unshift(action.payload.notice);
      })
      .addCase(deleteAuthNotice.pending, (state) => {
        state.loader = true;
      })
      .addCase(deleteAuthNotice.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(deleteAuthNotice.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.authNotices = state.authNotices.filter(
          (item) => item.id !== action.payload.notice.id
        );

        state.loader = false;
      });
  },
});

export const noticeData = (state) => state.notice;

// Actions
export const { setNoticeMessageEmpty } = noticeSlice.actions;

// exports
export default noticeSlice.reducer;
