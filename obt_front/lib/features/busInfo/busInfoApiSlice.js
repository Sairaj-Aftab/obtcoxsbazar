import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getBusInfo = createAsyncThunk(
  "busInfo/getBusInfo",
  async ({ id, limit }) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/businfo/${id}?limit=${limit}`,
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

export const createBusInfo = createAsyncThunk(
  "busInfo/createBusInfo",
  async ({ id, data }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/businfo/createbusinfo/${id}`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const updateBusInfo = createAsyncThunk(
  "busInfo/updateBusInfo",
  async ({ id, data }) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/businfo/update/${id}`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
