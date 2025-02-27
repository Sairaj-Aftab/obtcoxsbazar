import { create } from "zustand";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteSchedule,
  getAllSchedules,
  getTodaysSchedule,
} from "@/services/schedule.service";

const useSchedulesStore = create((set) => ({
  message: null,
  error: null,
  loader: false,
  todayLoader: false,
  setMessageEmpty: () => set({ message: null, error: null }),
}));

const useSchedules = ({ page, limit, search }) => {
  console.log(page, limit, search);

  const queryClient = useQueryClient();
  const store = useSchedulesStore();

  const { data: schedulesData, isLoading } = useQuery({
    queryKey: ["schedules", page, limit, search], // Include dynamic parameters
    queryFn: () => getAllSchedules({ page, limit, search }),
  });

  const { data: todaySchedulesData, isLoading: isTodayLoading } = useQuery({
    queryKey: ["todaySchedules", page, limit, search],
    queryFn: () => getTodaysSchedule({ page, limit, search }),
  });

  const removeScheduleMutation = useMutation({
    mutationFn: deleteSchedule,
    onSuccess: (response, scheduleId) => {
      queryClient.setQueryData(
        ["schedules", page, limit, search],
        (oldData) => ({
          ...oldData,
          schedules: oldData.schedules.filter((item) => item.id !== scheduleId),
          totalScheduleCount: oldData.totalScheduleCount - 1,
        })
      );
      store.setState({ message: response.message });
    },
    onError: (error) => store.setState({ error: error.message }),
  });

  return {
    schedules: schedulesData?.schedules || [],
    totalScheduleCount: schedulesData?.count || 0,
    searchCount: schedulesData?.searchCount || 0,
    todaySchedule: todaySchedulesData?.schedules || [],
    todayTotalCount: todaySchedulesData?.count || 0,
    todaySearchCount: todaySchedulesData?.searchCount || 0,
    isLoading,
    isTodayLoading,
    removeSchedule: removeScheduleMutation.mutate,
  };
};

export { useSchedulesStore, useSchedules };
