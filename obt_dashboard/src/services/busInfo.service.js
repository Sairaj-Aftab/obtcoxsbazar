import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./url.service";

// Get a single bus info
export const useGetBusInfo = ({ id, page, limit, search }) => {
  return useQuery({
    queryKey: ["busInfo", id, page, limit, search],
    queryFn: async () => {
      const response = await axiosInstance.get(`/businfo/${id}`, {
        params: { page, limit, search },
      });
      return response.data;
    },
  });
};

// Get all bus info
export const useGetAllBusInfo = ({ page, limit, search }) => {
  return useQuery({
    queryKey: ["busInfoList", page, limit, search],
    queryFn: async () => {
      const response = await axiosInstance.get(`/businfo/getall`, {
        params: { page, limit, search },
      });
      return response.data;
    },
    keepPreviousData: true, // Helps with smoother pagination
  });
};

// Create a new bus info
export const useCreateBusInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.post(
        `/businfo/createbusinfo/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["busInfoList"]);
    },
  });
};

// Update existing bus info
export const useUpdateBusInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.put(`/businfo/update/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["busInfoList"]);
      // eslint-disable-next-line no-undef
      queryClient.invalidateQueries(["busInfo"]);
    },
  });
};

// Delete a bus info
export const useDeleteBusInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/businfo/delete/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["busInfoList"]);
    },
  });
};
