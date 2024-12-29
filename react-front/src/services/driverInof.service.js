import axios from "axios";

export const getDriverInfo = async ({ id, page, limit, search }) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/driverinfo/getbyid/${id}`,
      {
        params: { page, limit, search },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const createDriverInfo = async ({ id, data }) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/driverinfo/create/${id}`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const updateDriverInfo = async ({ id, data }) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/driverinfo/update/${id}`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
