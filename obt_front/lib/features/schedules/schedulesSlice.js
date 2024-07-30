import { createSlice } from "@reduxjs/toolkit";
import {
  createSchedule,
  deleteSchedule,
  getDestinationPlace,
  getLeavingPlace,
  getSchedulesDataByAuthId,
  getSchedulesDataByLimit,
  updateSchedule,
} from "./schedulesApiSlice";
const schedulesSlice = createSlice({
  name: "schedules",
  initialState: {
    schedules: null,
    authSchedules: null,
    leavingPlaces: null,
    destinationPlaces: null,
    message: null,
    error: null,
    loader: false,
  },
  reducers: {
    setMessageEmpty: (state) => {
      state.message = null;
      state.error = null;
    },
    addScheduleSocket: (state, action) => {
      state.schedules.push(action.payload);
    },
    updateScheduleSocket: (state, action) => {
      const scheduleIndex = state.schedules.findIndex(
        (schedule) => schedule.id === action.payload.id
      );
      if (scheduleIndex !== -1) {
        state.schedules[scheduleIndex] = action.payload;
      }
    },
    deleteScheduleSocket: (state, action) => {
      state.schedules = state.schedules.filter(
        (item) => item.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSchedule.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(createSchedule.pending, (state) => {
        state.loader = true;
      })
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.loader = false;
        state.schedules = state.schedules ?? [];
        state.authSchedules = state.authSchedules ?? [];
        state.schedules.push(action.payload.busSchedule);
        state.authSchedules.push(action.payload.busSchedule);
        state.message = action.payload.message;
      })
      .addCase(updateSchedule.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateSchedule.pending, (state) => {
        state.loader = true;
      })
      .addCase(updateSchedule.fulfilled, (state, action) => {
        state.loader = false;
        const scheduleIndex = state.schedules.findIndex(
          (schedule) => schedule.id === action.payload.busSchedule.id
        );
        if (scheduleIndex !== -1) {
          state.schedules[scheduleIndex] = action.payload.busSchedule;
        }
        const authScheduleIndex = state.authSchedules.findIndex(
          (schedule) => schedule.id === action.payload.busSchedule.id
        );
        if (authScheduleIndex !== -1) {
          state.authSchedules[authScheduleIndex] = action.payload.busSchedule;
        }
        state.message = action.payload.message;
      })
      .addCase(getSchedulesDataByLimit.rejected, (state, action) => {
        // state.error = action.error.message;
      })
      .addCase(getSchedulesDataByLimit.pending, (state) => {
        state.loader = true;
      })
      .addCase(getSchedulesDataByLimit.fulfilled, (state, action) => {
        state.loader = false;
        state.schedules = action.payload.schedules;
      })
      .addCase(getSchedulesDataByAuthId.rejected, (state, action) => {
        // state.error = action.error.message;
      })
      .addCase(getSchedulesDataByAuthId.pending, (state) => {
        state.loader = true;
      })
      .addCase(getSchedulesDataByAuthId.fulfilled, (state, action) => {
        state.loader = false;
        state.authSchedules = action.payload.schedules;
      })
      .addCase(deleteSchedule.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteSchedule.pending, (state) => {
        state.loader = true;
      })
      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.loader = false;
        state.schedules = state.schedules.filter(
          (item) => item.id !== action.payload.schedule.id
        );
        state.authSchedules = state.authSchedules.filter(
          (item) => item.id !== action.payload.schedule.id
        );
        state.message = action.payload.message;
      })
      .addCase(getLeavingPlace.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getLeavingPlace.pending, (state) => {
        state.loader = true;
      })
      .addCase(getLeavingPlace.fulfilled, (state, action) => {
        state.loader = false;
        state.leavingPlaces = action.payload.places;
      })
      .addCase(getDestinationPlace.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getDestinationPlace.pending, (state) => {
        state.loader = true;
      })
      .addCase(getDestinationPlace.fulfilled, (state, action) => {
        state.loader = false;
        state.destinationPlaces = action.payload.places;
      });
  },
});

// Export Selector
export const schedulesData = (state) => state.schedules;

// Actions
export const {
  setMessageEmpty,
  addScheduleSocket,
  updateScheduleSocket,
  deleteScheduleSocket,
} = schedulesSlice.actions;

// exports
export default schedulesSlice.reducer;
