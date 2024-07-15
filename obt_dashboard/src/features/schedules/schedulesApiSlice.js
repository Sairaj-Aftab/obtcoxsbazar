import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllSchedules = createAsyncThunk(
  "schedules/getAllSchedules",
  async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/schedule`,
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

export const deleteSchedule = createAsyncThunk(
  "schedules/deleteSchedule",
  async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/schedule/delete/${id}`,
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
