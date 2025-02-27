import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./url.service";

// Fetch all tourist bus permissions
export const useAllLostFound = ({ page, limit, filters }) => {
  return useQuery({
    queryKey: ["allLostFound", page, limit, filters],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_API_URL}/lost-found`,
        { params: { page, limit, ...filters } }
      );
      return response.data;
    },
  });
};

// Update tourist bus permission
export const useUpdateLostFound = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, rejectedReason }) => {
      const response = await axiosInstance.put(
        `${import.meta.env.VITE_API_URL}/tourist-permission/update/${id}`,
        { status, rejectedReason }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allTouristBusPermission"]);
    },
  });
};
