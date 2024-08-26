import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllReview = createAsyncThunk(
  "review/getAllReview",
  async ({ page, limit, search }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/review`,
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

export const deleteReview = createAsyncThunk(
  "review/deleteReview",
  async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/review/delete/${id}`,
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
