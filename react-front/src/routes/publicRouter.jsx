import Home from "../pages/Home/Home";
import PublicRouteGrid from "./PublicRouteGrid";

const publicRoutes = [
  {
    // element: <PublicRouteGrid />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
];

export default publicRoutes;
