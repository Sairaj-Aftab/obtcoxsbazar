import axios from "axios";

export const getLostAndFoundEntry = async ({
  page,
  limit,
  reportType,
  search,
}) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/lost-found`,
      {
        params: { page, limit, reportType, search },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const createLostAndFoundEntry = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/lost-found/create`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
