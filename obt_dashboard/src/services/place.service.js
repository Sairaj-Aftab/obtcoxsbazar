import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./url.service";

// Create Place
export const useCreatePlace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post(`/place`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["places"]);
    },
  });
};

// Update Place
export const useUpdatePlace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.put(`/place/update/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["places"]);
    },
  });
};

// Get All Places
export const useGetAllPlaces = () => {
  return useQuery({
    queryKey: ["places"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/place`);
      return response.data;
    },
  });
};

// Get Leaving Places
export const useGetLeavingPlaces = () => {
  return useQuery({
    queryKey: ["leavingPlaces"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/place/leave`);
      return response.data;
    },
  });
};

// Get Destination Places
export const useGetDestinationPlaces = () => {
  return useQuery({
    queryKey: ["destinationPlaces"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/place/destination`);
      return response.data;
    },
  });
};

// Get Parking Places
export const useGetParkingPlaces = () => {
  return useQuery({
    queryKey: ["parkingPlaces"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/place/parking`);
      return response.data;
    },
  });
};

// Delete Place
export const useDeletePlace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/place/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["places"]);
    },
  });
};
