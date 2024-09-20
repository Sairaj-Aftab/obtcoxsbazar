import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createTouristBusPermission = createAsyncThunk(
  "touristBusPermission/createTouristBusPermission",
  async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/tourist-permission/create`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

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
