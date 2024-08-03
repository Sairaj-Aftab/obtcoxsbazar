import { createSlice } from "@reduxjs/toolkit";
import {
  getLogedInUser,
  loginAuthUser,
  logoutAuthUser,
} from "./paribahanAuthApiSlice";

const paribahanAuthSlice = createSlice({
  name: "paribahanAuth",
  initialState: {
    paribahanAuth: localStorage.getItem("paribahanAuth")
      ? JSON.parse(localStorage.getItem("paribahanAuth"))
      : null,
    message: null,
    error: null,
  },
  reducers: {
    setParibahanAuthMessageEmpty: (state, action) => {
      state.message = null;
      state.error = null;
    },
    setLogoutUser: (state, action) => {
      state.message = null;
      state.error = null;
      state.paribahanAuth = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAuthUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(loginAuthUser.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.paribahanAuth = action.payload.user;
        localStorage.setItem(
          "paribahanAuth",
          JSON.stringify(action.payload.user)
        );
      })
      .addCase(getLogedInUser.rejected, (state, action) => {
        state.paribahanAuth = null;
      })
      .addCase(getLogedInUser.fulfilled, (state, action) => {
        state.paribahanAuth = action.payload;
      })
      .addCase(logoutAuthUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(logoutAuthUser.fulfilled, (state, action) => {
        state.paribahanAuth = null;
        localStorage.removeItem("paribahanAuth");
      });
  },
});

// Export Selector
export const paribahanAuthData = (state) => state.paribahanAuth;

// Actions
export const { setParibahanAuthMessageEmpty, setLogoutUser } =
  paribahanAuthSlice.actions;

// exports
export default paribahanAuthSlice.reducer;
