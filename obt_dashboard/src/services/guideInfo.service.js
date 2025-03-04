import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./url.service";

// Fetch guide info by Paribahan ID
export const useGuideInfo = ({ id, limit }) => {
  return useQuery({
    queryKey: ["guideInfo", id, limit],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_API_URL}/guideinfo/getbyid/${id}?limit=${limit}`
      );
      return response.data;
    },
    enabled: !!id, // Prevent query execution if ID is not provided
  });
};

// Fetch all guide info
export const useAllGuideInfo = ({ page, limit, search }) => {
  return useQuery({
    queryKey: ["allGuideInfo", page, limit, search],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_API_URL}/guideinfo/getall`,
        { params: { page, limit, search } }
      );
      return response.data;
    },
  });
};

// Create guide info
export const useCreateGuideInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_API_URL}/guideinfo/create/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allGuideInfo"]); // Refetch guide info list
    },
  });
};

// Update guide info
export const useUpdateGuideInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.put(
        `${import.meta.env.VITE_API_URL}/guideinfo/update/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["guideInfo"]);
      queryClient.invalidateQueries(["allGuideInfo"]);
    },
  });
};

// Delete guide info
export const useDeleteGuideInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(
        `${import.meta.env.VITE_API_URL}/guideinfo/delete/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allGuideInfo"]);
    },
  });
};
