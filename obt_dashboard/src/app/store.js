import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/authSlice";
import userSlice from "../features/user/userSlice";
import placeSlice from "../features/place/placeSlice";
import schedulesSlice from "../features/schedules/schedulesSlice";
import noticeSlice from "../features/notice/noticeSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    schedules: schedulesSlice,
    user: userSlice,
    place: placeSlice,
    notice: noticeSlice,
  },
  middleware: (getDefaultMiddlewares) => getDefaultMiddlewares(),
  devTools: true,
});

export default store;
