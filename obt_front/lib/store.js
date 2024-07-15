import { configureStore } from "@reduxjs/toolkit";
import schedulesSlice from "./features/schedules/schedulesSlice";
import busSlice from "./features/bus/busSlice";
import noticeSlice from "./features/notice/noticeSlice";

export const store = configureStore({
  reducer: {
    bus: busSlice,
    schedules: schedulesSlice,
    notice: noticeSlice,
  },
});
