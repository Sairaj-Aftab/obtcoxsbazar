import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllRgSchedules = createAsyncThunk(
  "regularSchedules/getAllSchedules",
  async ({ page, limit, search }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/rgschedule`,
        {
          params: { page, limit, search },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
