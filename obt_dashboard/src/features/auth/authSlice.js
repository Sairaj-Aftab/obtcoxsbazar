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
  },
  reducers: {
    setMessageEmpty: (state) => {
      state.message = null;
      state.error = null;
    },
    setLogoutUser: (state) => {
      state.message = null;
      state.error = null;
      state.authUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAuthUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(loginAuthUser.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.authUser = action.payload.user;
        localStorage.setItem("authUser", JSON.stringify(action.payload.user));
      })
      .addCase(getLogedInUser.rejected, (state) => {
        state.authUser = null;
      })
      .addCase(getLogedInUser.fulfilled, (state, action) => {
        state.authUser = action.payload;
      })
      .addCase(logoutAuthUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(logoutAuthUser.fulfilled, (state) => {
        state.authUser = null;
        localStorage.removeItem("authUser");
      });
  },
});

// Export Selector
export const authData = (state) => state.auth;

// Actions
export const { setMessageEmpty, setLogoutUser } = authSlice.actions;

// exports
export default authSlice.reducer;
