import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./url.service";

// Fetch all reviews with pagination and search
export const useGetAllAlarm = ({ page, limit, search }) => {
  return useQuery({
    queryKey: ["alarms", page, limit, search],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_API_URL}/alarm`,
        { params: { page, limit, search } }
      );
      return response.data;
    },
  });
};

// Delete a review
export const useDeleteAlarm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(
        `${import.meta.env.VITE_API_URL}/alarm/delete/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["alarms"]);
    },
  });
};
