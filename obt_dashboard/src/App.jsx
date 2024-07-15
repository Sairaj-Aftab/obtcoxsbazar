import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import router from "./routes/router";
import { useDispatch } from "react-redux";
import { getLogedInUser } from "./features/auth/authApiSlice";
import {
  getAllAuthUser,
  getAllPermission,
  getAllRoles,
  getParibahanUser,
} from "./features/user/userApiSllice";
import "./App.css";
import {
  getAllPlace,
  getDestinationPlaces,
  getLeavingPlaces,
} from "./features/place/placeApiSlice";
import { getAllSchedules } from "./features/schedules/schedulesApiSlice";
import {
  getAllParibahanNotice,
  getAuthNotice,
} from "./features/notice/noticeApiSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      dispatch(getLogedInUser());
    }
    dispatch(getAllSchedules());
    dispatch(getAllPermission());
    dispatch(getAllRoles());
    dispatch(getAllAuthUser());
    dispatch(getParibahanUser());
    dispatch(getAllPlace());
    dispatch(getLeavingPlaces());
    dispatch(getDestinationPlaces());
    dispatch(getAuthNotice());
    dispatch(getAllParibahanNotice());
  }, [dispatch]);
  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
