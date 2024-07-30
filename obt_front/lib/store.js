import { configureStore } from "@reduxjs/toolkit";
import schedulesSlice from "./features/schedules/schedulesSlice";
import busSlice from "./features/bus/busSlice";
import noticeSlice from "./features/notice/noticeSlice";
import guideInfoSlice from "./features/guideInfo/guideInfoSlice";

export const store = configureStore({
  reducer: {
    bus: busSlice,
    schedules: schedulesSlice,
    guideInfo: guideInfoSlice,
    notice: noticeSlice,
  },
});
