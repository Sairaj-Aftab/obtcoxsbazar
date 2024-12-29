import axios from "axios";

export const getSingleSettingByName = async (name) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/setting/getsingle/${name}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
