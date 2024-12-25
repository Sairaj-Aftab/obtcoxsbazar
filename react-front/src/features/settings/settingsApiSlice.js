import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllSettings = createAsyncThunk(
  "settings/getSettings",
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
