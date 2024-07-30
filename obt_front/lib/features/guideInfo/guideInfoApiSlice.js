import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getGuideInfo = createAsyncThunk(
  "guideInfo/getGuideInfo",
  async ({ id, limit }) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/guideinfo/getbyid/${id}?limit=${limit}`,
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

export const createGuideInfo = createAsyncThunk(
  "guideInfo/createGuideInfo",
  async ({ id, data }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/guideinfo/create/${id}`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const updateGuideInfo = createAsyncThunk(
  "guideInfo/updateGuideInfo",
  async ({ id, data }) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/guideinfo/update/${id}`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
