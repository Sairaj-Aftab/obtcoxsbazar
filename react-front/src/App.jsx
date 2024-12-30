import { RouterProvider } from "react-router-dom";
import { Helmet } from "react-helmet";
import router from "./routes/router";
import { Toaster } from "react-hot-toast";
import "./App.css";
import { useEffect } from "react";
import socket from "./utils/socket";
import GoogleAnalytics from "./components/GoogleAnalytics";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllBus } from "./services/bus.service";
import {
  getAllRgSchedules,
  getTodaysSchedules,
} from "./services/schedules.service";
import useBusServices from "./store/useBusServices";
import useSchedules from "./store/useSchedules";
import {
  getDestinationPlace,
  getLeavingPlace,
  getParkingPlace,
} from "./services/place.service";
import usePlaces from "./store/usePlaces";
import useNotice from "./store/useNotice";
import {
  getAllParibahanNotice,
  getNoticeFromAdmin,
} from "./services/notice.service";
import {
  getVisitorStats,
  updateVisitorCount,
} from "./services/visitorCount.service";
import useVisitorCount from "./store/useVisitorCount";
import useParibahanAuth from "./store/useParibahanAuth";
function App() {
  const queryClient = useQueryClient();
  const { setLogedInUser } = useParibahanAuth();
  const { setLeavingPlaces, setDestinationPlaces, setParkingPlaces } =
    usePlaces();
  const { setTodaySchedules, setRegularSchedules } = useSchedules();
  const { setBusData } = useBusServices();
  const { setAdminNotices, setParibahanNotices } = useNotice();
  const { setVisitorCount } = useVisitorCount();

  // Get Todays Schedules
  const { data: todaysSchedules, isLoading: todaySchedulesLoading } = useQuery({
    queryKey: ["schedules"],
    queryFn: () => getTodaysSchedules(),
  });
  // Get All Bus
  const {
    data: bus,
    isLoading: busLoading,
    error: busError,
  } = useQuery({
    queryKey: ["busServices"],
    queryFn: getAllBus,
  });
  // Get Leaving Places
  const { data: leavingPlaces, isLoading: leavingPlacesLoading } = useQuery({
    queryKey: ["leavingPlaces"],
    queryFn: getLeavingPlace,
  });
  // Get Destination Places
  const { data: destinationPlaces, isLoading: destinationPlacesLoading } =
    useQuery({
      queryKey: ["destinationPlaces"],
      queryFn: getDestinationPlace,
    });
  // Get Parking Places
  const { data: parkingPlaces, isLoading: parkingPlacesLoading } = useQuery({
    queryKey: ["parkingPlaces"],
    queryFn: getParkingPlace,
  });

  // Get All Regular Schedules
  const { data: rgSchedules, isLoading: rgSchedulesLoading } = useQuery({
    queryKey: ["regularSchedules"],
    queryFn: () => getAllRgSchedules(),
  });
  // Get Admin Notices
  const { data: adminNotices, isLoading: adminNoticesLoading } = useQuery({
    queryKey: ["adminNotices"],
    queryFn: () => getNoticeFromAdmin(),
  });
  // Get Paribahan Notices
  const { data: paribahanNotices, isLoading: paribahanNoticesLoading } =
    useQuery({
      queryKey: ["paribahanNotices"],
      queryFn: () => getAllParibahanNotice(),
    });
  // Get Visitor Count Stats
  const { data: visitorStats, isLoading: visitorStatsLoading } = useQuery({
    queryKey: ["visitorCount"],
    queryFn: () => getVisitorStats(),
  });

  // Get Leaving Place
  useEffect(() => {
    setLeavingPlaces({ data: leavingPlaces, loader: leavingPlacesLoading });
  }, [leavingPlaces, leavingPlacesLoading, setLeavingPlaces]);
  // Get Destination Place
  useEffect(() => {
    setDestinationPlaces({
      data: destinationPlaces,
      loader: destinationPlacesLoading,
    });
  }, [destinationPlaces, destinationPlacesLoading, setDestinationPlaces]);
  // Get Parking Place
  useEffect(() => {
    setParkingPlaces({ data: parkingPlaces, loader: parkingPlacesLoading });
  }, [parkingPlaces, parkingPlacesLoading, setParkingPlaces]);
  // Todays Schedule
  useEffect(() => {
    setTodaySchedules({ data: todaysSchedules, loader: todaySchedulesLoading });
  }, [todaysSchedules, todaySchedulesLoading, setTodaySchedules]);
  // Get Bus Data
  useEffect(() => {
    setBusData({ data: bus, loader: busLoading, error: busError });
  }, [bus, busLoading, busError, setBusData]);

  // Regular Schedule
  useEffect(() => {
    setRegularSchedules({ data: rgSchedules, loader: rgSchedulesLoading });
  }, [rgSchedules, rgSchedulesLoading, setRegularSchedules]);
  // Get Admin Notices
  useEffect(() => {
    setAdminNotices({ data: adminNotices, loader: adminNoticesLoading });
  }, [adminNotices, adminNoticesLoading, setAdminNotices]);
  // Get Paribahan Notices
  useEffect(() => {
    setParibahanNotices({
      data: paribahanNotices,
      loader: paribahanNoticesLoading,
    });
  }, [paribahanNotices, paribahanNoticesLoading, setParibahanNotices]);

  useEffect(() => {
    setVisitorCount({
      data: visitorStats,
      loader: visitorStatsLoading,
    });
  }, [setVisitorCount, visitorStats, visitorStatsLoading]);
  const { mutateAsync: updateCount } = useMutation({
    mutationFn: updateVisitorCount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitorCount"] });
    },
  });
  useEffect(() => {
    if (import.meta.env.VITE_NODE_ENV !== "Development") {
      updateCount();
    }
  }, [updateCount]);
  useEffect(() => {
    const fetchUser = async () => {
      await setLogedInUser();
    };
    fetchUser();
  }, [setLogedInUser]);
  useEffect(() => {
    // Listen for updates
    socket.on("data-updated", (updatedData) => {
      queryClient.setQueryData(
        ["schedules"],
        (oldData = { schedules: [] }) => ({
          ...oldData,
          schedules: oldData.schedules.map((item) =>
            item.id === updatedData.id ? updatedData : item
          ),
        })
      );
    });

    // Listen for new data
    socket.on("data-created", (newData) => {
      queryClient.setQueryData(
        ["schedules"],
        (oldData = { schedules: [] }) => ({
          ...oldData,
          schedules: [...oldData.schedules, newData],
        })
      );
    });

    // Listen for deletions
    socket.on("data-deleted", (deletedId) => {
      queryClient.setQueryData(
        ["schedules"],
        (oldData = { schedules: [] }) => ({
          ...oldData,
          schedules: oldData.schedules.filter(
            (item) => item.id !== deletedId.id
          ),
        })
      );
    });

    // Clean up socket listeners on component unmount
    return () => {
      socket.off("data-updated");
      socket.off("data-created");
      socket.off("data-deleted");
    };
  }, [queryClient]);
  return (
    <>
      <Helmet>
        <title>
          Online Bus Terminal (OBT) - Smart Bus Travel in Cox&apos;s Bazar
        </title>
        <meta
          name="description"
          content="Welcome to Online Bus Terminal in Cox's Bazar. Discover the convenience of smart bus travel with our digital platform, offering easy booking, real-time updates, fare comparisons, and more. Enjoy a seamless travel experience with features like seat selection, schedule information, and 24/7 customer service. Explore our platform to find all bus services, destinations, and special offers, and connect with local and tourism industries for a safer, efficient, and enjoyable journey."
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
      <RouterProvider router={router}>
        <GoogleAnalytics />
      </RouterProvider>
    </>
  );
}

export default App;
