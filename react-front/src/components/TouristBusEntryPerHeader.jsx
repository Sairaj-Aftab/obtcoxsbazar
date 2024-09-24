import { Link, Outlet, useLocation } from "react-router-dom";

const TouristBusEntryPerHeader = () => {
  const { pathname } = useLocation();

  return (
    <div>
      <div className="bg-white rounded-t-md flex gap-3 w-fit mx-auto mt-2 sm:mt-5 p-2">
        <Link
          to="/tourist-bus-entry-permission"
          className={`${
            pathname === "/tourist-bus-entry-permission"
              ? "bg-white text-primary-color"
              : "bg-primary-color text-white"
          } text-sm sm:text-base font-medium py-1 px-2 rounded-md`}
        >
          Tourist Bus Permission
        </Link>
        <Link
          to="/tourist-bus-entry-permission/form"
          className={`${
            pathname === "/tourist-bus-entry-permission/form"
              ? "bg-white text-primary-color"
              : "bg-primary-color text-white"
          } text-sm sm:text-base font-medium py-1 px-2 rounded-md`}
        >
          New Application Form
        </Link>
      </div>
      <Outlet />
    </div>
  );
};

export default TouristBusEntryPerHeader;
