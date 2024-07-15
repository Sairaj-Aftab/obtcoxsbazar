import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Create Brand
export const createBrand = createAsyncThunk(
  "product/createBrand",
  async (data) => {
    try {
      const response = await axios.post(
        `http://localhost:5050/api/v1/brand/create`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
// Get All Brands
export const getAllBrand = createAsyncThunk("product/getAllBrand", async () => {
  try {
    const response = await axios.get(`http://localhost:5050/api/v1/brand`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});
// Update Brand
export const updateBrand = createAsyncThunk(
  "product/updateBrand",
  async ({ id, data }) => {
    try {
      const response = await axios.put(
        `http://localhost:5050/api/v1/brand/${id}`,
        data,
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
// Delete Brand
export const deleteBrand = createAsyncThunk(
  "product/deleteBrand",
  async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5050/api/v1/brand/${id}`,
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

// Product Tag
// Create Tag
export const createTag = createAsyncThunk("product/createTag", async (data) => {
  try {
    const response = await axios.post(
      `http://localhost:5050/api/v1/tag/create`,
      data,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});
// Get All Tag
export const getAllTag = createAsyncThunk("product/getAllTag", async () => {
  try {
    const response = await axios.get(`http://localhost:5050/api/v1/tag`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});
// Delete Tag
export const deleteTag = createAsyncThunk("product/deleteTag", async (id) => {
  try {
    const response = await axios.delete(
      `http://localhost:5050/api/v1/tag/${id}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

// Get All Categories
export const getAllCategories = createAsyncThunk(
  "product/getAllCategories",
  async () => {
    try {
      const response = await axios.get(
        `http://localhost:5050/api/v1/category`,
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
// Create Category
export const createCategory = createAsyncThunk(
  "product/createCategory",
  async (data) => {
    try {
      const response = await axios.post(
        `http://localhost:5050/api/v1/category/create`,
        data,
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
// Delete Category
export const deleteCategory = createAsyncThunk(
  "product/deleteCategory",
  async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5050/api/v1/category/${id}`,
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
