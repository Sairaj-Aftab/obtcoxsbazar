import { createSlice } from "@reduxjs/toolkit";
import { getAllSettings, updateSetting } from "./settingApiSlice";

const settingSlice = createSlice({
  name: "setting",
  initialState: {
    settings: [],
    error: null,
    message: null,
    success: false,
    loader: false,
  },
  reducers: {
    setSettingMessageEmpty: (state) => {
      state.error = null;
      state.message = null;
      state.success = false;
      state.loader = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllSettings.pending, (state) => {
        state.loader = true;
      })
      .addCase(getAllSettings.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(getAllSettings.fulfilled, (state, action) => {
        state.settings = action.payload.settings;
        state.loader = false;
      })
      .addCase(updateSetting.pending, (state) => {
        state.success = false;
        state.loader = true;
      })
      .addCase(updateSetting.rejected, (state, action) => {
        state.error = action.error.message;
        state.success = false;
        state.loader = false;
      })
      .addCase(updateSetting.fulfilled, (state, action) => {
        state.settings[
          state.settings.findIndex(
            (data) => data.id == action.payload.setting.id
          )
        ] = action.payload.setting;
        state.message = action.payload.message;
        state.loader = false;
        state.success = true;
      });
  },
});

// Export Selector
export const getAllSettingData = (state) => state.setting;

// Actions
export const { setSettingMessageEmpty } = settingSlice.actions;

// exports
export default settingSlice.reducer;
