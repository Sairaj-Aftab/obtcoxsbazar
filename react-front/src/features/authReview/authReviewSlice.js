import { createSlice } from "@reduxjs/toolkit";
import { getAuthReviews } from "./authReviewApiSlice";
const authReviewSlice = createSlice({
  name: "review",
  initialState: {
    authReviews: [],
    totalCount: 0,
    searchCount: 0,
    error: null,
    loader: false,
  },
  reducers: {
    setMessageEmpty: (state) => {
      state.error = null;
      state.loader = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAuthReviews.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(getAuthReviews.pending, (state) => {
        state.loader = true;
      })
      .addCase(getAuthReviews.fulfilled, (state, action) => {
        state.loader = false;
        state.authReviews = action.payload.reviews;
        state.totalCount = action.payload.count;
        state.searchCount = action.payload.searchCount;
      });
  },
});

// Export Selector
export const authReviewsData = (state) => state.authReview;

// Actions
export const { setMessageEmpty } = authReviewSlice.actions;

// exports
export default authReviewSlice.reducer;
