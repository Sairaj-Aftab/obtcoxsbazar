import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Login User
export const loginAuthUser = createAsyncThunk(
  "auth/loginAuthUser",
  async (data) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/paribahan/login`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// // Get LogedIn User
export const getLogedInUser = createAsyncThunk(
  "auth/getLogedInUser",
  async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/paribahan/me`,
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

// // Logout User
export const logoutAuthUser = createAsyncThunk(
  "auth/logoutAuthUser",
  async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/paribahan/logout`,
        "",
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
