import { create } from "zustand";

const useTouristBusPermission = create((set) => ({
  permissions: [],
  count: 0,
  message: null,
  error: null,
  loader: false,
}));

export default useTouristBusPermission;
