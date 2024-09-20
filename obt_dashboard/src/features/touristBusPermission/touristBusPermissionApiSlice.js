import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllTouristBusPermission = createAsyncThunk(
  "touristBusPermission/getAllTouristBusPermission",
  async ({ page, limit, filters }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/tourist-permission`,
        {
          params: { page, limit, ...filters },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// New thunk for updating a permission
export const updateTouristBusPermission = createAsyncThunk(
  "touristBusPermission/updateTouristBusPermission",
  async ({ id, approved, rejected, permissionReason }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/tourist-permission/update/${id}`,
        {
          approved,
          rejected,
          permissionReason,
        },
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
