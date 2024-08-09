import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getDriverInfo = createAsyncThunk(
  "driverInfo/getDriverInfo",
  async ({ id, limit }) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/driverinfo/getbyid/${id}?limit=${limit}`,
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

export const createDriverInfo = createAsyncThunk(
  "driverInfo/createDriverInfo",
  async ({ id, data }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/driverinfo/create/${id}`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const updateDriverInfo = createAsyncThunk(
  "driverInfo/updateDriverInfo",
  async ({ id, data }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/driverinfo/update/${id}`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const getAllDriverInfo = createAsyncThunk(
  "driverInfo/getAllDriverInfo",
  async ({ page, limit, search }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/driverinfo/getall`,
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

export const deleteDriverInfo = createAsyncThunk(
  "driverInfo/deleteDriverInfo",
  async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/driverinfo/delete/${id}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
