import { create } from "zustand";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSchedule,
  deleteSchedule,
  getAllRgSchedules,
  updateSchedule,
} from "@/services/regularSchedule.service";

const useRegularSchedulesStore = create((set) => ({
  message: null,
  error: null,
  loader: false,
  setRgScheduleMessageEmpty: () => set({ message: null, error: null }),
}));

const useRegularSchedules = () => {
  const queryClient = useQueryClient();
  const store = useRegularSchedulesStore();

  const { data: schedulesData, isLoading } = useQuery({
    queryKey: ["rgSchedules"],
    queryFn: getAllRgSchedules,
  });

  const addScheduleMutation = useMutation({
    mutationFn: createSchedule,
    onSuccess: (response) => {
      queryClient.setQueryData(["rgSchedules"], (oldData) => ({
        ...oldData,
        schedules: [response.busSchedule, ...oldData.schedules],
        count: oldData.count + 1,
      }));
      store.setState({ message: response.message });
    },
    onError: (error) => store.setState({ error: error.message }),
  });

  const updateScheduleMutation = useMutation({
    mutationFn: updateSchedule,
    onSuccess: (response) => {
      queryClient.setQueryData(["rgSchedules"], (oldData) => ({
        ...oldData,
        schedules: oldData.schedules.map((schedule) =>
          schedule.id === response.busSchedule.id
            ? response.busSchedule
            : schedule
        ),
      }));
      store.setState({ message: response.message });
    },
    onError: (error) => store.setState({ error: error.message }),
  });

  const removeScheduleMutation = useMutation({
    mutationFn: deleteSchedule,
    onSuccess: (response, scheduleId) => {
      queryClient.setQueryData(["rgSchedules"], (oldData) => ({
        ...oldData,
        schedules: oldData.schedules.filter((item) => item.id !== scheduleId),
        count: oldData.count - 1,
      }));
      store.setState({ message: response.message });
    },
    onError: (error) => store.setState({ error: error.message }),
  });

  return {
    schedules: schedulesData?.schedules || [],
    totalCount: schedulesData?.count || 0,
    searchCount: schedulesData?.searchCount || 0,
    isLoading,
    addSchedule: addScheduleMutation.mutate,
    updateSchedule: updateScheduleMutation.mutate,
    removeSchedule: removeScheduleMutation.mutate,
  };
};

export { useRegularSchedulesStore, useRegularSchedules };
