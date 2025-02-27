import axiosInstance from "./url.service";

export const getDataCount = async () => {
  try {
    const response = await axiosInstance.get(`/info`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
