import { RouterProvider } from "react-router-dom";
import { Helmet } from "react-helmet";
import router from "./routes/router";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import "./App.css";
import { useEffect } from "react";
import socket from "./utils/socket";
import {
  getDestinationPlace,
  getLeavingPlace,
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
import { getAllRgSchedules } from "./features/regularBusSchedule/regularBusScheduleApiSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("paribahanAuth")) {
      dispatch(getLogedInUser());
    }
    dispatch(getTodaysSchedules({ page: 1, limit: 1000 }));
    dispatch(getAllRgSchedules({ page: 1, limit: 1000 }));
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
      <Helmet>
        <title>
          Online Bus Terminal (OBT) - Smart Bus Travel in Cox&apos;s Bazar
        </title>
        <meta
          name="description"
          content="Welcome to Online Bus Terminal (OBT) in Cox's Bazar. Discover the convenience of smart bus travel with our digital platform, offering easy booking, real-time updates, fare comparisons, and more. Enjoy a seamless travel experience with features like seat selection, schedule information, and 24/7 customer service. Explore our platform to find all bus services, destinations, and special offers, and connect with local and tourism industries for a safer, efficient, and enjoyable journey."
        />
        {/* Meta tags for Facebook */}
        <meta
          property="og:title"
          content="Online Bus Terminal (OBT) - Smart Bus Travel in Cox's Bazar"
        />
        <meta
          property="og:description"
          content="Welcome to Online Bus Terminal (OBT) in Cox's Bazar. Discover the convenience of smart bus travel with our digital platform, offering easy booking, real-time updates, fare comparisons, and more. Enjoy a seamless travel experience with features like seat selection, schedule information, and 24/7 customer service. Explore our platform to find all bus services, destinations, and special offers."
        />
        <meta
          property="og:image"
          content="https://obtcoxsbazar.com/assets/red_yellow-BeM2oZga.png"
        />
        <meta property="og:url" content="https://www.obtcoxsbazar.com" />
        <meta property="og:type" content="website"></meta>
        {/* Meta tags for twitter */}
        <meta
          name="twitter:card"
          content="https://obtcoxsbazar.com/assets/red_yellow-BeM2oZga.png"
        />
        <meta
          name="twitter:title"
          content="Online Bus Terminal (OBT) - Smart Bus Travel in Cox's Bazar"
        />
        <meta
          name="twitter:description"
          content="Welcome to Online Bus Terminal (OBT) in Cox's Bazar. Discover the convenience of smart bus travel with our digital platform, offering easy booking, real-time updates, fare comparisons, and more. Enjoy a seamless travel experience with features like seat selection, schedule information, and 24/7 customer service."
        />
        <meta
          name="twitter:image"
          content="https://obtcoxsbazar.com/assets/red_yellow-BeM2oZga.png"
        />
      </Helmet>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
