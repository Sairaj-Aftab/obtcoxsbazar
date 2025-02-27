import useAuth from "@/store/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const PublicRouteGrid = () => {
  const { authUser } = useAuth();
  if (localStorage.getItem("authUser")) {
    return authUser ? <Navigate to="/" /> : <Outlet />;
  }
  return <Outlet />;
};

export default PublicRouteGrid;
