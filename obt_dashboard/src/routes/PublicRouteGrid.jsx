import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRouteGrid = () => {
  const { authUser } = useSelector((state) => state.auth);
  if (localStorage.getItem("authUser")) {
    return authUser ? <Navigate to="/" /> : <Outlet />;
  }
  return <Outlet />;
};

export default PublicRouteGrid;
