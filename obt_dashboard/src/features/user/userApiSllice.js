import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Get All Permission
export const getAllPermission = createAsyncThunk(
  "user/getAllPermission",
  async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/permission`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// // Create Permission
export const createPermission = createAsyncThunk(
  "user/createPermission",
  async (name) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/permission`,
        { name },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// // Update permission status
export const updatePermissionStatus = createAsyncThunk(
  "user/updatePermissionStatus",
  async ({ id, status }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/permission/status/${id}`,
        { status: status },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// // Delete Permission
export const deletePermission = createAsyncThunk(
  "user/deletePermission",
  async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/permission/${id}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// // Get All Rules
export const getAllRoles = createAsyncThunk("user/getRoles", async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/role`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

// // Create Role
export const createRole = createAsyncThunk("user/createRole", async (data) => {
  console.log(data);
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/role`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

// // Delete Rule
export const deleteRole = createAsyncThunk("user/deleteRole", async (id) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/role/${id}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

// // Update Rule status
export const updateRoleStatus = createAsyncThunk(
  "user/updateRoleStatus",
  async ({ id, status }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/role/status/${id}`,
        { status: status },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// // Edit Rule Info
export const editRole = createAsyncThunk(
  "user/editRole",
  async ({ id, name, permissions }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/role/${id}`,
        { name, permissions },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// // Create User
export const getAllAuthUser = createAsyncThunk(
  "user/getAllAuthUser",
  async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// // Create User
export const createAuthUser = createAsyncThunk(
  "user/createAuthUser",
  async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
// Update Status status
export const updateAuthUser = createAsyncThunk(
  "user/updateAuthUser",
  async ({ id, data }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/auth/${id}`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
// // Delete User
export const deleteAuthUser = createAsyncThunk(
  "user/deleteAuthUser",
  async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/auth/${id}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const getParibahanUser = createAsyncThunk(
  "paribahan/getParibahanUser",
  async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/paribahan`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// // Create Paribahan User
export const createParibahanUser = createAsyncThunk(
  "paribahan/createParibahanUser",
  async ({ authUserId, data }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/paribahan/register/${authUserId}`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// // Create Paribahan User
export const updateParibahanUser = createAsyncThunk(
  "paribahan/updateParibahanUser",
  async ({ id, data }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/paribahan/update/${id}`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// // Delete User
export const deleteParibahanUser = createAsyncThunk(
  "paribahan/deleteParibahanUser",
  async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/paribahan/${id}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
