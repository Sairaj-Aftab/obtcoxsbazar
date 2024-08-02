import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRouteGird = () => {
  const { authUser } = useSelector((state) => state.auth);

  return authUser ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRouteGird;
