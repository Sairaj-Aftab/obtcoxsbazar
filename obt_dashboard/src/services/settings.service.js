import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./url.service";

// Fetch all settings
export const useAllSettings = () => {
  return useQuery({
    queryKey: ["allSettings"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_API_URL}/setting`
      );
      return response.data;
    },
  });
};

// Update setting
export const useUpdateSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.put(
        `${import.meta.env.VITE_API_URL}/setting/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allSettings"]);
    },
  });
};
