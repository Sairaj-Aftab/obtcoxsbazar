import axios from "axios";

export const createSchedule = async ({ id, data }) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/schedule/${id}`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const updateSchedule = async ({ id, data }) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/schedule/update/${id}`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getTodaysSchedules = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/schedule/todays`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getSchedulesDataByAuthId = async ({ id, page, limit, search }) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/schedule/getbyparibahan/${id}`,
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

export const deleteSchedule = async (id) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/schedule/delete/${id}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// Regular Schedules
export const getAllRgSchedules = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/rgschedule`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getRgSchedulesByParibahanId = async ({
  id,
  page,
  limit,
  search,
}) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/rgschedule/getbyparibahanid/${id}`,
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
