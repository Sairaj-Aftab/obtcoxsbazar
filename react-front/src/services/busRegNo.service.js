import axios from "axios";

export const getBusRegNo = async ({ id, page, limit, search }) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/businfo/${id}`,
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

export const createBusRegNo = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/businfo/createbusinfo`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const updateBusRegNo = async ({ id, data }) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/businfo/update/${id}`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
