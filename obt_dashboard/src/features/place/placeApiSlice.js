import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createPlace = createAsyncThunk(
  "place/createPlace",
  async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/place`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const getAllPlace = createAsyncThunk("place/getAllPlace", async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/place`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

export const getLeavingPlaces = createAsyncThunk(
  "place/getLeavingPlaces",
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

export const getDestinationPlaces = createAsyncThunk(
  "place/getDestinationPlaces",
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

export const deletePlace = createAsyncThunk("place/deletePlace", async (id) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/place/${id}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});
