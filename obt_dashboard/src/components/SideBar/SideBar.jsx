import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { authData } from "../../features/auth/authSlice";
// import GetUserData from "../../hooks/getUserData";

const SideBar = () => {
  const location = useLocation();
  const { authUser } = useSelector(authData);
  const permissions =
    authUser?.role?.permissions?.map((permission) => permission.name) || [];

  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-inner slimscroll">
        <div id="sidebar-menu" className="sidebar-menu">
          <ul>
            <li className="menu-title">
              <span>Main</span>
            </li>
            {permissions.includes("DASHBOARD") && (
              <li className={`${location.pathname === "/" && "active"}`}>
                <Link to="/">
                  <i className="fe fe-home" aria-hidden="true"></i>{" "}
                  <span>Dashboard</span>
                </Link>
              </li>
            )}

            {permissions.includes("REGULAR-BUS-SCHEDULE") && (
              <li
                className={`${
                  location.pathname === "/regular-bus-schedule" && "active"
                }`}
              >
                <Link to="/regular-bus-schedule">
                  <i className="fa fa-list-alt" aria-hidden="true"></i>{" "}
                  <span>Regular Bus Schedule</span>
                </Link>
              </li>
            )}

            {permissions.includes("TOTAL-BUS-SCHEDULE") && (
              <li
                className={`${
                  location.pathname === "/total-bus-schedule-list" && "active"
                }`}
              >
                <Link to="/total-bus-schedule-list">
                  <i className="fa fa-list-alt" aria-hidden="true"></i>{" "}
                  <span>Schedule Log Book</span>
                </Link>
              </li>
            )}

            {permissions.includes("NOTICE-BOARD") && (
              <li className={`${location.pathname === "/notice" && "active"}`}>
                <Link to="/notice">
                  <i className="fa fa-newspaper-o" aria-hidden="true"></i>{" "}
                  <span>Notice Board</span>
                </Link>
              </li>
            )}

            {permissions.includes("ARRIVAL-DESTINATION") && (
              <li
                className={`${
                  location.pathname === "/destination" && "active"
                }`}
              >
                <Link to="/destination">
                  <i className="fa fa-location-arrow" aria-hidden="true"></i>{" "}
                  <span>Arrival & Destination</span>
                </Link>
              </li>
            )}

            {permissions.includes("PARIBAHAN-USERS") && (
              <li
                className={`${
                  location.pathname === "/paribahan-users" && "active"
                }`}
              >
                <Link to="/paribahan-users">
                  <i className="fa fa-bus" aria-hidden="true"></i>{" "}
                  <span>Paribahan Users</span>
                </Link>
              </li>
            )}

            {permissions.includes("BUS-INFO") && (
              <li
                className={`${location.pathname === "/bus-info" && "active"}`}
              >
                <Link to="/bus-info">
                  <i className="fa fa-bus" aria-hidden="true"></i>{" "}
                  <span>Bus Info</span>
                </Link>
              </li>
            )}
            {permissions.includes("GUIDE-INFO") && (
              <li
                className={`${location.pathname === "/guide-info" && "active"}`}
              >
                <Link to="/guide-info">
                  <i className="fa fa-user" aria-hidden="true"></i>{" "}
                  <span>Guide Info</span>
                </Link>
              </li>
            )}
            {permissions.includes("DRIVER-INFO") && (
              <li
                className={`${
                  location.pathname === "/driver-info" && "active"
                }`}
              >
                <Link to="/driver-info">
                  <i className="fa fa-user" aria-hidden="true"></i>{" "}
                  <span>Driver Info</span>
                </Link>
              </li>
            )}
            {permissions.includes("TOURIST-BUS-PERMISSION") && (
              <li
                className={`${
                  location.pathname === "/tourist-bus-permission" && "active"
                }`}
              >
                <Link to="/tourist-bus-permission">
                  <i className="fa fa-pencil-square-o"></i>{" "}
                  <span>Tourist Bus Permission</span>
                </Link>
              </li>
            )}
            {permissions.includes("REVIEWS") && (
              <li className={`${location.pathname === "/review" && "active"}`}>
                <Link to="/review">
                  <i className="fa fa-star" aria-hidden="true"></i>{" "}
                  <span>Reviews</span>
                </Link>
              </li>
            )}

            {permissions.includes("USERS") && (
              <li className={`${location.pathname === "/users" && "active"}`}>
                <Link to="/users">
                  <i className="fe fe-users" aria-hidden="true"></i>{" "}
                  <span>Users</span>
                </Link>
              </li>
            )}
            {permissions.includes("ROLE") && (
              <li className={`${location.pathname === "/role" && "active"}`}>
                <Link to="/role">
                  <i className="fa fa-arrow-right" aria-hidden="true"></i>{" "}
                  <span>Role</span>
                </Link>
              </li>
            )}
            {permissions.includes("PERMISSION") && (
              <li
                className={`${location.pathname === "/permission" && "active"}`}
              >
                <Link to="/permission">
                  <i className="fa fa-key" aria-hidden="true"></i>{" "}
                  <span>Permission</span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
