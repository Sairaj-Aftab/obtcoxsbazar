import LostAndFoundList from "@/pages/LostAndFound/LostAndFoundList";
import Nav from "../components/Nav/Nav";
import TouristBusEntryPerHeader from "../components/TouristBusEntryPerHeader";
import AboutPage from "../pages/AboutPage/AboutPage";
import AllBusServices from "../pages/AllBusServices/AllBusServices";
import AllSchedules from "../pages/AllSchedules/AllSchedules";
import BusComReviewByQR from "../pages/BusComReviewByQR/BusComReviewByQR";
import BusInfo from "../pages/BusInfo/BusInfo";
import BusInformation from "../pages/BusInformation/BusInformation";
import BusServicesByPlace from "../pages/BusServicesByPlace/BusServicesByPlace";
import ContactUs from "../pages/ContactUs/ContactUs";
import Display from "../pages/Display/Display";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import RegularBusSchedule from "../pages/RegularBusSchedule/RegularBusSchedule";
import TouristBusEntryPermission from "../pages/TouristBusEntryPermission/TouristBusEntryPermission";
import TouristBusEntryPermissionList from "../pages/TouristBusEntryPermission/TouristBusEntryPermissionList";
import LostAndFoundEntry from "@/pages/LostAndFound/LostAndFoundEntry";
import LostAndFoundHeader from "@/components/LostAndFoundHeader";

const publicRoutes = [
  {
    element: <Nav />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/all-bus-services",
        element: <AllBusServices title="All Bus Services" />,
      },
      {
        path: "/all-bus-services/:slug/:id",
        element: <BusInformation />,
      },
      {
        path: "/:place/:id",
        element: <BusServicesByPlace />,
      },
      {
        path: "/all-bus-schedules",
        element: <AllSchedules />,
      },
      {
        path: "/all-regular-schedules",
        element: <RegularBusSchedule />,
      },
      {
        element: <TouristBusEntryPerHeader />,
        children: [
          {
            path: "/tourist-bus-entry-permission",
            element: <TouristBusEntryPermissionList />,
          },
          {
            path: "/tourist-bus-entry-permission/form",
            element: <TouristBusEntryPermission />,
          },
        ],
      },
      {
        element: <LostAndFoundHeader />,
        children: [
          {
            path: "/lost-found",
            element: <LostAndFoundList />,
          },
          {
            path: "/lost-found/form",
            element: <LostAndFoundEntry />,
          },
        ],
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/contact-us",
        element: <ContactUs />,
      },
      {
        path: "/display",
        element: <Display />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/bus/info/:slug/:id",
        element: <BusInfo />,
      },
      {
        path: "/bus/comp/:slug/:id",
        element: <BusComReviewByQR />,
      },
    ],
  },
];

export default publicRoutes;
