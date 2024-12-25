import { configureStore } from "@reduxjs/toolkit";
import busSlice from "./bus/busSlice";
import schedulesSlice from "./schedules/schedulesSlice";
import busInfoSlice from "./busInfo/busInfoSlice";
import driverInfoSlice from "./driverInfo/driverInfoSlice";
import guideInfoSlice from "./guideInfo/guideInfoSlice";
import noticeSlice from "./notice/noticeSlice";
import paribahanAuthSlice from "./paribahanAuth/paribahanAuthSlice";
import regularBusScheduleSlice from "./regularBusSchedule/regularBusScheduleSlice";
import authReviewSlice from "./authReview/authReviewSlice";
import touristBusPermissionSlice from "./touristBusPermission/touristBusPermissionSlice";
import visitorCountSlice from "./visitorCount/visitorCountSlice";
import settingsSlice from "./settings/settingsSlice";

export const store = configureStore({
  reducer: {
    paribahanAuth: paribahanAuthSlice,
    bus: busSlice,
    schedules: schedulesSlice,
    rgSchedules: regularBusScheduleSlice,
    busInfo: busInfoSlice,
    driverInfo: driverInfoSlice,
    guideInfo: guideInfoSlice,
    notice: noticeSlice,
    touristBusPermission: touristBusPermissionSlice,
    authReview: authReviewSlice,
    visitorCount: visitorCountSlice,
    settings: settingsSlice,
  },
});
