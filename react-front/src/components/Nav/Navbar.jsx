import { BiHome, BiMenu, BiX } from "react-icons/bi";
import { useState } from "react";
import logo from "../../assets/image/white_yellow.png";
import policeLogo from "../../assets/image/police_logo.png";
import { Link, Outlet, useLocation } from "react-router-dom";
import useParibahanAuth from "../../store/useParibahanAuth";
import { Menu, X } from "lucide-react";

const MobileMenu = ({ isOpen, onClose }) => {
  const { paribahanAuth } = useParibahanAuth();
  const { pathname: pathName } = useLocation();
  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-50 transition-opacity duration-300 ease-in-out ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`absolute right-0 top-16 bg-primary-color shadow-lg rounded-tl-lg rounded-bl-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          <button onClick={onClose} className="absolute top-4 right-4">
            <X className="h-6 w-6 text-white" />
          </button>
          <div className="mt-8 flex flex-col gap-2">
            <Link
              to="/"
              onClick={onClose}
              className={`text-sm font-medium text-white border border-transparent ${
                pathName === "/" && "border-white"
              } hover:border-white py-1 px-2 rounded-sm`}
            >
              Home
            </Link>
            <Link
              to="/all-bus-schedules"
              onClick={onClose}
              className={`text-sm font-medium text-white border border-transparent ${
                pathName === "/all-bus-schedules" && "border-white"
              } hover:border-white py-1 px-2 rounded-sm`}
            >
              All Bus Schedules
            </Link>
            <Link
              to="/all-bus-services"
              onClick={onClose}
              className={`text-sm font-medium text-white border border-transparent ${
                pathName === "/all-bus-services" && "border-white"
              } hover:border-white py-1 px-2 rounded-sm`}
            >
              All Bus Services
            </Link>

            <Link
              to="/tourist-bus-entry-permission"
              onClick={onClose}
              className={`text-sm font-medium text-white border border-transparent ${
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
              onClick={onClose}
              className={`text-sm font-medium text-white border border-transparent ${
                pathName === "/about" && "border-white"
              } hover:border-white py-1 px-2 rounded-sm`}
            >
              About
            </Link>
            <Link
              to="/contact-us"
              onClick={onClose}
              className={`text-sm font-medium text-white border border-transparent ${
                pathName === "/contact-us" && "border-white"
              } hover:border-white py-1 px-2 rounded-sm`}
            >
              Contact Us
            </Link>
            {!paribahanAuth && (
              <Link
                to="/login"
                onClick={onClose}
                className={`text-sm font-medium text-white border border-transparent ${
                  pathName === "/login" && "border-white"
                } hover:border-white py-1 px-2 rounded-sm`}
              >
                Login
              </Link>
            )}
            {paribahanAuth && (
              <Link
                to="/profile"
                onClick={onClose}
                className={`text-sm font-medium text-white border border-transparent ${
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
          </div>
        </div>
      </div>
    </div>
  );
};
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { paribahanAuth } = useParibahanAuth();
  const { pathname: pathName } = useLocation();

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "All Bus Schedules", path: "/drive" },
    {
      label: "All Bus Services",
      path: "/popular-destination",
    },
    {
      label: "Business",
      path: "/business",
    },
    {
      label: "About",
      path: "/about",
    },
    {
      label: "Help",
      path: "/help",
    },
  ];
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
            <nav className="relative w-full py-1">
              <div className="flex justify-between">
                {/* Logo and brand */}
                <div className="flex items-center pl-3 md:pl-0">
                  <Link to="/">
                    <img
                      src={logo}
                      alt="OBT"
                      sizes="100vw"
                      className="w-16 md:w-20"
                    />
                  </Link>
                </div>

                {/* Desktop menu */}
                <div className="hidden md:flex items-center">
                  <div className="flex space-x-4">
                    <Link
                      to="/"
                      className={`text-sm font-medium text-white border border-transparent ${
                        pathName === "/" && "border-white"
                      } hover:border-white py-1 px-2 rounded-sm`}
                    >
                      Home
                    </Link>
                    <Link
                      to="/all-bus-schedules"
                      className={`text-sm font-medium text-white border border-transparent ${
                        pathName === "/all-bus-schedules" && "border-white"
                      } hover:border-white py-1 px-2 rounded-sm`}
                    >
                      All Bus Schedules
                    </Link>
                    <Link
                      to="/all-bus-services"
                      className={`text-sm font-medium text-white border border-transparent ${
                        pathName === "/all-bus-services" && "border-white"
                      } hover:border-white py-1 px-2 rounded-sm`}
                    >
                      All Bus Services
                    </Link>

                    <Link
                      to="/tourist-bus-entry-permission"
                      className={`text-sm font-medium text-white border border-transparent ${
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
                      className={`text-sm font-medium text-white border border-transparent ${
                        pathName === "/about" && "border-white"
                      } hover:border-white py-1 px-2 rounded-sm`}
                    >
                      About
                    </Link>
                    <Link
                      to="/contact-us"
                      className={`text-sm font-medium text-white border border-transparent ${
                        pathName === "/contact-us" && "border-white"
                      } hover:border-white py-1 px-2 rounded-sm`}
                    >
                      Contact Us
                    </Link>
                    {!paribahanAuth && (
                      <Link
                        to="/login"
                        className={`text-sm font-medium text-white border border-transparent ${
                          pathName === "/login" && "border-white"
                        } hover:border-white py-1 px-2 rounded-sm`}
                      >
                        Login
                      </Link>
                    )}
                    {paribahanAuth && (
                      <Link
                        to="/profile"
                        className={`text-sm font-medium text-white border border-transparent ${
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
                  </div>
                </div>

                <div className="hidden md:flex items-center">
                  <Link to="/">
                    <img
                      src={policeLogo}
                      alt="OBT"
                      sizes="100vw"
                      className="w-20 bg-white rounded-full"
                    />
                  </Link>
                </div>

                {/* Mobile menu button */}
                <div className="flex md:hidden items-center">
                  <button
                    onClick={() => setIsOpen(true)}
                    className="inline-flex items-center justify-center p-3 rounded-md text-gray-700 hover:text-primary hover:bg-gray-50 transition duration-300 ease-in-out"
                  >
                    <Menu className="h-6 w-6 text-white" />
                  </button>
                </div>
              </div>

              {/* Mobile menu */}
              {/* Mobile menu */}
              <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
            </nav>
          </div>
        </header>
      )}
      <Outlet />
    </>
  );
};

export default Navbar;
