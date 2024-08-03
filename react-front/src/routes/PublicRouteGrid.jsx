import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { paribahanAuthData } from "../features/paribahanAuth/paribahanAuthSlice";

const PublicRouteGrid = () => {
  const { paribahanAuth } = useSelector(paribahanAuthData);
  if (localStorage.getItem("paribahanAuth")) {
    return paribahanAuth ? <Navigate to="/" /> : <Outlet />;
  }
  return <Outlet />;
};

export default PublicRouteGrid;
