import { Link, useLocation } from "react-router-dom";
import Avatar from "../Avatar/Avatar";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { logoutAuthUser } from "../../features/auth/authApiSlice";
import { authData, setLogoutUser } from "../../features/auth/authSlice";
import { useState } from "react";
import ColorLogo from "../Logo/ColorLogo";
import SmallLogo from "../Logo/SmallLogo";

const Header = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector(authData);
  const location = useLocation();
  const permissions =
    authUser?.role?.permissions?.map((permission) => permission.name) || [];
  console.log(authUser);
  const [toggle, setToggle] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    swal({
      title: "Are you sure?",
      text: "",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal(`Successfully logout`, {
          icon: "success",
        });
        dispatch(logoutAuthUser());
        dispatch(setLogoutUser());
      } else {
        swal("You are safe!");
      }
    });
  };
  return (
    <div className="header">
      <div className="header-left">
        <Link to="/" className="logo">
          <ColorLogo />
        </Link>
        <Link to="/" className="logo logo-small">
          <SmallLogo width="30" height="30" />
        </Link>
      </div>

      <a
        className="mobile_btn"
        id="mobile_btn"
        onClick={() => setToggle(!toggle)}
      >
        <i className="fa fa-bars"></i>
      </a>

      {/* Mobile SideBar */}

      {toggle && (
        <div className="mobile_sidemenu">
          <div className="mobile-header">
            <h1>OBTCOXSBAZAR</h1>
            <span onClick={() => setToggle(!toggle)}>&#x2715;</span>
          </div>
          <ul>
            {permissions.includes("DASHBOARD") && (
              <li
                onClick={() => setToggle(!toggle)}
                className={`${location.pathname === "/" && "active"}`}
              >
                <Link to="/">
                  <i className="fe fe-home" aria-hidden="true"></i>{" "}
                  <span>Dashboard</span>
                </Link>
              </li>
            )}
            {permissions.includes("DAILY-BUS-SCHEDULE") && (
              <li
                onClick={() => setToggle(!toggle)}
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
              <li
                onClick={() => setToggle(!toggle)}
                className={`${location.pathname === "/notice" && "active"}`}
              >
                <Link to="/notice">
                  <i class="fa fa-newspaper-o" aria-hidden="true"></i>{" "}
                  <span>Notice Board</span>
                </Link>
              </li>
            )}

            {permissions.includes("ARRIVAL-DESTINATION") && (
              <li
                onClick={() => setToggle(!toggle)}
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
                onClick={() => setToggle(!toggle)}
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
              <li
                onClick={() => setToggle(!toggle)}
                className={`${location.pathname === "/users" && "active"}`}
              >
                <Link to="/users">
                  <i className="fe fe-users" aria-hidden="true"></i>{" "}
                  <span>Users</span>
                </Link>
              </li>
            )}
            {permissions.includes("ROLE") && (
              <li
                onClick={() => setToggle(!toggle)}
                className={`${location.pathname === "/role" && "active"}`}
              >
                <Link to="/role">
                  <i class="fa fa-arrow-right" aria-hidden="true"></i>{" "}
                  <span>Role</span>
                </Link>
              </li>
            )}
            {permissions.includes("PERMISSION") && (
              <li
                onClick={() => setToggle(!toggle)}
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
      )}

      <ul className="nav user-menu">
        {/* <li className="nav-item dropdown noti-dropdown">
          <a
            href="#"
            className="dropdown-toggle nav-link"
            data-toggle="dropdown"
          >
            <i className="fe fe-bell"></i>{" "}
            <span className="badge badge-pill">3</span>
          </a>
          <div className="dropdown-menu notifications">
            <div className="topnav-dropdown-header">
              <span className="notification-title">Notifications</span>
              <a href="javascript:void(0)" className="clear-noti">
                {" "}
                Clear All{" "}
              </a>
            </div>
            <div className="noti-content">
              <ul className="notification-list">
                <li className="notification-message">
                  <a href="#">
                    <div className="media">
                      <span className="avatar avatar-sm">
                        <Avatar
                          classList="avatar-img rounded-circle"
                          alt="User Image"
                        />
                      </span>
                      <div className="media-body">
                        <p className="noti-details">
                          <span className="noti-title">Dr. Ruby Perrin</span>{" "}
                          Schedule{" "}
                          <span className="noti-title">her appointment</span>
                        </p>
                        <p className="noti-time">
                          <span className="notification-time">4 mins ago</span>
                        </p>
                      </div>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
            <div className="topnav-dropdown-footer">
              <a href="#">View all Notifications</a>
            </div>
          </div>
        </li> */}

        <li className="nav-item dropdown has-arrow">
          <a
            href="#"
            className="dropdown-toggle nav-link"
            data-toggle="dropdown"
          >
            <span className="user-img">
              <Avatar
                classList="rounded-circle"
                src={authUser?.profile_photo}
                alt="Ryan Taylor"
                width="31"
              />
            </span>
          </a>
          <div className="dropdown-menu">
            <div className="user-header">
              <div className="avatar avatar-sm">
                <Avatar
                  src={authUser?.profile_photo}
                  classList="avatar-img rounded-circle"
                  alt="User Image"
                />
              </div>
              <div className="user-text">
                <h6>{authUser?.userName}</h6>
                <p className="text-muted mb-0">{authUser?.role?.name}</p>
              </div>
            </div>
            <Link className="dropdown-item" to="/">
              My Profile
            </Link>
            <Link className="dropdown-item" to="/">
              Settings
            </Link>
            <a className="dropdown-item" href="/login" onClick={handleLogout}>
              Logout
            </a>
          </div>
        </li>
      </ul>

      {/* <ul className="nav user-menu">
        <li className="nav-item dropdown noti-dropdown" ref={dropDownRef}>
          <a
            href="#"
            className="dropdown-toggle nav-link"
            data-toggle="dropdown"
            onClick={toggleMenu}
          >
            <i className="fe fe-bell"></i>{" "}
            <span className="badge badge-pill">3</span>
          </a>
          {open && (
            <div
              className="dropdown-menu notifications"
              style={{ transform: "translateX(-305px)", display: "block" }}
            >
              <div className="topnav-dropdown-header">
                <span className="notification-title">Notifications</span>
                <a href="javascript:void(0)" className="clear-noti">
                  Clear All
                </a>
              </div>
              <div className="noti-content">
                <ul className="notification-list">
                  <li className="notification-message">
                    <a href="#">
                      <div className="media">
                        <span className="avatar avatar-sm">
                          <Avatar
                            alt="User Image"
                            classList="avatar-img rounded-circle"
                          />
                        </span>
                        <div className="media-body">
                          <p className="noti-details">
                            <span className="noti-title">Carl Kelly</span> send
                            a message{" "}
                            <span className="noti-title"> to his doctor</span>
                          </p>
                          <p className="noti-time">
                            <span className="notification-time">
                              12 mins ago
                            </span>
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="topnav-dropdown-footer">
                <a href="#">View all Notifications</a>
              </div>
            </div>
          )}
        </li>

        <li
          className={`nav-item dropdown has-arrow ${profileOpen ? "show" : ""}`}
          ref={profileDropRef}
        >
          <a
            href="#"
            className="dropdown-toggle nav-link"
            data-toggle="dropdown"
            aria-expanded={profileOpen}
            onClick={profileToggleMenu}
          >
            <span className="user-img">
              <Avatar alt="Ryan Taylor" classList="rounded-circle" width="31" />
            </span>
          </a>
          {profileOpen && (
            <div
              className={`dropdown-menu ${profileOpen ? "show" : ""}`}
              style={{ transform: "translate(-123px, 0)", display: "block" }}
            >
              <div className="user-header">
                <div className="avatar avatar-sm">
                  <Avatar
                    alt="User Image"
                    classList="avatar-img rounded-circle"
                  />
                </div>
                <div className="user-text">
                  <h6>Ryan Taylor</h6>
                  <p className="text-muted mb-0">Administrator</p>
                </div>
              </div>
              <a className="dropdown-item" href="profile.html">
                My Profile
              </a>
              <a className="dropdown-item" href="settings.html">
                Settings
              </a>
              <a className="dropdown-item" href="login.html">
                Logout
              </a>
            </div>
          )}
        </li>
      </ul> */}
    </div>
  );
};

export default Header;
