import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createSchedule = createAsyncThunk(
  "schedules/createSchedule",
  async ({ id, data }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/rgschedule/create/${id}`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const updateSchedule = createAsyncThunk(
  "schedules/updateSchedule",
  async ({ id, data }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/rgschedule/update/${id}`,
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
