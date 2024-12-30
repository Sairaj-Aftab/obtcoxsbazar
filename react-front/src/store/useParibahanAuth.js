import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const useParibahanAuth = create(
  persist(
    (set) => ({
      paribahanAuth: null,
      loader: false,
      message: null,
      error: null,

      setParibahanAuthMessageEmpty: () => {
        set({ loader: false, message: null, error: null });
      },

      setLogin: async (data) => {
        set({ loader: true, error: null });
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/paribahan/login`,
            data,
            { withCredentials: true }
          );
          set({
            paribahanAuth: response.data.user,
          });
        } catch (error) {
          set({
            error: error.response?.data?.message,
            paribahanAuth: null,
          });
        } finally {
          set({ loader: false });
        }
      },

      setLogedInUser: async () => {
        set({ loader: true, error: null });
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/paribahan/me`,
            { withCredentials: true }
          );
          set({ paribahanAuth: response.data });
        } catch (error) {
          set({
            paribahanAuth: null,
          });
        } finally {
          set({ loader: false });
        }
      },

      setLogout: async () => {
        set({ loader: true, error: null });
        try {
          await axios.post(
            `${import.meta.env.VITE_API_URL}/paribahan/logout`,
            {},
            { withCredentials: true }
          );
          set({ paribahanAuth: null });
          localStorage.removeItem("paribahan-auth");
          // eslint-disable-next-line no-undef
          setParibahanAuthMessageEmpty();
        } catch (error) {
          set({
            error: error.response?.data?.message,
          });
        } finally {
          set({ loader: false });
        }
      },
    }),
    {
      name: "paribahan-auth", // Key under which the state will be saved in localStorage
      storage: {
        getItem: (key) => JSON.parse(localStorage.getItem(key)),
        setItem: (key, value) =>
          localStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => localStorage.removeItem(key),
      }, // Can also use sessionStorage
    }
  )
);

export default useParibahanAuth;
