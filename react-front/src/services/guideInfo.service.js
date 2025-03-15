import axios from "axios";

export const getGuideInfo = async ({ id, page, limit, search }) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/guideinfo/getbyid/${id}`,
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

export const createGuideInfo = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/guideinfo/create`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const updateGuideInfo = async ({ id, data }) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/guideinfo/update/${id}`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
