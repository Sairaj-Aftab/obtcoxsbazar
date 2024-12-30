import axios from "axios";

export const getNoticeFromAdmin = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/notice/getalladmin`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getAllParibahanNotice = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/notice/getallparibahan`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const createParibahanNotice = async ({ id, data }) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/notice/createparibahan/${id}`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const deleteNotice = async (id) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/notice/deleteparibahan/${id}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
