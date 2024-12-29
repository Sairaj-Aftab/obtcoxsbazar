import { create } from "zustand";

const useSchedules = create((set) => ({
  todaySchedules: null,
  regularSchedules: null,
  paribahanRgSchedules: null,
  authParibahanRgSchedules: null,
  todayScheduleLoader: false,
  regularScheduleLoader: false,
  setTodaySchedules: ({ data, loader }) => {
    set({ todaySchedules: data, todayScheduleLoader: loader });
  },
  setRegularSchedules: ({ data, loader }) => {
    set({ regularSchedules: data, regularScheduleLoader: loader });
  },
}));

export default useSchedules;
