import { create } from "zustand";

const useVisitorCount = create((set) => ({
  visitorStats: {
    daily: 0,
    monthly: 0,
    yearly: 0,
    total: 0,
  },
  loader: false,
  setVisitorCount: ({ data, loader }) => {
    set({ visitorStats: data, loader: loader });
  },
}));

export default useVisitorCount;
