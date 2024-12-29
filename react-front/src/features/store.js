import { configureStore } from "@reduxjs/toolkit";
import schedulesSlice from "./schedules/schedulesSlice";
import noticeSlice from "./notice/noticeSlice";
import paribahanAuthSlice from "./paribahanAuth/paribahanAuthSlice";
import visitorCountSlice from "./visitorCount/visitorCountSlice";

export const store = configureStore({
  reducer: {
    paribahanAuth: paribahanAuthSlice,
    schedules: schedulesSlice,
    notice: noticeSlice,
    visitorCount: visitorCountSlice,
  },
});
