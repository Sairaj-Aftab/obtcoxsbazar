import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getVisitorStats = createAsyncThunk(
  "visitorCount/visitorCountPOST",
  async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/visitorcount`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const updateVisitorCount = createAsyncThunk(
  "visitorCount/updateVisitorCount",
  async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/visitorcount`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
