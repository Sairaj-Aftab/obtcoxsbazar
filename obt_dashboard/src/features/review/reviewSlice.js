import { createSlice } from "@reduxjs/toolkit";
import { deleteReview, getAllReview } from "./reviewApiSlice";
const reviewSlice = createSlice({
  name: "review",
  initialState: {
    reviews: [],
    totalCount: 0,
    searchCount: 0,
    message: null,
    error: null,
    loader: false,
  },
  reducers: {
    setReviewMessageEmpty: (state) => {
      state.message = null;
      state.error = null;
      state.loader = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllReview.rejected, (state, action) => {
        state.loader = false;
        state.error = action.error.message;
      })
      .addCase(getAllReview.pending, (state) => {
        state.loader = true;
      })
      .addCase(getAllReview.fulfilled, (state, action) => {
        state.loader = false;
        state.totalCount = action.payload.count;
        state.searchCount = action.payload.searchCount;
        state.reviews = action.payload.reviews;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteReview.pending, (state) => {
        state.loader = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loader = false;
        state.message = action.payload.message;
        state.reviews = state.reviews.filter(
          (item) => item.id !== action.payload.review.id
        );
        state.totalCount--;
      });
  },
});

// Export Selector
export const reviewsData = (state) => state.review;

// Actions
export const { setReviewMessageEmpty } = reviewSlice.actions;

// exports
export default reviewSlice.reducer;
