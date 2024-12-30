import { create } from "zustand";

const usePlaces = create((set) => ({
  leavingPlaces: null,
  destinationPlaces: null,
  parkingPlaces: null,
  leavingPlacesLoader: false,
  destinationPlacesLoader: false,
  parkingPlacesLoader: false,
  setLeavingPlaces: ({ data, loader }) => {
    set({ leavingPlaces: data, leavingPlacesLoader: loader });
  },
  setDestinationPlaces: ({ data, loader }) => {
    set({ destinationPlaces: data, destinationPlacesLoader: loader });
  },
  setParkingPlaces: ({ data, loader }) => {
    set({ parkingPlaces: data, parkingPlacesLoader: loader });
  },
}));

export default usePlaces;
