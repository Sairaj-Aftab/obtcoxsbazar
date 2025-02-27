import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./url.service";

// Create Admin Notice
export const useCreateAuthNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.post(
        `/notice/createadmin/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries(["authNotices"]),
  });
};

// Get All Paribahan Notices
export const useGetAllParibahanNotice = () => {
  return useQuery({
    queryKey: ["paribahanNotices"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/notice/getallparibahan`);
      return response.data;
    },
  });
};

// Get Admin Notices
export const useGetAuthNotice = () => {
  return useQuery({
    queryKey: ["authNotices"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/notice/getalladmin`);
      return response.data;
    },
  });
};

// Update Admin Notice
export const useUpdateAdminNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, title }) => {
      const response = await axiosInstance.put(
        `/notice/updateadminnotice/${id}`,
        { title }
      );
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries(["authNotices"]),
  });
};

// Update Paribahan Notice
export const useUpdateParibahanNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, title }) => {
      const response = await axiosInstance.put(
        `/notice/updateparibahannotice/${id}`,
        { title }
      );
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries(["paribahanNotices"]),
  });
};

// Delete Admin Notice
export const useDeleteAuthNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/notice/deleteadmin/${id}`);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries(["authNotices"]),
  });
};

// Delete Paribahan Notice
export const useDeleteParibahanNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(
        `/notice/deleteparibahan/${id}`
      );
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries(["paribahanNotices"]),
  });
};
