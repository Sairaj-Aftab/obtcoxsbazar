import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createSchedule = createAsyncThunk(
  "schedules/createSchedule",
  async ({ id, data }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/schedule/${id}`,
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
        `${import.meta.env.VITE_API_URL}/schedule/update/${id}`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const getSchedulesDataByLimit = createAsyncThunk(
  "schedules/getSchedulesDataByLimit",
  async (limit) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/schedule/getbylimit?limit=${limit}`,
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

export const getSchedulesDataByAuthId = createAsyncThunk(
  "schedules/getSchedulesDataByAuthId",
  async ({ id, limit }) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/schedule/getbyparibahan/${id}?limit=${limit}`,
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
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const getDestinationPlace = createAsyncThunk(
  "place/getDestinationPlace",
  async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/place/destination`,
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

export const getLeavingPlace = createAsyncThunk(
  "place/getLeavingPlace",
  async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/place/leave`,
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
