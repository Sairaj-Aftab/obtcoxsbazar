import { configureStore } from "@reduxjs/toolkit";
import schedulesSlice from "./features/schedules/schedulesSlice";
import busSlice from "./features/bus/busSlice";
import noticeSlice from "./features/notice/noticeSlice";
import guideInfoSlice from "./features/guideInfo/guideInfoSlice";
import driverInfoSlice from "./features/driverInfo/driverInfoSlice";
import busInfoSlice from "./features/busInfo/busInfoSlice";

export const store = configureStore({
  reducer: {
    bus: busSlice,
    schedules: schedulesSlice,
    busInfo: busInfoSlice,
    driverInfo: driverInfoSlice,
    guideInfo: guideInfoSlice,
    notice: noticeSlice,
  },
});
