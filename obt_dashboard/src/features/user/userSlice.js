import { createSlice } from "@reduxjs/toolkit";
import {
  createAuthUser,
  createParibahanUser,
  createPermission,
  createRole,
  deleteAuthUser,
  deleteParibahanUser,
  deletePermission,
  deleteRole,
  editRole,
  getAllAuthUser,
  getAllPermission,
  getAllRoles,
  getParibahanUser,
  updateAuthUser,
  updateParibahanUser,
  updatePermissionStatus,
  updateRoleStatus,
} from "./userApiSllice";

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: null,
    paribahanUsers: null,
    permissions: null,
    roles: null,
    status: null,
    error: null,
    message: null,
    success: false,
  },
  reducers: {
    setMessageEmpty: (state, action) => {
      state.error = null;
      state.message = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPermission.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getAllPermission.fulfilled, (state, action) => {
        state.permissions = action.payload.permission;
      })
      .addCase(createPermission.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(createPermission.fulfilled, (state, action) => {
        // state.message = action.payload.message;
        state.permissions = state.permissions ?? [];
        state.permissions.push(action.payload.permission);
      })
      .addCase(deletePermission.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deletePermission.fulfilled, (state, action) => {
        state.permissions = state.permissions.filter(
          (item) => item.id !== action.payload.permission.id
        );
      })
      .addCase(updatePermissionStatus.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updatePermissionStatus.fulfilled, (state, action) => {
        state.permissions[
          state.permissions.findIndex(
            (data) => data.id == action.payload.permission.id
          )
        ] = action.payload.permission;
      })
      .addCase(getAllRoles.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getAllRoles.fulfilled, (state, action) => {
        state.roles = action.payload.roles;
      })
      .addCase(createRole.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.roles = state.roles ?? [];
        state.roles.push(action.payload.role);
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.roles = state.roles.filter(
          (item) => item.id !== action.payload.role.id
        );
      })
      .addCase(updateRoleStatus.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateRoleStatus.fulfilled, (state, action) => {
        state.roles[
          state.roles.findIndex((data) => data.id == action.payload.role.id)
        ] = action.payload.role;
      })
      .addCase(editRole.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(editRole.fulfilled, (state, action) => {
        state.roles[
          state.roles.findIndex((data) => data.id == action.payload.role.id)
        ] = action.payload.role;
        state.message = action.payload.message;
      })
      .addCase(getAllAuthUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getAllAuthUser.fulfilled, (state, action) => {
        state.users = action.payload.users;
      })
      .addCase(createAuthUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(createAuthUser.fulfilled, (state, action) => {
        state.success = true;
        state.message = action.payload.message;
        state.users = state.users ?? [];
        state.users.push(action.payload.user);
      })
      .addCase(updateAuthUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateAuthUser.fulfilled, (state, action) => {
        state.users[
          state.users.findIndex((data) => data.id == action.payload.user.id)
        ] = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(deleteAuthUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteAuthUser.fulfilled, (state, action) => {
        state.users = state.users.filter(
          (data) => data.id !== action.payload.user.id
        );
      })
      .addCase(getParibahanUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getParibahanUser.fulfilled, (state, action) => {
        state.paribahanUsers = action.payload.paribahanUsers;
      })
      .addCase(createParibahanUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(createParibahanUser.fulfilled, (state, action) => {
        state.success = true;
        state.message = action.payload.message;
        state.paribahanUsers = state.paribahanUsers ?? [];
        state.paribahanUsers.push(action.payload.paribahanUser);
      })
      .addCase(updateParibahanUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateParibahanUser.fulfilled, (state, action) => {
        state.paribahanUsers[
          state.paribahanUsers.findIndex(
            (data) => data.id == action.payload.paribahanUser.id
          )
        ] = action.payload.paribahanUser;
        state.message = action.payload.message;
      })
      .addCase(deleteParibahanUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteParibahanUser.fulfilled, (state, action) => {
        state.paribahanUsers = state.paribahanUsers.filter(
          (data) => data.id !== action.payload.paribahanUser.id
        );
      });
  },
});

// Export Selector
export const getAllData = (state) => state.user;

// Actions
export const { setMessageEmpty } = userSlice.actions;

// exports
export default userSlice.reducer;
