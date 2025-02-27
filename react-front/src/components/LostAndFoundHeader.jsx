import { Link, Outlet, useLocation } from "react-router-dom";
import NoticeFromAdmin from "./NoticeFromAdmin";

const LostAndFoundHeader = () => {
  const { pathname } = useLocation();

  return (
    <div>
      <div className="bg-white text-base font-semibold pt-1">
        <NoticeFromAdmin status="Tourist-Bus-Permission" />
      </div>
      <div className="bg-white rounded-t-md flex gap-3 w-fit mx-auto mt-1 sm:mt-3 p-2">
        <Link
          to="/lost-found"
          className={`${
            pathname === "/lost-found"
              ? "bg-white text-primary-color"
              : "bg-primary-color text-white"
          } text-sm sm:text-base font-medium py-1 px-2 rounded-md`}
        >
          Lost And Found
        </Link>
        <Link
          to="/lost-found/form"
          className={`${
            pathname === "/lost-found/form"
              ? "bg-white text-primary-color"
              : "bg-primary-color text-white"
          } text-sm sm:text-base font-medium py-1 px-2 rounded-md`}
        >
          New Entry Form
        </Link>
      </div>
      <Outlet />
    </div>
  );
};

export default LostAndFoundHeader;
