import { createSlice } from "@reduxjs/toolkit";
import { getLogedInUser, loginAuthUser, logoutAuthUser } from "./authApiSlice";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: localStorage.getItem("authUser")
      ? JSON.parse(localStorage.getItem("authUser"))
      : null,
    message: null,
    error: null,
    loader: false,
  },
  reducers: {
    setMessageEmpty: (state) => {
      state.message = null;
      state.error = null;
      state.loader = false;
    },
    setLogoutUser: (state) => {
      state.message = null;
      state.error = null;
      state.authUser = null;
      state.loader = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAuthUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(loginAuthUser.pending, (state) => {
        state.loader = true;
      })
      .addCase(loginAuthUser.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.authUser = action.payload.user;
        localStorage.setItem("authUser", JSON.stringify(action.payload.user));
        state.loader = false;
      })
      .addCase(getLogedInUser.rejected, (state) => {
        state.authUser = null;
        state.loader = false;
      })
      .addCase(getLogedInUser.pending, (state) => {
        state.loader = true;
      })
      .addCase(getLogedInUser.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.loader = false;
      })
      .addCase(logoutAuthUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(logoutAuthUser.pending, (state) => {
        state.loader = true;
      })
      .addCase(logoutAuthUser.fulfilled, (state) => {
        state.authUser = null;
        localStorage.removeItem("authUser");
        state.loader = false;
      });
  },
});

// Export Selector
export const authData = (state) => state.auth;

// Actions
export const { setMessageEmpty, setLogoutUser } = authSlice.actions;

// exports
export default authSlice.reducer;
