import { createSlice } from "@reduxjs/toolkit";
import {
  getAllTouristBusPermission,
  updateTouristBusPermission,
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
      })
      .addCase(updateTouristBusPermission.pending, (state) => {
        state.loader = true;
      })
      .addCase(updateTouristBusPermission.fulfilled, (state, action) => {
        const index = state.permissions.findIndex(
          (perm) => perm.id === action.payload.updatedPermission.id
        );
        if (index !== -1) {
          state.permissions[index] = action.payload.updatedPermission;
        }
        state.message = action.payload.message;
        state.loader = false;
      })
      .addCase(updateTouristBusPermission.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      });
  },
});

// Export Selector
export const touristBusPermissionsData = (state) => state.touristBusPermission;

// Actions
export const { setMessageEmpty } = touristBusPermissionSlice.actions;

// Exports
export default touristBusPermissionSlice.reducer;
