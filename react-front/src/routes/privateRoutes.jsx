import Nav from "../components/Nav/Nav";
import ProfileHeader from "../components/ProfileHeader/ProfileHeader";
import BusProfile from "../pages/BusProfile/BusProfile";
import ProfileBusInfo from "../pages/ProfileBusInfo/ProfileBusInfo";
import ProfileDriverInfo from "../pages/ProfileDriverInfo/ProfileDriverInfo";
import ProfileGuideInfo from "../pages/ProfileGuideInfo/ProfileGuideInfo";
import ProfileReview from "../pages/ProfileReview/ProfileReview";
import PrivateRouteGird from "./PrivateRouteGrid";

const privateRoutes = [
  {
    element: <Nav />,
    children: [
      {
        element: <PrivateRouteGird />,
        children: [
          {
            element: <ProfileHeader />,
            children: [
              {
                path: "/profile",
                element: <BusProfile />,
              },
              {
                path: "/profile/bus-info",
                element: <ProfileBusInfo />,
              },
              {
                path: "/profile/guide-info",
                element: <ProfileGuideInfo />,
              },
              {
                path: "/profile/driver-info",
                element: <ProfileDriverInfo />,
              },
              {
                path: "/profile/reviews",
                element: <ProfileReview />,
              },
            ],
          },
        ],
      },
    ],
  },
];

export default privateRoutes;
