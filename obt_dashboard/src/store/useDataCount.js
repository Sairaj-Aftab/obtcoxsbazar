import { create } from "zustand";

const useDataCount = create((set) => ({
  dataCount: null,
  isLoading: false,
  setDataCount: ({ data, isLoading }) => {
    set({ dataCount: data, isLoading });
  },
}));

export default useDataCount;
