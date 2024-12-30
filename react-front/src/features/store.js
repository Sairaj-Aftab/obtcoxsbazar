import { configureStore } from "@reduxjs/toolkit";
import paribahanAuthSlice from "./paribahanAuth/paribahanAuthSlice";

export const store = configureStore({
  reducer: {
    paribahanAuth: paribahanAuthSlice,
  },
});
