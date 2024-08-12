import { createSlice } from "@reduxjs/toolkit";
import {
  createSchedule,
  deleteSchedule,
  getDestinationPlace,
  getLeavingPlace,
  getSchedulesDataByAuthId,
  getTodaysSchedules,
  updateSchedule,
} from "./schedulesApiSlice";
const schedulesSlice = createSlice({
  name: "schedules",
  initialState: {
    schedules: null,
    todaySchedules: null,
    authSchedules: [],
    authSchedulesCount: 0,
    authSearchCount: 0,
    leavingPlaces: null,
    destinationPlaces: null,
    message: null,
    error: null,
    loader: false,
    todayScheduleLoader: false,
    authScheduleLoader: false,
    placesLoader: false,
  },
  reducers: {
    setMessageEmpty: (state) => {
      state.message = null;
      state.error = null;
      state.loader = false;
      state.todayScheduleLoader = false;
      state.authScheduleLoader = false;
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
        state.loader = false;
      })
      .addCase(createSchedule.pending, (state) => {
        state.loader = true;
      })
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.loader = false;
        state.schedules = state.schedules ?? [];
        state.todaySchedules = state.todaySchedules ?? [];
        state.schedules.push(action.payload.busSchedule);
        state.authSchedules.push(action.payload.busSchedule);
        state.todaySchedules.push(action.payload.busSchedule);
        state.authSchedulesCount++;
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
        state.message = action.payload.message;
        const authScheduleIndex = state.authSchedules.findIndex(
          (schedule) => schedule.id === action.payload.busSchedule.id
        );
        if (authScheduleIndex !== -1) {
          state.authSchedules[authScheduleIndex] = action.payload.busSchedule;
        }
        const scheduleIndex = state.schedules.findIndex(
          (schedule) => schedule.id === action.payload.busSchedule.id
        );
        if (scheduleIndex !== -1) {
          state.schedules[scheduleIndex] = action.payload.busSchedule;
        }
        const todayScheduleIndex = state.todaySchedules.findIndex(
          (schedule) => schedule.id === action.payload.busSchedule.id
        );
        if (todayScheduleIndex !== -1) {
          state.todaySchedules[todayScheduleIndex] = action.payload.busSchedule;
        }
      })
      .addCase(getTodaysSchedules.rejected, (state, action) => {
        // state.error = action.error.message;
        state.todayScheduleLoader = false;
      })
      .addCase(getTodaysSchedules.pending, (state) => {
        state.todayScheduleLoader = true;
      })
      .addCase(getTodaysSchedules.fulfilled, (state, action) => {
        state.todayScheduleLoader = false;
        state.todaySchedules = action.payload.schedules;
      })
      .addCase(getSchedulesDataByAuthId.rejected, (state, action) => {
        // state.error = action.error.message;
        state.authScheduleLoader = false;
      })
      .addCase(getSchedulesDataByAuthId.pending, (state) => {
        state.authScheduleLoader = true;
      })
      .addCase(getSchedulesDataByAuthId.fulfilled, (state, action) => {
        state.authScheduleLoader = false;
        state.authSchedules = action.payload.schedules;
        state.authSchedulesCount = action.payload.count;
        state.authSearchCount = action.payload.searchCount;
      })
      .addCase(deleteSchedule.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
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
        state.todaySchedules = state.todaySchedules.filter(
          (item) => item.id !== action.payload.schedule.id
        );
        state.authSchedulesCount--;
        state.message = action.payload.message;
      })
      .addCase(getLeavingPlace.rejected, (state, action) => {
        state.error = action.error.message;
        state.placesLoader = false;
      })
      .addCase(getLeavingPlace.pending, (state) => {
        state.placesLoader = true;
      })
      .addCase(getLeavingPlace.fulfilled, (state, action) => {
        state.placesLoader = false;
        state.leavingPlaces = action.payload.places;
      })
      .addCase(getDestinationPlace.rejected, (state, action) => {
        state.error = action.error.message;
        state.placesLoader = false;
      })
      .addCase(getDestinationPlace.pending, (state) => {
        state.placesLoader = true;
      })
      .addCase(getDestinationPlace.fulfilled, (state, action) => {
        state.placesLoader = false;
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
