import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import { useDispatch } from "react-redux";
import "./App.css";
import { useEffect } from "react";
import socket from "./utils/socket";
import {
  getDestinationPlace,
  getLeavingPlace,
  getSchedulesDataByLimit,
  getTodaysSchedules,
} from "./features/schedules/schedulesApiSlice";
import { getAllBusServices } from "./features/bus/busApiSlice";
import {
  getAllParibahanNotice,
  getNoticeFromAdmin,
} from "./features/notice/noticeApiSlice";
import {
  addScheduleSocket,
  deleteScheduleSocket,
  updateScheduleSocket,
} from "./features/schedules/schedulesSlice";
import { getLogedInUser } from "./features/paribahanAuth/paribahanAuthApiSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("paribahanAuth")) {
      dispatch(getLogedInUser());
    }
    dispatch(getTodaysSchedules(500));
    dispatch(getSchedulesDataByLimit(500));
    dispatch(getLeavingPlace());
    dispatch(getDestinationPlace());
    dispatch(getAllBusServices());
    dispatch(getNoticeFromAdmin());
    dispatch(getAllParibahanNotice());
    // Listen for updates
    socket.on("data-updated", (updatedData) => {
      dispatch(updateScheduleSocket(updatedData));
    });

    // Listen for new data
    socket.on("data-created", (newData) => {
      dispatch(addScheduleSocket(newData));
    });

    // Listen for deletions
    socket.on("data-deleted", (deletedId) => {
      dispatch(deleteScheduleSocket(deletedId));
    });

    // Clean up socket listeners on component unmount
    return () => {
      socket.off("data-updated");
      socket.off("data-created");
      socket.off("data-deleted");
    };
  }, [dispatch]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
