import { createSlice } from "@reduxjs/toolkit";
import {
  createParibahanNotice,
  deleteNotice,
  getAllParibahanNotice,
  getNoticeFromAdmin,
} from "./noticeApiSlice";

const noticeSlice = createSlice({
  name: "notice",
  initialState: {
    paribahanNotices: null,
    adminNotices: null,
    message: null,
    error: null,
    loader: false,
  },
  reducers: {
    setNoticeMessageEmpty: (state, action) => {
      state.error = null;
      state.message = null;
      state.loader = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllParibahanNotice.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(getAllParibahanNotice.rejected, (state, action) => {
        //   state.error = action.error.message;
        state.loader = false;
      })
      .addCase(getAllParibahanNotice.fulfilled, (state, action) => {
        state.paribahanNotices = action.payload.notices;
        state.loader = false;
      })
      .addCase(getNoticeFromAdmin.rejected, (state, action) => {
        //   state.error = action.error.message;
        state.loader = false;
      })
      .addCase(getNoticeFromAdmin.fulfilled, (state, action) => {
        state.adminNotices = action.payload.notices;
        state.loader = false;
      })
      .addCase(createParibahanNotice.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(createParibahanNotice.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(createParibahanNotice.fulfilled, (state, action) => {
        state.loader = false;
        state.message = action.payload.message;

        state.paribahanNotices = state.paribahanNotices ?? [];
        state.paribahanNotices.push(action.payload.notice);
      })
      .addCase(deleteNotice.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(deleteNotice.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(deleteNotice.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.paribahanNotices = state.paribahanNotices.filter(
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
