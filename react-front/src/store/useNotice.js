import { create } from "zustand";

const useNotice = create((set) => ({
  paribahanNotices: null,
  adminNotices: null,
  paribahanNoticesLoader: false,
  adminNoticesLoader: false,
  setParibahanNotices: ({ data, loader }) => {
    set({ paribahanNotices: data, paribahanNoticesLoader: loader });
  },
  setAdminNotices: ({ data, loader }) => {
    set({ adminNotices: data, adminNoticesLoader: loader });
  },
}));

export default useNotice;
