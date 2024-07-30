import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getDriverInfo = createAsyncThunk(
  "driverInfo/getDriverInfo",
  async ({ id, limit }) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/driverinfo/getbyid/${id}?limit=${limit}`,
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
        `${process.env.NEXT_PUBLIC_API_URL}/driverinfo/create/${id}`,
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
        `${process.env.NEXT_PUBLIC_API_URL}/driverinfo/update/${id}`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
