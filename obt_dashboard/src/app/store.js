import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/authSlice";
import userSlice from "../features/user/userSlice";
import placeSlice from "../features/place/placeSlice";
import schedulesSlice from "../features/schedules/schedulesSlice";
import noticeSlice from "../features/notice/noticeSlice";
import busInfoSlice from "../features/busInfo/busInfoSlice";
import guideInfoSlice from "../features/guideInfo/guideInfoSlice";
import driverInfoSlice from "../features/driverInfo/driverInfoSlice";
import regularScheduleSlice from "../features/regularSchedule/regularScheduleSlice";
import reviewSlice from "../features/review/reviewSlice";
import touristBusPermissionSlice from "../features/touristBusPermission/touristBusPermissionSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    schedules: schedulesSlice,
    rgSchedules: regularScheduleSlice,
    user: userSlice,
    busInfo: busInfoSlice,
    guideInfo: guideInfoSlice,
    driverInfo: driverInfoSlice,
    place: placeSlice,
    notice: noticeSlice,
    touristBusPermission: touristBusPermissionSlice,
    review: reviewSlice,
  },
  middleware: (getDefaultMiddlewares) => getDefaultMiddlewares(),
  devTools: true,
});

export default store;
