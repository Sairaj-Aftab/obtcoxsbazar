import { configureStore } from "@reduxjs/toolkit";
import busSlice from "./bus/busSlice";
import schedulesSlice from "./schedules/schedulesSlice";
import busInfoSlice from "./busInfo/busInfoSlice";
import driverInfoSlice from "./driverInfo/driverInfoSlice";
import guideInfoSlice from "./guideInfo/guideInfoSlice";
import noticeSlice from "./notice/noticeSlice";

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
