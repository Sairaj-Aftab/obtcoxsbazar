import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getDestinationPlace = createAsyncThunk(
  "place/getDestinationPlace",
  async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/place/destination`,
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

export const getLeavingPlace = createAsyncThunk(
  "place/getLeavingPlace",
  async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/place/leave`,
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

export const getParkingPlace = createAsyncThunk(
  "place/getParkingPlace",
  async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/place/parking`,
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
