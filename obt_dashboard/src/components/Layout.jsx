import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import useAuth from "@/store/useAuth";
import {
  AlignLeft,
  Bell,
  LayoutDashboard,
  ListTodo,
  Newspaper,
  MapPin,
  Bus,
  User,
  FileEdit,
  Star,
  Users,
  ArrowRight,
  Key,
  BadgeHelp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";

export default function Layout() {
  const { authUser, setLogout } = useAuth();
  const permissions =
    authUser?.role?.permissions?.map((permission) => permission.name) || [];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogOut = async () => {
    await setLogout();
  };

  // Close the sidebar when a nav item is clicked
  const handleNavItemClick = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false); // Close sidebar on small screens
    }
  };
  const menuItems = [
    {
      to: "/",
      name: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
      permission: "DASHBOARD",
    },
    {
      to: "/regular-bus-schedule",
      name: "Regular Bus Schedule",
      icon: <ListTodo className="w-4 h-4" />,
      permission: "REGULAR-BUS-SCHEDULE",
    },
    {
      to: "/total-bus-schedule-list",
      name: "Schedule Log Book",
      icon: <ListTodo className="w-4 h-4" />,
      permission: "TOTAL-BUS-SCHEDULE",
    },
    {
      to: "/notice",
      name: "Notice Board",
      icon: <Newspaper className="w-4 h-4" />,
      permission: "NOTICE-BOARD",
    },
    {
      to: "/destination",
      name: "Arrival & Destination",
      icon: <MapPin className="w-4 h-4" />,
      permission: "ARRIVAL-DESTINATION",
    },
    {
      to: "/paribahan-users",
      name: "Paribahan Users",
      icon: <Bus className="w-4 h-4" />,
      permission: "PARIBAHAN-USERS",
    },
    {
      to: "/bus-info",
      name: "Bus Info",
      icon: <Bus className="w-4 h-4" />,
      permission: "BUS-INFO",
    },
    {
      to: "/guide-info",
      name: "Guide Info",
      icon: <User className="w-4 h-4" />,
      permission: "GUIDE-INFO",
    },
    {
      to: "/driver-info",
      name: "Driver Info",
      icon: <User className="w-4 h-4" />,
      permission: "DRIVER-INFO",
    },
    {
      to: "/tourist-bus-permission",
      name: "Tourist Bus Permission",
      icon: <FileEdit className="w-4 h-4" />,
      permission: "TOURIST-BUS-PERMISSION",
    },
    {
      to: "/lost-found",
      name: "Lost & Found",
      icon: <BadgeHelp className="w-4 h-4" />,
      permission: "LOST-AND-FOUND",
    },
    {
      to: "/review",
      name: "Reviews",
      icon: <Star className="w-4 h-4" />,
      permission: "REVIEWS",
    },
    {
      to: "/users",
      name: "Users",
      icon: <Users className="w-4 h-4" />,
      permission: "USERS",
    },
    {
      to: "/role",
      name: "Role",
      icon: <ArrowRight className="w-4 h-4" />,
      permission: "ROLE",
    },
    {
      to: "/permission",
      name: "Permission",
      icon: <Key className="w-4 h-4" />,
      permission: "PERMISSION",
    },
  ];

  return (
    <>
      {/* Header Section */}
      <div className="fixed top-0 left-0 w-full z-[99999] flex items-center justify-between bg-white shadow-md py-1 px-3">
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-2xl md:hidden text-black"
          >
            <AlignLeft className="w-8 h-8" />
          </button>
          <h1 className="text-xl font-bold hidden md:block text-primary">
            OBTCOXSBAZAR
          </h1>
          <Input
            type="text"
            aria-label="Search"
            placeholder="Search"
            className="hidden w-min-[200px] md:block border border-gray-300 rounded-full py-1 px-3 ml-3 outline-none"
          />
        </div>
        <div className="flex items-center">
          <Bell className="w-6 h-6 cursor-pointer mr-4" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <img
                src="https://picsum.photos/200"
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover cursor-pointer"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogOut}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Sidebar Section */}
      <div className="flex mt-[48px] h-[calc(100vh-48px)]">
        <nav
          // style={{ height: "calc(100vh - 48px)" }}
          className={`bg-white w-64 lg:w-1/6 h-full fixed top-[48px] left-0 lg:static z-[99999] transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform lg:translate-x-0 lg:overflow-y-auto`}
        >
          {menuItems?.map(
            ({ to, name, icon, permission, count }) =>
              permissions.includes(permission) && (
                <NavLink
                  key={to}
                  to={to}
                  onClick={handleNavItemClick}
                  className={({ isActive }) =>
                    `flex items-center text-sm font-medium text-black relative ${
                      isActive ? "bg-primary text-white" : ""
                    } hover:bg-primary hover:text-white px-3 py-3`
                  }
                >
                  {icon}{" "}
                  <p className="ml-3">
                    <span>{name}</span>
                    {count && (
                      <span className="absolute right-3 top-3 p-1 text-xs bg-yellow-600 rounded-full flex justify-center items-center">
                        {count}
                      </span>
                    )}
                  </p>
                </NavLink>
              )
          )}
        </nav>
        {/* Overlay for Sidebar on Small Screens */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
        {/* Content Section */}
        <div
          // style={{ height: "calc(100vh - 48px)" }}
          className={`flex-1 h-full overflow-y-auto bg-[#f5f7fa] px-3 pb-10 `}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
}
