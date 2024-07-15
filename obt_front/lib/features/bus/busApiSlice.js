import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllBusServices = createAsyncThunk(
  "bus/getAllBusServices",
  async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/paribahan`,
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
export const getBusInfoData = createAsyncThunk(
  "bus/getBusInfoData",
  async (id) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/paribahan/getsingle/${id}`,
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
