import axios from "axios";

export const getAllBus = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/paribahan`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getSingleBusData = async (id) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/paribahan/getsingle/${id}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
