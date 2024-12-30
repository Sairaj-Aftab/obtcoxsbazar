import axios from "axios";

export const getDestinationPlace = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/place/destination`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getLeavingPlace = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/place/leave`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getParkingPlace = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/place/parking`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
