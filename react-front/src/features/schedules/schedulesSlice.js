import { createSlice } from "@reduxjs/toolkit";
import {
  createSchedule,
  deleteSchedule,
  getDestinationPlace,
  getLeavingPlace,
  getParkingPlace,
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
    parkingPlaces: [],
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
      state.todaySchedules.push(action.payload);
    },
    updateScheduleSocket: (state, action) => {
      const scheduleIndex = state.todaySchedules.findIndex(
        (schedule) => schedule.id === action.payload.id
      );
      if (scheduleIndex !== -1) {
        state.todaySchedules[scheduleIndex] = action.payload;
      }
    },
    deleteScheduleSocket: (state, action) => {
      state.todaySchedules = state.todaySchedules.filter(
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
        state.schedules = state.schedules ?? [];
        state.todaySchedules = state.todaySchedules ?? [];
        state.authSchedules.unshift(action.payload.busSchedule);
        state.schedules.unshift(action.payload.busSchedule);
        state.todaySchedules.unshift(action.payload.busSchedule);
        state.authSchedulesCount++;
        state.message = action.payload.message;
        state.loader = false;
      })
      .addCase(updateSchedule.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateSchedule.pending, (state) => {
        state.loader = true;
      })
      .addCase(updateSchedule.fulfilled, (state, action) => {
        const authSchedulesArray = state.authSchedules || [];
        const schedulesArray = state.schedules || [];
        const todaySchedulesArray = state.todaySchedules || [];

        const authScheduleIndex = authSchedulesArray.findIndex(
          (schedule) => schedule.id === action.payload.busSchedule.id
        );
        if (authScheduleIndex !== -1) {
          state.authSchedules[authScheduleIndex] = action.payload.busSchedule;
        }

        const scheduleIndex = schedulesArray.findIndex(
          (schedule) => schedule.id === action.payload.busSchedule.id
        );
        if (scheduleIndex !== -1) {
          state.schedules[scheduleIndex] = action.payload.busSchedule;
        }

        const todayScheduleIndex = todaySchedulesArray.findIndex(
          (schedule) => schedule.id === action.payload.busSchedule.id
        );
        if (todayScheduleIndex !== -1) {
          state.todaySchedules[todayScheduleIndex] = action.payload.busSchedule;
        }
        state.loader = false;
        state.message = action.payload.message;
      })
      .addCase(getTodaysSchedules.rejected, (state) => {
        // state.error = action.error.message;
        state.todayScheduleLoader = false;
      })
      .addCase(getTodaysSchedules.pending, (state) => {
        state.todayScheduleLoader = true;
      })
      .addCase(getTodaysSchedules.fulfilled, (state, action) => {
        state.todaySchedules = action.payload.schedules;
        state.todayScheduleLoader = false;
      })
      .addCase(getSchedulesDataByAuthId.rejected, (state) => {
        // state.error = action.error.message;
        state.authScheduleLoader = false;
      })
      .addCase(getSchedulesDataByAuthId.pending, (state) => {
        state.authScheduleLoader = true;
      })
      .addCase(getSchedulesDataByAuthId.fulfilled, (state, action) => {
        state.authSchedules = action.payload.schedules;
        state.authSchedulesCount = action.payload.count;
        state.authSearchCount = action.payload.searchCount;
        state.authScheduleLoader = false;
      })
      .addCase(deleteSchedule.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(deleteSchedule.pending, (state) => {
        state.loader = true;
      })
      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.authSchedules = state.authSchedules.filter(
          (item) => item.id !== action.payload.schedule.id
        );
        state.schedules = state.schedules.filter(
          (item) => item.id !== action.payload.schedule.id
        );
        state.todaySchedules = state.todaySchedules.filter(
          (item) => item.id !== action.payload.schedule.id
        );
        state.authSchedulesCount--;
        state.message = action.payload.message;
        state.loader = false;
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
        state.destinationPlaces = action.payload.places;
        state.placesLoader = false;
      })
      .addCase(getParkingPlace.rejected, (state, action) => {
        state.error = action.error.message;
        state.placesLoader = false;
      })
      .addCase(getParkingPlace.pending, (state) => {
        state.placesLoader = true;
      })
      .addCase(getParkingPlace.fulfilled, (state, action) => {
        state.parkingPlaces = action.payload.places;
        state.placesLoader = false;
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
