import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createAuthNotice = createAsyncThunk(
  "notice/createAuthNotice",
  async ({ id, data }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/notice/createadmin/${id}`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const getAuthNotice = createAsyncThunk(
  "notice/getAuthNotice",
  async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/notice/getalladmin`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
export const deleteAuthNotice = createAsyncThunk(
  "notice/deleteAuthNotice",
  async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/notice/deleteadmin/${id}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const getAllParibahanNotice = createAsyncThunk(
  "notice/getAllParibahanNotice",
  async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/notice/getallparibahan`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
