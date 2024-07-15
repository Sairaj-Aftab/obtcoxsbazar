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
            {permissions.includes("DAILY-BUS-SCHEDULE") && (
              <li
                className={`${
                  location.pathname === "/daily-bus-schedule-list" && "active"
                }`}
              >
                <Link to="/daily-bus-schedule-list">
                  <i class="fa fa-list-alt" aria-hidden="true"></i>{" "}
                  <span>Daily Bus Schedule</span>
                </Link>
              </li>
            )}

            {permissions.includes("NOTICE-BOARD") && (
              <li className={`${location.pathname === "/notice" && "active"}`}>
                <Link to="/notice">
                  <i class="fa fa-newspaper-o" aria-hidden="true"></i>{" "}
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
                  <i class="fa fa-location-arrow" aria-hidden="true"></i>{" "}
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
                  <i class="fa fa-bus" aria-hidden="true"></i>{" "}
                  <span>Paribahan Users</span>
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
                  <i class="fa fa-arrow-right" aria-hidden="true"></i>{" "}
                  <span>Role</span>
                </Link>
              </li>
            )}
            {permissions.includes("PERMISSION") && (
              <li
                className={`${location.pathname === "/permission" && "active"}`}
              >
                <Link to="/permission">
                  <i class="fa fa-key" aria-hidden="true"></i>{" "}
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
