import { BiMenu, BiX } from "react-icons/bi";
import { useState } from "react";
import { useSelector } from "react-redux";
import logo from "../../assets/image/white_yellow.png";
import policeLogo from "../../assets/image/police_logo.png";
import { Link, Outlet, useLocation } from "react-router-dom";
import { paribahanAuthData } from "../../features/paribahanAuth/paribahanAuthSlice";

const Nav = () => {
  const { paribahanAuth } = useSelector(paribahanAuthData);
  const [open, setOpen] = useState(false);
  const { pathname: pathName } = useLocation();
  return (
    <>
      {pathName === "/display" ? null : (
        <header className="bg-primary-color">
          <div className="container mx-auto flex items-center flex-col">
            {pathName === "/" && (
              <div className="z-50 flex flex-col items-center">
                <h1 className="text-white text-3xl font-bold">
                  Online Bus Terminal
                </h1>
                <span className="text-white text-xl font-semibold">
                  Cox&apos;s Bazar
                </span>
              </div>
            )}
            {/* Desktop Menu */}
            <div className="w-full md:flex hidden items-center md:justify-center md:gap-10">
              <Link to="/">
                <img src={logo} alt="OBT" sizes="100vw" className="w-20" />
              </Link>

              <nav className="flex space-x-4 py-4">
                <Link
                  to="/"
                  className={`text-base font-medium text-white border border-transparent ${
                    pathName === "/" && "border-white"
                  } hover:border-white py-1 px-2 rounded-sm`}
                >
                  Home
                </Link>
                <Link
                  to="/all-bus-schedules"
                  className={`text-base font-medium text-white border border-transparent ${
                    pathName === "/all-bus-schedules" && "border-white"
                  } hover:border-white py-1 px-2 rounded-sm`}
                >
                  All Bus Schedules
                </Link>
                <Link
                  to="/all-bus-services"
                  className={`text-base font-medium text-white border border-transparent ${
                    pathName === "/all-bus-services" && "border-white"
                  } hover:border-white py-1 px-2 rounded-sm`}
                >
                  All Bus Services
                </Link>

                <Link
                  to="/tourist-bus-entry-permission"
                  className={`text-base font-medium text-white border border-transparent ${
                    [
                      "/tourist-bus-entry-permission",
                      "/tourist-bus-entry-permission/form",
                    ].includes(pathName) && "border-white"
                  } hover:border-white py-1 px-2 rounded-sm`}
                >
                  Tourist Bus Permission
                </Link>
                <Link
                  to="/about"
                  className={`text-base font-medium text-white border border-transparent ${
                    pathName === "/about" && "border-white"
                  } hover:border-white py-1 px-2 rounded-sm`}
                >
                  About
                </Link>
                <Link
                  to="/contact-us"
                  className={`text-base font-medium text-white border border-transparent ${
                    pathName === "/contact-us" && "border-white"
                  } hover:border-white py-1 px-2 rounded-sm`}
                >
                  Contact Us
                </Link>
                {!paribahanAuth && (
                  <Link
                    to="/login"
                    className={`text-base font-medium text-white border border-transparent ${
                      pathName === "/login" && "border-white"
                    } hover:border-white py-1 px-2 rounded-sm`}
                  >
                    Login
                  </Link>
                )}
                {paribahanAuth && (
                  <Link
                    to="/profile"
                    className={`text-base font-medium text-white border border-transparent ${
                      [
                        "/profile",
                        "/profile/regular-schedules",
                        "/profile/bus-info",
                        "/profile/guide-info",
                        "/profile/driver-info",
                        "/profile/reviews",
                      ].includes(pathName) && "border-white"
                    } hover:border-white py-1 px-2 rounded-sm`}
                  >
                    Profile
                  </Link>
                )}
              </nav>
              <Link to="/">
                <img
                  src={policeLogo}
                  alt="OBT"
                  sizes="100vw"
                  className="w-20 bg-white rounded-full"
                />
              </Link>
            </div>
            {/* Mobile Nav */}
            <div className="z-50 py-2 flex md:hidden w-full px-5 justify-between items-center">
              <Link to="/">
                <img src={logo} alt="OBT" sizes="100vw" className="w-16" />
              </Link>
              {open ? (
                <BiX
                  className="text-white"
                  size={35}
                  onClick={() => setOpen(!open)}
                />
              ) : (
                <BiMenu
                  className="text-white"
                  size={35}
                  onClick={() => setOpen(!open)}
                />
              )}
            </div>
            <nav
              className={`flex flex-col  gap-3
        md:hidden bg-primary-color fixed w-full z-40 top-0 overflow-y-auto bottom-0 ${
          pathName === "/" ? "pt-32" : "pt-16"
        } pb-3 px-4 duration-500 ${open ? "left-0" : "left-[-100%]"}
        `}
            >
              <Link
                onClick={() => setOpen(!open)}
                to="/"
                className={`text-base font-medium text-white border border-transparent ${
                  pathName === "/" && "border-white"
                } hover:border-white py-1 px-2 rounded-sm`}
              >
                Home
              </Link>
              <Link
                onClick={() => setOpen(!open)}
                to="/all-bus-schedules"
                className={`text-base font-medium text-white border border-transparent ${
                  pathName === "/all-bus-schedules" && "border-white"
                } hover:border-white py-1 px-2 rounded-sm`}
              >
                All Bus Schedules
              </Link>
              <Link
                onClick={() => setOpen(!open)}
                to="/all-bus-services"
                className={`text-base font-medium text-white border border-transparent ${
                  pathName === "/all-bus-services" && "border-white"
                } hover:border-white py-1 px-2 rounded-sm`}
              >
                All Bus Services
              </Link>

              <Link
                onClick={() => setOpen(!open)}
                to="/tourist-bus-entry-permission"
                className={`text-base font-medium text-white border border-transparent ${
                  pathName === "/tourist-bus-entry-permission" && "border-white"
                } hover:border-white py-1 px-2 rounded-sm`}
              >
                Tourist Bus Permission
              </Link>
              <Link
                onClick={() => setOpen(!open)}
                to="/about"
                className={`text-base font-medium text-white border border-transparent ${
                  pathName === "/about" && "border-white"
                } hover:border-white py-1 px-2 rounded-sm`}
              >
                About
              </Link>
              <Link
                onClick={() => setOpen(!open)}
                to="/contact-us"
                className={`text-base font-medium text-white border border-transparent ${
                  pathName === "/contact-us" && "border-white"
                } hover:border-white py-1 px-2 rounded-sm`}
              >
                Contact Us
              </Link>
              {!paribahanAuth && (
                <Link
                  onClick={() => setOpen(!open)}
                  to="/login"
                  className={`text-base font-medium text-white border border-transparent ${
                    pathName === "/login" && "border-white"
                  } hover:border-white py-1 px-2 rounded-sm`}
                >
                  Login
                </Link>
              )}
              {paribahanAuth && (
                <Link
                  onClick={() => setOpen(!open)}
                  to="/profile"
                  className={`text-base font-medium text-white border border-transparent ${
                    pathName === "/profile" && "border-white"
                  } hover:border-white py-1 px-2 rounded-sm`}
                >
                  Profile
                </Link>
              )}
            </nav>
          </div>
        </header>
      )}
      <Outlet />
    </>
  );
};

export default Nav;
