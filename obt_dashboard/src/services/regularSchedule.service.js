import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./url.service";

// Create Schedule
export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.post(
        `/rgschedule/create/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["rgschedules"]);
    },
  });
};

// Update Schedule
export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, paribahanId, data }) => {
      const response = await axiosInstance.put(`/rgschedule/update/${id}`, {
        paribahanId,
        ...data,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["rgschedules"]);
    },
  });
};

// Get All Schedules
export const useGetAllRgSchedules = ({ page, limit, search }) => {
  return useQuery({
    queryKey: ["rgschedules", page, limit, search],
    queryFn: async () => {
      const response = await axiosInstance.get(`/rgschedule`, {
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
      const response = await axiosInstance.delete(`/rgschedule/delete/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["rgschedules"]);
    },
  });
};
