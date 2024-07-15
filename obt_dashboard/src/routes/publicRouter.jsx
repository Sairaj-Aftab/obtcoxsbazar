import Login from "../pages/Auth/Login";
import PublicRouteGrid from "./PublicRouteGrid";

const publicRoutes = [
  {
    element: <PublicRouteGrid />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
];

export default publicRoutes;
