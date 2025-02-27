import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./url.service";

// Fetch Paribahan Users
export const useParibahanUsers = ({ search }) => {
  return useQuery({
    queryKey: ["paribahanUsers", search],
    queryFn: async () => {
      const response = await axiosInstance.get(`/paribahan`, {
        params: { search },
      });
      return response.data;
    },
  });
};

// Create Paribahan User
export const useCreateParibahanUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ authUserId, data }) => {
      const response = await axiosInstance.post(
        `/paribahan/register/${authUserId}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["paribahanUsers"]);
    },
  });
};

// Update Paribahan User
export const useUpdateParibahanUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.put(`/paribahan/update/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["paribahanUsers"]);
    },
  });
};

// Delete Paribahan User
export const useDeleteParibahanUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/paribahan/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["paribahanUsers"]);
    },
  });
};
