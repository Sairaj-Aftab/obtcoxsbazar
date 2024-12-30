import { Navigate, Outlet } from "react-router-dom";
import useParibahanAuth from "../store/useParibahanAuth";

const PrivateRouteGird = () => {
  const { paribahanAuth } = useParibahanAuth();

  return paribahanAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRouteGird;
