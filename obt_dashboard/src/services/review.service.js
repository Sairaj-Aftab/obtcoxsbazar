import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./url.service";

// Fetch all reviews with pagination and search
export const useGetAllReview = ({ page, limit, search }) => {
  return useQuery({
    queryKey: ["reviews", page, limit, search],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_API_URL}/review`,
        { params: { page, limit, search } }
      );
      return response.data;
    },
  });
};

// Delete a review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(
        `${import.meta.env.VITE_API_URL}/review/delete/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]);
    },
  });
};
