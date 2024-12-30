import axios from "axios";

export const getVisitorStats = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/visitorcount`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const updateVisitorCount = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/visitorcount`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
