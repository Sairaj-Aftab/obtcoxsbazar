import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getNoticeFromAdmin = createAsyncThunk(
  "notice/getNoticeFromAdmin",
  async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/notice/getalladmin`,
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
        `${process.env.NEXT_PUBLIC_API_URL}/notice/getallparibahan`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const createParibahanNotice = createAsyncThunk(
  "notice/createParibahanNotice",
  async ({ id, data }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/notice/createparibahan/${id}`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const deleteNotice = createAsyncThunk(
  "notice/deleteNotice",
  async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/notice/deleteparibahan/${id}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
