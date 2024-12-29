import { create } from "zustand";

const useBusServices = create((set) => ({
  busData: null,
  busInfo: null,
  totalReviewCount: 0,
  averageRating: 0,
  message: null,
  error: null,
  loader: false,
  busInfoLoader: false,
  setBusData: ({ data, loader, error, message }) =>
    set({ busData: data, loader, error, message }),
}));

export default useBusServices;
