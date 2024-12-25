import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// // Create Permission
export const updateSetting = createAsyncThunk(
  "settings/updateSetting",
  async ({ data, id }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/setting/${id}`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
export const getAllSettings = createAsyncThunk(
  "settings/getAllSettings",
  async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/setting`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
