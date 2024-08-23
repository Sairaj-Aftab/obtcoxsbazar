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
    loader: false,
    message: null,
    error: null,
  },
  reducers: {
    setParibahanAuthMessageEmpty: (state, action) => {
      state.loader = false;
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
      .addCase(loginAuthUser.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(loginAuthUser.rejected, (state, action) => {
        state.loader = false;
        state.error = action.error.message;
      })
      .addCase(loginAuthUser.fulfilled, (state, action) => {
        state.loader = false;
        state.paribahanAuth = action.payload.user;
        localStorage.setItem(
          "paribahanAuth",
          JSON.stringify(action.payload.user)
        );
      })
      .addCase(getLogedInUser.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(getLogedInUser.rejected, (state, action) => {
        state.loader = false;
        state.paribahanAuth = null;
      })
      .addCase(getLogedInUser.fulfilled, (state, action) => {
        state.loader = false;
        state.paribahanAuth = action.payload;
      })
      .addCase(logoutAuthUser.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(logoutAuthUser.rejected, (state, action) => {
        state.loader = false;
        state.error = action.error.message;
      })
      .addCase(logoutAuthUser.fulfilled, (state, action) => {
        state.loader = false;
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
