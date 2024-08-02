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
import { getAllBusInfo } from "./features/busInfo/busInfoApiSlice";
import { getAllGuideInfo } from "./features/guideInfo/guideInfoApiSlice";
import { getAllDriverInfo } from "./features/driverInfo/driverInfoApiSlice";
import { getAllRgSchedules } from "./features/regularSchedule/regularScheduleApiSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      dispatch(getLogedInUser());
    }
    dispatch(getAllSchedules());
    dispatch(getAllRgSchedules());
    dispatch(getAllPermission());
    dispatch(getAllRoles());
    dispatch(getAllAuthUser());
    dispatch(getParibahanUser());
    dispatch(getAllPlace());
    dispatch(getLeavingPlaces());
    dispatch(getDestinationPlaces());
    dispatch(getAuthNotice());
    dispatch(getAllParibahanNotice());
    dispatch(getAllBusInfo(100));
    dispatch(getAllGuideInfo(100));
    dispatch(getAllDriverInfo(100));
    dispatch(getAllRgSchedules(101));
  }, [dispatch]);
  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
