import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const busTypes = [
  { id: "1", value: 1, label: "Non-AC" },
  { id: "2", value: 2, label: "AC" },
  { id: "3", value: 3, label: "Sleeper Coach" },
  { id: "4", value: 4, label: "Double-decker" },
  { id: "5", value: 5, label: "Suite Class" },
  { id: "6", value: 6, label: "Hyundai Biz Class" },
  { id: "7", value: 7, label: "Mercedes-Benz" },
  { id: "8", value: 8, label: "Local Service" },
];
