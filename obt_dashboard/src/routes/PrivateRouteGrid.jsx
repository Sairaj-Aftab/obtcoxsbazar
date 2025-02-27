import useAuth from "@/store/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRouteGird = () => {
  const { authUser } = useAuth();
  const location = useLocation();

  // Define routes that only super-admin can access
  const restrictedRoutes = ["/users", "/role", "/permission"];

  // Check if the current route is restricted and if the user is not a super-admin
  const isRestricted = restrictedRoutes.includes(location.pathname);
  const isSuperAdmin = authUser?.role?.name === "SUPER-ADMIN";

  if (!authUser) {
    return <Navigate to="/login" />;
  }

  // If the route is restricted and the user is not a super-admin, block access
  if (isRestricted && !isSuperAdmin) {
    return <Navigate to="/unauthorized" />; // Redirect to an unauthorized page or somewhere else
  }

  return <Outlet />;
};

export default PrivateRouteGird;
