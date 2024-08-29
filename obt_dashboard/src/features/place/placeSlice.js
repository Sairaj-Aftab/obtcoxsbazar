import { createSlice } from "@reduxjs/toolkit";
import {
  createPlace,
  deletePlace,
  getAllPlace,
  getDestinationPlaces,
  getLeavingPlaces,
  updatePlace,
} from "./placeApiSlice";

const placeSlice = createSlice({
  name: "place",
  initialState: {
    places: null,
    leavingPlaces: null,
    destinationPlaces: null,
    error: null,
    message: null,
    success: false,
    loader: false,
  },
  reducers: {
    setPlaceMessageEmpty: (state) => {
      state.error = null;
      state.message = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPlace.pending, (state) => {
        state.loader = true;
      })
      .addCase(getAllPlace.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(getAllPlace.fulfilled, (state, action) => {
        state.places = action.payload.places;
        state.success = true;
        state.loader = false;
      })
      .addCase(getLeavingPlaces.pending, (state) => {
        state.loader = true;
      })
      .addCase(getLeavingPlaces.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(getLeavingPlaces.fulfilled, (state, action) => {
        state.leavingPlaces = action.payload.places;
        state.success = true;
        state.loader = false;
      })
      .addCase(getDestinationPlaces.pending, (state) => {
        state.loader = true;
      })
      .addCase(getDestinationPlaces.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(getDestinationPlaces.fulfilled, (state, action) => {
        state.destinationPlaces = action.payload.places;
        state.success = true;
        state.loader = false;
      })
      .addCase(createPlace.pending, (state) => {
        state.loader = true;
      })
      .addCase(createPlace.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(createPlace.fulfilled, (state, action) => {
        state.success = true;
        state.loader = false;
        state.message = action.payload.message;

        state.places = state.places ?? [];
        state.places.unshift(action.payload.place);
        if (action.payload.place.status === "leave") {
          state.leavingPlaces = state.leavingPlaces ?? [];
          state.leavingPlaces.unshift(action.payload.place);
        }
        if (action.payload.place.status === "destination") {
          state.destinationPlaces = state.destinationPlaces ?? [];
          state.destinationPlaces.unshift(action.payload.place);
        }
      })
      .addCase(updatePlace.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updatePlace.pending, (state) => {
        state.loader = true;
      })
      .addCase(updatePlace.fulfilled, (state, action) => {
        state.success = true;
        state.loader = false;
        const placeIndex = state.places.findIndex(
          (info) => info.id === action.payload.place.id
        );
        if (placeIndex !== -1) {
          state.places[placeIndex] = action.payload.place;
        }
        const levIndex = state.leavingPlaces.findIndex(
          (info) => info.id === action.payload.place.id
        );
        if (levIndex !== -1) {
          state.leavingPlaces[levIndex] = action.payload.place;
        }
        const desIndex = state.destinationPlaces.findIndex(
          (info) => info.id === action.payload.place.id
        );
        if (desIndex !== -1) {
          state.destinationPlaces[desIndex] = action.payload.place;
        }
        state.message = action.payload.message;
      })
      .addCase(deletePlace.pending, (state) => {
        state.loader = true;
      })
      .addCase(deletePlace.rejected, (state, action) => {
        state.error = action.error.message;
        state.loader = false;
      })
      .addCase(deletePlace.fulfilled, (state, action) => {
        if (action.payload.place.status === "leave") {
          state.leavingPlaces = state.leavingPlaces.filter(
            (item) => item.id !== action.payload.place.id
          );
        }

        if (action.payload.place.status === "destination") {
          state.destinationPlaces = state.destinationPlaces.filter(
            (item) => item.id !== action.payload.place.id
          );
        }

        state.loader = false;
      });
  },
});

export const placeData = (state) => state.place;

// Actions
export const { setPlaceMessageEmpty } = placeSlice.actions;

// exports
export default placeSlice.reducer;
