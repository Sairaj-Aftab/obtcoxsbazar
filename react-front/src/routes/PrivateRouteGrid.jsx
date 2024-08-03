import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { paribahanAuthData } from "../features/paribahanAuth/paribahanAuthSlice";

const PrivateRouteGird = () => {
  const { paribahanAuth } = useSelector(paribahanAuthData);

  return paribahanAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRouteGird;
