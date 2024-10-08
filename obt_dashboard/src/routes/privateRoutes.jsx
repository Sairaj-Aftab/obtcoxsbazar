import PrivateRouteGird from "./PrivateRouteGrid";
import PageLayout from "../components/PageLayout/PageLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import Destination from "../pages/Destination/Destination";
import Notice from "../pages/Notice/Notice";
import Permission from "../pages/Permission/Permission";
import Role from "../pages/Role/Role";
import Users from "../pages/Users/Users";
import DailyBusScheduleList from "../pages/DailyBusScheduleList/DailyBusScheduleList";
import ParibahanUsers from "../pages/ParibahanUsers/ParibahanUsers";
import RegularBusSchedule from "../pages/RegularBusSchedule/RegularBusSchedule";
import BusInfo from "../pages/BusInfo/BusInfo";
import GuideInfo from "../pages/GuideInfo/GuideInfo";
import DriverInfo from "../pages/DriverInfo/DriverInfo";
import Review from "../pages/Review/Review";
import TouristBusPermission from "../pages/TouristBusPermission/TouristBusPermission";

const privateRoutes = [
  {
    element: <PageLayout />,
    children: [
      {
        element: <PrivateRouteGird />,
        children: [
          {
            path: "/",
            element: <Dashboard />,
          },
          {
            path: "/total-bus-schedule-list",
            element: <DailyBusScheduleList />,
          },
          {
            path: "/regular-bus-schedule",
            element: <RegularBusSchedule />,
          },
          {
            path: "/notice",
            element: <Notice />,
          },
          {
            path: "/users",
            element: <Users />,
          },
          {
            path: "/paribahan-users",
            element: <ParibahanUsers />,
          },
          {
            path: "/bus-info",
            element: <BusInfo />,
          },
          {
            path: "/guide-info",
            element: <GuideInfo />,
          },
          {
            path: "/driver-info",
            element: <DriverInfo />,
          },
          {
            path: "/role",
            element: <Role />,
          },
          {
            path: "/permission",
            element: <Permission />,
          },
          {
            path: "/destination",
            element: <Destination />,
          },
          {
            path: "/tourist-bus-permission",
            element: <TouristBusPermission />,
          },
          {
            path: "/review",
            element: <Review />,
          },
        ],
      },
    ],
  },
];

export default privateRoutes;
