import { createSlice } from "@reduxjs/toolkit";
import {
  getLogedInUser,
  loginAuthUser,
  logoutAuthUser,
} from "./busAuthApiSlice";

// Initial state without direct localStorage access
const initialState = {
  busAuth: null,
  message: null,
  error: null,
};

// Only access localStorage on the client side
if (typeof window !== "undefined") {
  const storedBusAuth = localStorage.getItem("busAuth");
  if (storedBusAuth) {
    initialState.busAuth = JSON.parse(storedBusAuth);
  }
}

const busAuthSlice = createSlice({
  name: "busAuth",
  initialState,
  reducers: {
    setMessageEmpty: (state) => {
      state.message = null;
      state.error = null;
    },
    setLogoutUser: (state) => {
      state.message = null;
      state.error = null;
      state.busAuth = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("busAuth");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAuthUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(loginAuthUser.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.busAuth = action.payload.user;
        if (typeof window !== "undefined") {
          localStorage.setItem("busAuth", JSON.stringify(action.payload.user));
        }
      })
      .addCase(getLogedInUser.rejected, (state) => {
        state.busAuth = null;
      })
      .addCase(getLogedInUser.fulfilled, (state, action) => {
        state.busAuth = action.payload;
      })
      .addCase(logoutAuthUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(logoutAuthUser.fulfilled, (state) => {
        state.busAuth = null;
        if (typeof window !== "undefined") {
          localStorage.removeItem("busAuth");
        }
      });
  },
});

// Export Selector
export const busAuthData = (state) => state.busAuth;

// Actions
export const { setMessageEmpty, setLogoutUser } = busAuthSlice.actions;

// exports
export default busAuthSlice.reducer;
