import { createSlice } from "@reduxjs/toolkit";
import {
  getDestinationPlace,
  getLeavingPlace,
  getParkingPlace,
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
