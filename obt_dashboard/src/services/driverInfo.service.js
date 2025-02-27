import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./url.service";

// Fetch driver info by ID
export const useDriverInfo = ({ id, limit }) => {
  return useQuery({
    queryKey: ["driverInfo", id, limit],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${
          import.meta.env.VITE_API_URL
        }/driverinfo/getbyid/${id}?limit=${limit}`
      );
      return response.data;
    },
    enabled: !!id,
  });
};

// Fetch all driver info
export const useAllDriverInfo = ({ page, limit, search }) => {
  return useQuery({
    queryKey: ["allDriverInfo", page, limit, search],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_API_URL}/driverinfo/getall`,
        { params: { page, limit, search } }
      );
      return response.data;
    },
  });
};

// Create driver info
export const useCreateDriverInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_API_URL}/driverinfo/create`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allDriverInfo"]);
    },
  });
};

// Update driver info
export const useUpdateDriverInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.put(
        `${import.meta.env.VITE_API_URL}/driverinfo/update/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["driverInfo"]);
      queryClient.invalidateQueries(["allDriverInfo"]);
    },
  });
};

// Delete driver info
export const useDeleteDriverInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(
        `${import.meta.env.VITE_API_URL}/driverinfo/delete/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allDriverInfo"]);
    },
  });
};
