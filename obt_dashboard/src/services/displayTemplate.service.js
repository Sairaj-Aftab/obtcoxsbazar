import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./url.service";

// Get a single bus info
export const useGetTemplate = ({ id, page, limit, search }) => {
  return useQuery({
    queryKey: ["template", id, page, limit, search],
    queryFn: async () => {
      const response = await axiosInstance.get(`/businfo/${id}`, {
        params: { page, limit, search },
      });
      return response.data;
    },
  });
};

// Get all bus info
export const useGetAllTemplate = () => {
  return useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/template/getall`);
      return response.data;
    },
    keepPreviousData: true, // Helps with smoother pagination
  });
};

// Create a new bus info
export const useCreateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data }) => {
      const response = await axiosInstance.post(`/template/create`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["templates"]);
    },
  });
};

// Update existing bus info
export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.put(`/template/update/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["template"]);
      // eslint-disable-next-line no-undef
      queryClient.invalidateQueries(["templates"]);
    },
  });
};

// Delete a bus info
export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/template/delete/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["templates"]);
    },
  });
};
