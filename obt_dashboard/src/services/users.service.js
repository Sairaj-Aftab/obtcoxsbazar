import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./url.service";

// Fetch all permissions
export const useAllPermissions = () => {
  return useQuery({
    queryKey: ["allPermissions"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_API_URL}/permission`
      );
      return response.data;
    },
  });
};

// Create permission
export const useCreatePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name) => {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_API_URL}/permission`,
        { name }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allPermissions"]);
    },
  });
};

// Update permission status
export const useUpdatePermissionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await axiosInstance.put(
        `${import.meta.env.VITE_API_URL}/permission/status/${id}`,
        { status }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allPermissions"]);
    },
  });
};

// Delete permission
export const useDeletePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(
        `${import.meta.env.VITE_API_URL}/permission/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allPermissions"]);
    },
  });
};

// Fetch all roles
export const useAllRoles = () => {
  return useQuery({
    queryKey: ["allRoles"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_API_URL}/role`
      );
      return response.data;
    },
  });
};

// Create role
export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_API_URL}/role`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allRoles"]);
    },
  });
};

// Update role status
export const useUpdateRoleStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await axiosInstance.put(
        `${import.meta.env.VITE_API_URL}/role/status/${id}`,
        { status }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allRoles"]);
    },
  });
};

// Edit role
export const useEditRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.put(
        `${import.meta.env.VITE_API_URL}/role/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allRoles"]);
    },
  });
};

// Fetch all auth users
export const useAllAuthUsers = () => {
  return useQuery({
    queryKey: ["allAuthUsers"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_API_URL}/auth`
      );
      return response.data;
    },
  });
};

// Create auth user
export const useCreateAuthUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_API_URL}/auth`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allAuthUsers"]);
    },
  });
};

// Update auth user
export const useUpdateAuthUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.put(
        `${import.meta.env.VITE_API_URL}/auth/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allAuthUsers"]);
    },
  });
};

// Delete auth user
export const useDeleteAuthUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(
        `${import.meta.env.VITE_API_URL}/auth/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allAuthUsers"]);
    },
  });
};
