import { createSlice } from "@reduxjs/toolkit";
import {
  createTouristBusPermission,
  getAllTouristBusPermission,
} from "./touristBusPermissionApiSlice";

const touristBusPermissionSlice = createSlice({
  name: "touristBusPermission",
  initialState: {
    permissions: [],
    permissionsCount: 0,
    message: null,
    error: null,
    loader: false,
    permissionLoader: false,
  },
  reducers: {
    setMessageEmpty: (state) => {
      state.message = null;
      state.error = null;
      state.loader = false;
      state.permissionLoader = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTouristBusPermission.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(createTouristBusPermission.pending, (state) => {
        state.loader = true;
      })
      .addCase(createTouristBusPermission.fulfilled, (state, action) => {
        state.permissions.unshift(action.payload);
        state.message = action.payload.message;
        state.loader = false;
      })
      .addCase(getAllTouristBusPermission.rejected, (state, action) => {
        state.error = action.error.message;
        state.permissionLoader = false;
      })
      .addCase(getAllTouristBusPermission.pending, (state) => {
        state.permissionLoader = true;
      })
      .addCase(getAllTouristBusPermission.fulfilled, (state, action) => {
        state.permissions = action.payload.permissions;
        state.permissionsCount = action.payload.count;
        state.permissionLoader = false;
      });
  },
});

// Export Selector
export const touristBusPermissionsData = (state) => state.touristBusPermission;

// Actions
export const { setMessageEmpty } = touristBusPermissionSlice.actions;

// Exports
export default touristBusPermissionSlice.reducer;
