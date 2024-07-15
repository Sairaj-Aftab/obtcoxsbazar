import { createSlice } from "@reduxjs/toolkit";
import {
  createBrand,
  createCategory,
  createTag,
  deleteBrand,
  deleteCategory,
  deleteTag,
  getAllBrand,
  getAllCategories,
  getAllTag,
  updateBrand,
} from "./productApiSlice";

const productSlice = createSlice({
  name: "user",
  initialState: {
    product: null,
    brand: null,
    tag: null,
    category: null,
    error: null,
    message: null,
    success: false,
    loader: false,
  },
  reducers: {
    setMessageEmpty: (state, action) => {
      state.error = null;
      state.message = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBrand.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.brand = state.brand ?? [];
        state.brand.push(action.payload.brand);
        state.message = action.payload.message;
        state.success = true;
        state.loader = false;
      })
      .addCase(getAllBrand.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(getAllBrand.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(getAllBrand.fulfilled, (state, action) => {
        state.brand = action.payload;
        state.message = action.payload.message;
        state.success = true;
        state.loader = false;
      })
      .addCase(updateBrand.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.brand[
          state.brand.findIndex((data) => data._id == action.payload.brand._id)
        ] = action.payload.brand;
        state.message = action.payload.message;
        state.success = true;
        state.loader = false;
      })
      .addCase(deleteBrand.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.brand = state.brand.filter(
          (data) => data._id !== action.payload.brand._id
        );
        state.message = action.payload.message;
        state.success = true;
        state.loader = false;
      })
      .addCase(createTag.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(createTag.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(createTag.fulfilled, (state, action) => {
        state.tag = state.tag ?? [];
        state.tag.push(action.payload.tag);
        state.message = action.payload.message;
        state.success = true;
        state.loader = false;
      })
      .addCase(getAllTag.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(getAllTag.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(getAllTag.fulfilled, (state, action) => {
        state.tag = action.payload;
        state.message = action.payload.message;
        state.success = true;
        state.loader = false;
      })
      .addCase(deleteTag.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(deleteTag.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.tag = state.tag.filter(
          (data) => data._id !== action.payload.tag._id
        );
        state.message = action.payload.message;
        state.success = true;
        state.loader = false;
      })
      .addCase(getAllCategories.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.category = action.payload;
        state.message = action.payload.message;
        state.success = true;
        state.loader = false;
      })
      .addCase(createCategory.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.category = state.category ?? [];
        state.category.push(action.payload.categorie);
        state.message = action.payload.message;
        state.success = true;
        state.loader = false;
      })
      .addCase(deleteCategory.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.category = state.category.filter(
          (data) => data._id !== action.payload.categorie._id
        );
        state.message = action.payload.message;
        state.success = true;
        state.loader = false;
      });
  },
});

// Export Selector
export const getAllDataOfProduct = (state) => state.product;

// Actions
export const { setMessageEmpty } = productSlice.actions;

// exports
export default productSlice.reducer;
