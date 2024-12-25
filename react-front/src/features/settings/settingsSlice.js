import { createSlice } from "@reduxjs/toolkit";
import { getAllSettings } from "./settingsApiSlice";

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    settings: [],
    message: null,
    error: null,
    loader: false,
  },
  reducers: {
    setSettingsMessageEmpty: (state) => {
      state.message = null;
      state.error = null;
      state.loader = false;
    },
  },
  extraReducers: (builder) => {
    // Handle getVisitorStats actions
    builder
      .addCase(getAllSettings.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(getAllSettings.pending, (state) => {
        state.loader = true;
      })
      .addCase(getAllSettings.fulfilled, (state, action) => {
        state.settings = action.payload.settings;
        state.loader = false;
      });
  },
});

// Export Selector
export const settingsData = (state) => state.settings;

// Actions
export const { setSettingsMessageEmpty } = settingsSlice.actions;

// Exports
export default settingsSlice.reducer;
