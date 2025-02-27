import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./url.service";

// Get All Schedules
export const useGetAllSchedules = ({ page = 1, limit = 10, search }) => {
  return useQuery({
    queryKey: ["schedules", page, limit, search],
    queryFn: async () => {
      const response = await axiosInstance.get(`/schedule`, {
        params: { page, limit, search },
      });
      return response.data;
    },
  });
};

// Get Today's Schedule
export const useGetTodaysSchedule = ({ page = 1, limit = 10, search }) => {
  return useQuery({
    queryKey: ["todaysSchedule", page, limit, search],
    queryFn: async () => {
      const response = await axiosInstance.get(`/schedule/todays`, {
        params: { page, limit, search },
      });
      return response.data;
    },
  });
};

// Delete Schedule
export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/schedule/delete/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["schedules"]);
      queryClient.invalidateQueries(["todaysSchedule"]);
    },
  });
};
