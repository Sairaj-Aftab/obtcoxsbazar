import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createSchedule = createAsyncThunk(
  "schedules/createSchedule",
  async ({ data }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/rgschedule/create`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const getAllRgSchedules = createAsyncThunk(
  "regularSchedules/getAllSchedules",
  async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/rgschedule`,
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
  "regularSchedules/deleteSchedule",
  async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/rgschedule/delete/${id}`,
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
